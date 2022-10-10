import { atom, selector, useRecoilState } from 'recoil'
import { 
  getFBToken,
  getTezIDProfile
} from './api'
import { authWithFirebase } from './firebase'
import { getActiveAccount } from './wallet'

export const walletState = atom({
  key: 'walletState',
  default: selector({
    key: 'walletState/default',
    get: async ({ get }) => {
      return await getActiveAccount() 
    }
  }),
})

const signatureAtom = atom({
  key: 'signatureAtom',
  default: selector({
    key: 'signatureAtom/default',
    get: async ({ get }) => {
      let sig = localStorage.getItem('chainborn_signature')
      return JSON.parse(sig || '{}')
    }
  })
})

const firebaseTokenStateAtom = atom({
  key: 'firebaseTokenStateAtom',
  default: selector({
    key: 'firebaseTokenStateAtom/default',
    get: async ({ get }) => {
      const token = localStorage.getItem('chainborn_firebase_token')
      try {
        await authWithFirebase(token)
      } catch(e) {
        try {
          const sig = get(signatureAtom)
          const wallet = get(walletState)
          const newToken = await getFBToken({ pk: wallet?.publicKey, ...sig })
          await authWithFirebase(newToken)
          localStorage.setItem('chainborn_firebase_token', newToken)
          return newToken
        } catch(e) {
          console.error(e)
        }
      }
      return token
    }
  })
})

export const tezidProfileAtom = atom({
  key: 'tezidProfileAtom',
  default: selector({
    key: 'tezidProfileAtom/default',
    get: async ({ get }) => {
      try {
        const wallet = get(walletState)
        const profile = await getTezIDProfile(wallet?.address)
        return profile
      } catch(e) {
        console.error(e)
      }
      return null 
    }
  })
})

export const signatureState = selector({
  key: 'signatureState',
  get: async ({get}) => {
    return get(signatureAtom)
  },
  set: ({set}, newVal) => {
    localStorage.setItem('chainborn_signature', JSON.stringify(newVal))
    set(signatureAtom, newVal)
  }
})

export const firebaseTokenState = selector({
  key: 'firebaseTokenState',
  get: async ({get}) => {
    return get(firebaseTokenStateAtom)
  },
  set: ({set}, newVal) => {
    localStorage.setItem('chainborn_firebase_token', newVal)
    set(firebaseTokenStateAtom, newVal)
  }
})

/*
* Status messages 
* Shape: { 
    title: String, 
    description: String,
    severity: String ('error' | 'warning' | 'ok')
  }
*/
const alertAtom = atom({
  key: 'alertState',
  default: null
})

export function useAlert() {
  const [ alert, setAlert ] = useRecoilState(alertAtom)
  return [ alert, (props) => {
    if (props === null) {
      setAlert(null)
    }
    else {
      const { title, description, severity='error' } = props
      setAlert({ title, description, severity })
    }
  }]
}
