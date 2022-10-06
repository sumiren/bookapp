// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { bffUrl } from '~/lib/bffClient'

export abstract class Auth {
  abstract createUserWithEmailAndPassword(email: string, password: string): Promise<LoginResult>

  abstract signInWithEmailAndPassword(email: string, password: string): Promise<LoginResult>

  abstract loginToServer(loginResult: LoginResult): Promise<void>;

  static getAuth(): Auth {
    if (typeof window === 'undefined') {
      console.log(JSON.stringify(process.env))
    }
    console.log('runtime config...' + JSON.stringify(useRuntimeConfig()))
    console.log('environment...' + useRuntimeConfig().public.ENVIRONMENT)
    if (useRuntimeConfig().public.ENVIRONMENT === 'local') {
      return new DummyAuth()
    }
    return new FirebaseAuth()
  }
}

class FirebaseAuth extends Auth {
  private app: FirebaseApp

  constructor() {
    super()
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const config = useRuntimeConfig()
    const firebaseConfig = {
      apiKey: config.public.FIREBASE_API_KEY,
      authDomain: config.public.FIREBASE_AUTH_DOMAIN,
      projectId: config.public.FIREBASE_PROJECT_ID,
      storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.public.FIREBASE_PROJECT_ID,
      appId: config.public.FIREBASE_APP_ID,
      measurementId: config.public.FIREBASE_MEASUREMENT_ID
    }

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig)
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<LoginResult> {
    const userCredential = await signInWithEmailAndPassword(getAuth(this.app), email, password)
    const idToken = await userCredential.user.getIdToken()
    console.log(`signed in...uid = ${userCredential.user.uid} ...idToken = ${idToken}`)
    return { idToken: () => idToken, uid: () => userCredential.user.uid }
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<LoginResult> {
    const userCredential = await createUserWithEmailAndPassword(getAuth(this.app), email, password)
    const idToken = await userCredential.user.getIdToken()
    console.log(`created user...uid = ${userCredential.user.uid} ...idToken = ${idToken}`)
    return { idToken: () => idToken, uid: () => userCredential.user.uid }
  }

  async loginToServer(loginResult: LoginResult): Promise<void> {
    await $fetch(bffUrl('/auth/login'), {
      method: 'post',
      headers: {
        Authorization: `Bearer ${loginResult.idToken()}`
      },
      credentials: 'include'
    })
  }
}

class DummyAuth extends Auth {
  createUserWithEmailAndPassword(email: string, password: string): Promise<LoginResult> {
    return this.signInWithEmailAndPassword(email, password)
  }

  async loginToServer(loginResult: LoginResult): Promise<void> {
    console.log('dummy auth')
    await $fetch(bffUrl('/auth/login'), {
      method: 'post',
      headers: {
        Authorization: `Dev ${loginResult.uid()}`
      },
      credentials: 'include'
    })
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<LoginResult> {
    return Promise.resolve({
      idToken: () => {
        throw Error('Not Implemented')
      }, uid: () => email
    })
  }
}

export type LoginResult = {
  idToken(): string,
  uid(): string
}
