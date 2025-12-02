import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'vuelavuela-5af97';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@vuelavuela-5af97.iam.gserviceaccount.com';
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!privateKey || privateKey.length < 100) {
    console.warn('Firebase Admin credentials not found. Some features will not work.');
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
  if (!adminApp) {
    const app = initializeFirebaseAdmin();
    if (!app) {
      throw new Error('Firebase Admin is not initialized. Check your environment variables.');
    }
    adminApp = app;
  }
  return adminApp;
}

function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

export { getAdminApp as adminApp, getAdminDb as adminDb };
