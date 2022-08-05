import { TzKTAPI, TzKTEvents } from '@asbjornenge/tzkt-api'
import ohash from 'object-hash'
import {
  TZKT_API,
  CHAINBORN_DATASTORE
} from './config.js'
import { getClient } from './utils.js'
import './sentry.js'

const api = new TzKTAPI({ BASE: TZKT_API })

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
    return client.query(`update heroes set ...`, []) // query and variables removed
  })
  await Promise.all(updates)
  console.log('Heroes updates', heroes_with_updates.length)
}