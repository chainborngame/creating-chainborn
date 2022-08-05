import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'

const Tezos = new TezosToolkit()
const wallet = new BeaconWallet({ name: "ChainBorn" })
Tezos.setWalletProvider(wallet)

export async function setProvider(rpc) {
  Tezos.setProvider({ rpc: rpc})
}

export async function getActiveAccount() {
  const activeAccount = await wallet.client.getActiveAccount()
  if (!activeAccount) return null
  return activeAccount
}

export async function connectWallet(network) {
  const account = await wallet.client.requestPermissions({
    network: {
      type: network.type,
      rpcUrl: network.rpc
    }
  })
  return account
}

export async function disconnectWallet() {
  await wallet.clearActiveAccount()
}