// react
import { createContext, useContext, useState, useEffect } from 'react'

// types
import { FC } from '../../types'

// firebase
import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'

// comm
import API from '../comm/api'

// utils
import { Firebase } from '../../types'

/*
Firebase config keys and Ids
link: https://console.firebase.google.com/u/1/project/mauro-a9ce3/settings/general/web:M2NhMTMzOGEtZGQwNy00MGQ0LThjZmMtNjIwYzdiNmZiYTY0

Activate firebase auth: 
Console -> Authentication -> Sign-In method
link: https://console.firebase.google.com/u/1/project/mauro-a9ce3/authentication/providers
*/

const firebaseConfig = {
  apiKey: "AIzaSyAEBrQ0nFuzwyaC-CU73vxN3_lCudqqNkY",
  authDomain: "ploupy-6550c.firebaseapp.com",
  projectId: "ploupy-6550c",
  storageBucket: "ploupy-6550c.appspot.com",
  messagingSenderId: "951688323362",
  appId: "1:951688323362:web:866d85d38c6b49536bc57b"
}

/*
Initialize the firebase app, has to be done only once.
Check if any app already exists to prevent repetition
*/
if (!getApps().length) {
  // Initialize Firebase
  initializeApp(firebaseConfig)
}

/*
Firebase authentification reference
Importing it avoids importing firebase (app & auth) everywhere
*/
export const auth = getAuth()

export const SessionPersistence = browserLocalPersistence
export const LocalPersistence = browserSessionPersistence

/*
For auth implementation & all of the following:
see https://blog.logrocket.com/implementing-authentication-in-next-js-with-firebase/

Custom hook
Store the user & if something is loading (firebase is fetching data) as react states.
Setup an observer to change the user/loading states once the auth state change.
Return the user & the loading state
*/
function useFirebaseAuth() {
  const [user, setUser] = useState<Firebase.User>({
    connected: false,
    uid: "",
    username: "",
    email: "",
  })
  const [loading, setLoading] = useState(true)

  // listen for Firebase state change
  // use an useEffect hook to prevent setting up the observer at each rerender
  useEffect(() => {
    onAuthStateChanged(auth, async (_user) => {
      if (_user) { // signed in

        // start loading state
        setLoading(true)

        // get user data from server
        const data = await API.getUserData({ uid: _user.uid })

        if (!data) {
          throw new Error(`No user found for uid: ${_user.uid}`)
        }

        setUser({
          connected: true,
          uid: data.uid,
          email: data.email,
          username: data.username,
        })

        // stop loading state
        setLoading(false)

      } else { // not signed in
        setUser({ ...user, connected: false })
        setLoading(false)
      }
    })
  }, [] /* the effect is only executed once */)

  return { user: user, loading: loading } as Firebase.Auth
}

/*
Context, provider at root of application (_app.js)
Same data as UseFirebaseAuth (work together)
*/
const userContext = createContext<Firebase.Auth>({
  user: {
    connected: false,
    uid: "",
    username: "",
    email: "",
  },
  loading: true
})

export interface AuthProviderProps {

}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const values = useFirebaseAuth()
  return <userContext.Provider value={values}>{props.children}</userContext.Provider>
}


export const useAuth = () => useContext(userContext)


/**
 * Extract and format the error message from the error object
 * Use with response from firebase auth
 */
export function getErrorMessage(error: any) {
  let msg = error.message
  // extract message
  msg = msg.split("/")[1].split(")")[0].replaceAll("-", " ")
  // capitalize
  msg = msg.charAt(0).toUpperCase() + msg.slice(1)
  return msg
}