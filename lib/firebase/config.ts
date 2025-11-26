import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'fairmark-ed88f',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp
let db: Firestore

export function initializeFirebase() {
  if (getApps().length === 0) {
    // Validate required config
    if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
      const error = 'Firebase configuration is incomplete. Missing: ' +
        (!firebaseConfig.apiKey ? 'API Key ' : '') +
        (!firebaseConfig.appId ? 'App ID' : '')
      console.error(error)
      console.error('Environment variables:', {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'present' : 'MISSING',
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'present' : 'MISSING',
      })
      throw new Error(error)
    }

    console.log('Initializing Firebase with config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      hasApiKey: !!firebaseConfig.apiKey,
      hasAppId: !!firebaseConfig.appId,
    })
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    console.log('Firebase initialized successfully')
  } else {
    app = getApps()[0]
    db = getFirestore(app)
    console.log('Using existing Firebase instance')
  }
  return { app, db }
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    console.log('Database not initialized, initializing now...')
    initializeFirebase()
  }
  return db
}

// Test Firebase connection
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const { db } = initializeFirebase()
    console.log('Firebase connection test: Firestore instance created')
    return true
  } catch (error) {
    console.error('Firebase connection test failed:', error)
    return false
  }
}
