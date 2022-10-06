// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { bffUrl } from './bffClient'

export abstract class Auth {
  abstract createUserWithEmailAndPassword(email: string, password: string): Promise<LoginResult>

  abstract signInWithEmailAndPassword(email: string, password: string): Promise<LoginResult>

  abstract loginToServer(loginResult: LoginResult): Promise<void>;

  static getAuth(): Auth {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
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
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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
    await fetch(bffUrl('/auth/login'), {
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
    await fetch(bffUrl('/auth/login'), {
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
