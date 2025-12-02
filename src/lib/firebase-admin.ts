import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'vuelavuela-5af97';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@vuelavuela-5af97.iam.gserviceaccount.com';
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!privateKey || privateKey.length < 100) {
    console.warn('Firebase Admin credentials not found. Initialization skipped during build.');
    return null;
  }

  const firebaseAdminConfig = {
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  };

  return initializeApp(firebaseAdminConfig);
}

function getAdminApp(): App {
  if (!cachedApp) {
    const app = initializeFirebaseAdmin();
    if (!app) {
      throw new Error('Firebase Admin is not initialized. Check your environment variables.');
    }
    cachedApp = app;
  }
  return cachedApp;
}

function getAdminDb(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(getAdminApp());
  }
  return cachedDb;
}

// Create a Proxy to delay initialization until actually used
export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop) {
    const db = getAdminDb();
    return (db as any)[prop];
  }
});

export const adminApp = new Proxy({} as App, {
  get(_target, prop) {
    const app = getAdminApp();
    return (app as any)[prop];
  }
});
