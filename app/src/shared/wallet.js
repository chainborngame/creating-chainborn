import { bytes2Char, char2Bytes } from '@taquito/utils'
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk'

const Tezos = new TezosToolkit()
const wallet = new BeaconWallet({ name: "ChainBorn" })
Tezos.setWalletProvider(wallet)

export { Tezos }

export async function setProvider(rpc) {
  Tezos.setProvider({ rpc: rpc}) 
}

export async function mint(minterAddress, numnft, amount) {
  let contract = await Tezos.wallet.at(minterAddress)
  let op = await contract.methods.mint(numnft).send({ amount: amount })
  await op.confirmation(1)
  return op.opHash
}

export async function getActiveAccount() {
  const activeAccount = await wallet.client.getActiveAccount()
  if (!activeAccount) return null
  activeAccount.balance = await getBalance(activeAccount.address)
  return activeAccount
}

export async function connectWallet(network) {
  try {
    const account = await wallet.client.requestPermissions({
      network: {
        type: network.type,
        rpcUrl: network.rpc
      }
    })
    account.balance = await getBalance(account.address)
    return account 
  } catch(e) {
    throw new Error(e.message)
  }
}

export async function disconnectWallet() {
  await wallet.clearActiveAccount() 
}

export async function getBalance(addr) {
  try {
    let balance = await Tezos.tz.getBalance(addr)
    return Math.round(((balance.toJSON()/1000000) + Number.EPSILON) * 100) / 100
  } catch (e) {
    return 0
  }
}

export async function signChainbornBehaviourMessage({ account }) {
  const formattedInput: string = [
    'Tezos Signed Message:',
    window.location.origin,
    new Date(),
    'I have read and accept the ChainBorn Terms, and promise to follow the Code of Conduct.',
  ].join(' ')
  const bytes = char2Bytes(formattedInput)
  const payloadBytes = `050100${char2Bytes(bytes.length.toString())}${bytes}`
  const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: payloadBytes,
    sourceAddress: account.address,
  }
  const signedPayload = await wallet.client.requestSignPayload(payload)
  return { 
    sig: signedPayload.signature,
    message: payloadBytes
  }
}

export async function signExecuteBattleTurnMessage({ bid, account }) {
  const formattedInput: string = [
    'Tezos Signed Message:',
    window.location.origin,
    new Date(),
    `I want to execute my turn for battle ${bid}.`,
  ].join(' ')
  const bytes = char2Bytes(formattedInput)
  const payloadBytes = `050100${char2Bytes(bytes.length.toString())}${bytes}`
  const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: payloadBytes,
    sourceAddress: account.address,
  }
  const signedPayload = await wallet.client.requestSignPayload(payload)
  return { 
    sig: signedPayload.signature,
    message: payloadBytes,
    pk: account.publicKey
  }
}

export const fetchTezosDomainFromAddress = async (address) => {
  const Tezos = new TezosToolkit("https://mainnet.api.tez.ie")
  const contract = await Tezos.wallet.at('KT1GBZmSxmnKJXGMdMLbugPfLyUPmuLSMwKS')
  const storage = await contract.storage()
  const domain = await storage.store.reverse_records.get(address)
  return domain ? bytes2Char(domain.name) : address
}

export const fetchAddressFromTezosDomain = async (domainName) => {
  const Tezos = new TezosToolkit('https://mainnet.smartpy.io')
  const contract = await Tezos.wallet.at('KT1GBZmSxmnKJXGMdMLbugPfLyUPmuLSMwKS')
  const storage = await contract.storage()
  const domain = await storage.store.records.get(char2Bytes(domainName))
  return domain ? domain.owner : domainName
}
