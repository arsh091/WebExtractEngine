import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

let firebaseApp;

const initializeFirebase = () => {
    if (admin.apps.length > 0) return admin.app();

    try {
        const serviceAccountPath = join(process.cwd(), 'firebase-admin-sdk.json');
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log('✅ Firebase Admin SDK initialized from JSON');
        return firebaseApp;
    } catch (error) {
        console.error('❌ JSON Init failed:', error.message);

        if (process.env.FIREBASE_PROJECT_ID) {
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                })
            });
            console.log('✅ Firebase Admin initialized from ENV');
            return firebaseApp;
        }

        // Critical fail if no way to initialize
        throw new Error('Firebase could not be initialized. Check keys.');
    }
};

const app = initializeFirebase();

export const auth = admin.auth(app);
export const db = admin.firestore(app);
export { admin };
export default app;
