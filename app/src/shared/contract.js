import { OpKind } from '@taquito/taquito'
import { nanoid } from 'nanoid'
import { notify } from 'shared/utils' 
import { Tezos } from './wallet'

export async function summonNFT({ dappAddress, walletAddress, tokenAddress, tokenId, name, cost }) {
  const tokenContract = await Tezos.wallet.at(tokenAddress)
  const dappContract = await Tezos.wallet.at(dappAddress)

  // const methods = dappContract.parameterSchema.ExtractSignatures()
  // console.log(methods)

  const batchOp = await Tezos.wallet.batch([
    {
      kind: OpKind.TRANSACTION,
      ...tokenContract.methods.update_operators([
        {
          add_operator: {
            owner: walletAddress,
            operator: dappAddress,
            token_id: tokenId
          }
        }
      ]).toTransferParams()
    },
    {
      kind: OpKind.TRANSACTION,
      ...dappContract.methods.summon_hero(
        name, 
        tokenAddress, 
        tokenId
      ).toTransferParams(),
      amount: cost
    },
    {
      kind: OpKind.TRANSACTION,
      ...tokenContract.methods.update_operators([
        {
          remove_operator: {
            owner: walletAddress,
            operator: dappAddress,
            token_id: tokenId
          }
        }
      ]).toTransferParams()
    },
  ])
  const batch = await batchOp.send()
  await batch.confirmation()
}

export async function challengeHero({ network, dappAddress, challenger, challenged, loot, mode }) {
  const bid = nanoid(12)
  const lootMutez = loot ? loot * 1000000 : 0
  const sendParams = loot ? { amount: loot } : null
  const contract = await Tezos.wallet.at(dappAddress)
  const op = await contract.methods.challenge_hero(
    bid, 
    challenged.token_address, 
    challenged.token_id,
    challenger.token_address, 
    challenger.token_id,
    lootMutez,
    mode
  ).send(sendParams)
  await op.confirmation()
  await notify(network, challenger.owner, challenged.owner, 'challenge', `${challenger.name} challenges ${challenged.name}`, `/battles/${bid}`)
}

export async function acceptChallenge({ dappAddress, bid, loot, challenger, challenged, network }) {
  const contract = await Tezos.wallet.at(dappAddress)
  const op = await contract.methods.accept_challenge(bid)
    .send({ amount: loot })
  await op.confirmation()
  await notify(network, challenged.owner, challenger.owner, 'accept-challenge', `${challenged.name} accepted your challenge!`, `/battles/${bid}`)
}

export async function cancelChallenge({ dappAddress, bid }) {
  const contract = await Tezos.wallet.at(dappAddress)
  const op = await contract.methods.cancel_challenge(bid)
    .send()
  await op.confirmation()
}

export async function unsuitHero({ dappAddress, tokenAddress, tokenId }) {
  const dappContract = await Tezos.wallet.at(dappAddress)
  const batchOp = await Tezos.wallet.batch()
    .withContractCall(dappContract.methods.unsuit(
      tokenAddress, 
      tokenId,
    ))
  const batch = await batchOp.send()
  await batch.confirmation()
}

export async function suitUpHero({ dappAddress, tokenAddress, walletAddress, tokenId }) {
  const dappContract = await Tezos.wallet.at(dappAddress)
  const tokenContract = await Tezos.wallet.at(tokenAddress)
  const batchOp = await Tezos.wallet.batch([
    {
      kind: OpKind.TRANSACTION,
      ...tokenContract.methods.update_operators([
        {
          add_operator: {
            owner: walletAddress,
            operator: dappAddress,
            token_id: tokenId
          }
        }
      ]).toTransferParams()
    },
    {
      kind: OpKind.TRANSACTION,
      ...dappContract.methods.suit_up(
        tokenAddress, 
        tokenId,
      ).toTransferParams()
    },
    {
      kind: OpKind.TRANSACTION,
      ...tokenContract.methods.update_operators([
        {
          remove_operator: {
            owner: walletAddress,
            operator: dappAddress,
            token_id: tokenId
          }
        }
      ]).toTransferParams()
    },
  ])
  const batch = await batchOp.send()
  await batch.confirmation()
}

export async function updateHeroCharacter({ dappAddress, tokenAddress, tokenId, name, story, battleReady }) {
  const dappContract = await Tezos.wallet.at(dappAddress)
  const batchOp = await Tezos.wallet.batch()
    .withContractCall(dappContract.methods.update_hero_character(
      battleReady,
      name, 
      story,
      tokenAddress, 
      tokenId,
    ))
  const batch = await batchOp.send()
  await batch.confirmation()
}

export async function updateHeroAttributes({ dappAddress, tokenAddress, tokenId, values }) {
  const dappContract = await Tezos.wallet.at(dappAddress)
  const batchOp = await Tezos.wallet.batch()
  for (const attribute of Object.keys(values)) {
    if (values[attribute] > 0) {
      batchOp.withContractCall(dappContract.methods.update_hero_attributes(
        attribute,
        values[attribute],
        tokenAddress, 
        tokenId,
      ))
    }
  }
  const batch = await batchOp.send()
  await batch.confirmation()
}

export async function executeBattle({ network, dappAddress, attacker, defender, bid }) {
  const contract = await Tezos.wallet.at(dappAddress)
  const op = await contract.methods.execute_battle_turn(bid)
    .send({ storageLimit: 63 })
  await op.confirmation()
  await notify(network, attacker.owner, defender.owner, 'attack', `${attacker.name} hit ${defender.name}!`, `/battles/${bid}`)
}

export async function resolveBattle({ dappAddress, bid }) {
  const contract = await Tezos.wallet.at(dappAddress)
  const op = await contract.methods.resolve_battle(bid)
    .send()
  await op.confirmation()
}

