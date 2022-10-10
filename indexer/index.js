import { TzKTAPI, TzKTEvents } from '@asbjornenge/tzkt-api'
import { bytes2Char } from '@taquito/utils'
import Sentry from '@sentry/node'
import fetch from 'node-fetch'
import ohash from 'object-hash'
import {
  TZKT_API,
  RPC_ENDPOINT,
  NETWORK_NAME,
  IPFS_ENDPOINT,
  SCRAPE_INTERVAL,
  CHAINBORN_CONTRACT,
  CHAINBORN_DATASTORE,
  COLLECTION_INDEXER,
  COLLECTION_REINDEX_INTERVAL,
  COLLECTION_INDEXER_BATCH_SIZE,
  COLLECTION_INDEXER_MAX_UPDATES
} from './config.js'
import {
  getClient
} from './utils.js'

const api = new TzKTAPI({ BASE: TZKT_API })

/** HELPERS **/

function getUTCDate(date=null) {
  if (date) return new Date(new Date(date).toUTCString())
  else return new Date(new Date().toUTCString())
}

function getDateMaybe(date) {
  if (date === null) 
    return null
  try {
    return getUTCDate(date)
  } catch(e) {
    return null
  }
}

/** STORAGE **/

async function syncContractStorage(client) {
  const storage = await api.contracts.contractsGetStorage({ address: CHAINBORN_CONTRACT })
  const config = {
    NETWORK_NAME: NETWORK_NAME,
    RPC_ENDPOINT: RPC_ENDPOINT,
    CHAINBORN_CONTRACT: CHAINBORN_CONTRACT,
    CHAINBORN_DATASTORE: CHAINBORN_DATASTORE
  }
  await client.query(`
    insert into config (network, config, storage) values ($1, $2, $3)
    on conflict on constraint config_pkey
    do update set
      network=$1,
      config=$2,
      storage=$3
  `, [NETWORK_NAME, config, storage])
  console.log(`Updated config and contract storage for ${NETWORK_NAME}`)
}

/** HEROES **/

function heroUid(h) { return `${h.token_address}__${h.token_id}` } 

async function syncHeroes(client) {
  const storage = await api.contracts.contractsGetStorage({ address: CHAINBORN_DATASTORE })
  const onchain_heroes = await api.bigMaps.bigMapsGetKeys({ id: storage.heroes, active: true, limit: 10000 })
  const index_heroes = await client.query(`select * from heroes where hero is not null`).then(r => r.rows)
  const index_heroes_hash = index_heroes.reduce((m,h) => { m[heroUid(h)] = h.hero_hash; return m },{})
  const heroes_with_updates = onchain_heroes.filter(h => {
    const uid = heroUid(h.value)
    return index_heroes_hash[uid] != ohash(h.value)
  })
  const updates = heroes_with_updates.map(h => {
    const bids = h.value.battles.reduce((bids,b) => {
      return bids.concat(b.value.battles)
    }, [])
    const _bids = "'"+bids.join('\',\'')+"'"
    return client.query(`update heroes set
      hero_owner=$3, 
      hero_hash=$4, 
      hero=$5, 
      name=$12,
      hero_synced_at=$6,
      summoned_at=$7,
      health=$8,
      strength=$9,
      experience=$10,
      experience_total=$11,
      wins=(select count(bid) from battles where bid in (${_bids}) and battle->'victor'->>'nat'='${h.value.token_id}' and battle->'victor'->>'address'='${h.value.token_address}'),
      losses=(select count(bid) from battles where bid in (${_bids}) and battle->'looser'->>'nat'='${h.value.token_id}' and battle->'looser'->>'address'='${h.value.token_address}')
    where
      token_id=$1 and token_address=$2`, [
      h.value.token_id,
      h.value.token_address,
      h.value.owner,
      ohash(h.value),
      h.value,
      getUTCDate(),
      getDateMaybe(h?.value?.summoned),
      h.value.attrs.health,
      h.value.attrs.strength,
      h.value.attrs.experience,
      h.value.attrs.experience_total,
      h.value.character.name
    ])
  })
  await Promise.all(updates)
  console.log('Heroes updates', heroes_with_updates.length)
}

async function syncCollection(collection_address, client) {
  const collection_storage = await api.contracts.contractsGetStorage({ address: collection_address })
  const token_metadata_bigmap = collection_storage?.assets ? collection_storage.assets.token_metadata : collection_storage.token_metadata
  const ledger_bigmap = collection_storage?.assets ? collection_storage.assets.ledger : collection_storage.ledger
  const token_metadata = await api.bigMaps.bigMapsGetKeys({ id: token_metadata_bigmap, limit: 10000, active: true })
  const ledger = await api.bigMaps.bigMapsGetKeys({ id: ledger_bigmap, limit: 10000, value: 1, active: true })
  const owners = ledger.filter(l => l.value > 0).reduce((coll, l) => { coll[l.key.nat] = l.key.address; return coll }, {})
  let updates = 0
  const all_collection_tokens = await client.query(`select * from heroes where token_address=$1`, [collection_address]).then(r => r.rows)
  let possible_updates = token_metadata.map(token => {
    const current_token_data = all_collection_tokens.filter(t => t.token_id == token.key)
    if (current_token_data.length > 0) {
      const synced_at = current_token_data[0].token_synced_at.getTime()
      const valid_to = synced_at + COLLECTION_REINDEX_INTERVAL
      if (valid_to > getUTCDate().getTime()) return
    }
    return async () => {
      updates++
      const token_info = bytes2Char(token.value.token_info[''])
      const ipfs_path = token_info.split('ipfs://')[1]
      const controller = new AbortController();
      const timeout = setTimeout(() => { controller.abort() }, 2000)
      const ipfs_res = await fetch(`${IPFS_ENDPOINT}/${ipfs_path}`, { signal: controller.signal })
      const metadata = await ipfs_res.json()
      await client.query(`
        insert into heroes (
          token_id, 
          token_address, 
          token_owner, 
          token_metadata, 
          token_synced_at
        ) 
        values (
          $1, $2, $3, $4, $5
        ) 
        on conflict 
        on constraint heroes_pkey do update set
          token_owner=$3,
          token_metadata=$4,
          token_synced_at=$5
      `, [
        token.key,
        collection_address, 
        owners[token.key],
        metadata, 
        getUTCDate()
      ])
    }
  }).filter(u => u != undefined)
  console.log(`Total amount of tokens to update: ${possible_updates.length}. Processing ${COLLECTION_INDEXER_MAX_UPDATES}...`)
  if (possible_updates.length > COLLECTION_INDEXER_MAX_UPDATES)
    possible_updates = possible_updates.slice(0, COLLECTION_INDEXER_MAX_UPDATES) 
  const update_batches = []
  for (let i = 0; i < possible_updates.length; i += COLLECTION_INDEXER_BATCH_SIZE) {
    update_batches.push(possible_updates.slice(i, i + COLLECTION_INDEXER_BATCH_SIZE))
  }
  for (let batch of update_batches) {
    await Promise.allSettled(batch.map(a => a()))
  }
  console.log(`Synced collection ${collection_address}; ${updates} updates, ${update_batches.length} batches`)
}

/** BATTLES **/

async function syncCancelledBattles(client) {
  const storage = await api.contracts.contractsGetStorage({ address: CHAINBORN_DATASTORE })
  const onchain_cancelled_battles = await api.bigMaps.bigMapsGetKeys({ id: storage.battles, active: false, limit: 10000 })
  const index_cancelled_battles = await client.query(`select * from battles where cancelled=true`).then(r => r.rows)
  const index_bids = index_cancelled_battles.map(b => b.bid)
  const updates = onchain_cancelled_battles
    .filter(ob => index_bids.indexOf(ob.key) < 0)
    .map(ob => client.query(`update battles set cancelled=true where bid=$1`, [ob.key]))
  await Promise.all(updates)
  console.log('Cancelled Battles', updates.length)
}

async function syncBattles(client) {
  const storage = await api.contracts.contractsGetStorage({ address: CHAINBORN_DATASTORE })
  const onchain_battles = await api.bigMaps.bigMapsGetKeys({ id: storage.battles, limit: 10000 })
  const index_battles = await client.query(`select * from battles`).then(r => r.rows)
  const index_battles_bid = index_battles.map(b => b.bid)
  const index_battles_hash = index_battles.reduce((m,h) => { m[h.bid] = h.hash; return m },{})
  const new_battles = onchain_battles.filter(h => {
    return index_battles_bid.indexOf(h.key) < 0
  })
  const update_battles = onchain_battles.filter(h => {
    return index_battles_bid.indexOf(h.key) >= 0 && index_battles_hash[h.key] != ohash(h.value)
  })
  const inserts = new_battles.map(h => {
    return client.query(`insert into battles (
      bid,
      challenger_owner,
      challenger_token_id,
      challenger_token_address,
      challenged_owner,
      challenged_token_id,
      challenged_token_address,
      challenge_time,
      start_time,
      finish_time,
      hash, 
      battle, 
      synced_at,
      loot,
      resolved
    ) values (
      $1,
      (select hero_owner from heroes where token_id=$2 and token_address=$3),
      $2,
      $3,
      (select hero_owner from heroes where token_id=$4 and token_address=$5),
      $4,
      $5,
      $6,
      $7,
      $8,
      $9, 
      $10,
      $11,
      $12,
      $13
    )`, [
      h.key,
      h.value.challenger.nat,
      h.value.challenger.address,
      h.value.challenged.nat,
      h.value.challenged.address,
      getDateMaybe(h.value.challenge_time),
      getDateMaybe(h.value.start_time),
      getDateMaybe(h.value.finish_time),
      ohash(h.value),
      h.value,
      getUTCDate(),
      h.value.loot/1000000,
      h.value.resolved,
    ])
  })
  const updates = update_battles.map(h => {
    return client.query(`update battles set
      challenge_time=$2,
      start_time=$3,
      finish_time=$4,
      hash=$5, 
      battle=$6, 
      synced_at=$7,
      resolved=$8
    where
      bid=$1`, [
      h.key,
      getDateMaybe(h.value.challenge_time),
      getDateMaybe(h.value.start_time),
      getDateMaybe(h.value.finish_time),
      ohash(h.value),
      h.value,
      getUTCDate(),
      h.value.resolved
    ])
  })
  await Promise.all(inserts.concat(updates))
  console.log('New Battles', new_battles.length)
  console.log('Update Battles', update_battles.length)
}

async function checkContractLoop() {
  console.log('-------')
  const client = getClient()
  const asyncs = COLLECTION_INDEXER == '' ?
    [
      syncContractStorage(client),
      syncHeroes(client),
      syncBattles(client),
      syncCancelledBattles(client)
    ] :  
    COLLECTION_INDEXER.split(',').map(c => syncCollection(c, client))
  try {
    await client.connect()
    await Promise.all(asyncs)
    await client.end()
  } catch(e) {
    console.error(e)
    Sentry.captureException(e)
    await client.end()
  }
  setTimeout(checkContractLoop, SCRAPE_INTERVAL)
}

checkContractLoop()
