import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyB987Gt7ztTJ4-NloTRIvDRvljYsfNFnEM",
  authDomain: "chainborn-dapp.firebaseapp.com",
  projectId: "chainborn-dapp",
  storageBucket: "chainborn-dapp.appspot.com",
  messagingSenderId: "587832478718",
  appId: "1:587832478718:web:3919892474cb8e1e3c8eaf"
};

// Initialize Firebase

const firebase = initializeApp(firebaseConfig)
export const firestore = getFirestore(firebase)

export async function authWithFirebase(token) {
  if (!token || token === 'null') return
  const auth = getAuth(firebase)
  await signInWithCustomToken(auth, token) 
}
