import { useLocation } from 'wouter'
import { Suspense } from 'react'
import { useRecoilState } from 'recoil'
import { 
  walletState,
  signatureState,
  tezidProfileAtom, 
  firebaseTokenState,
} from 'shared/state'
import { useGetConfig } from 'shared/apollo'
import { Spinner } from 'grommet'
import { 
  TezosWallet,
} from 'tezos-wallet-component'
import {
  getTezIDProfile 
} from 'shared/api'
import {
  connectWallet,
  disconnectWallet,
  signChainbornBehaviourMessage
} from 'shared/wallet'
import { getFBToken } from 'shared/api'
import { authWithFirebase } from 'shared/firebase'
import 'tezos-wallet-component/dist/TezosWallet.css'
import './index.css'

export default function Wallet() {
  const { config } = useGetConfig()
  const [ , setLocation ] = useLocation()
  const [ , setSignature ] = useRecoilState(signatureState)
  const [ wallet, setWallet ] = useRecoilState(walletState)
  const [ ,setFirebaseToken ] = useRecoilState(firebaseTokenState)
  const [ profile, setProfile ] = useRecoilState(tezidProfileAtom)

  const onConnectWallet = async () => {
    try {
      const wallet = await connectWallet({ type: config.NETWORK_NAME, rpc: config.RPC_ENDPOINT })
      const sig = await signChainbornBehaviourMessage({ type: config.NETWORK_NAME, rpc: config.RPC_ENDPOINT, account: wallet })
      const token = await getFBToken({ pk: wallet?.publicKey, ...sig })
      const profile = await getTezIDProfile(wallet?.address)
      await authWithFirebase(token) 
      setWallet(wallet)
      setProfile(profile)
      setSignature(sig)
      setFirebaseToken(token)
    } catch(e) {
      console.error(e)
      await disconnectWallet()
    }
  }

  return (
    <Suspense fallback={<Spinner />}>
      <div className='TezosWalletContainer'>
        <TezosWallet
          address={wallet?.address}
          balance={wallet?.balance}
          showMenu={false}
          onToggleMenu={() => setLocation(`/player/${wallet?.address}`)}
          onConnectWallet={onConnectWallet}
          ipfsBase='https://tezid.infura-ipfs.io/ipfs'
          tezIDProfile={profile}
        >
        </TezosWallet>
      </div>
    </Suspense>
  )
}
