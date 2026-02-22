import express from 'express';
import { auth, db } from '../config/firebase.js';

const router = express.Router();

// GET /api/auth/me (Get current user data from Firestore)
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ success: false, error: 'No token' });

        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            // If user exists in Auth but not in Firestore, initialize them
            const userData = {
                name: decodedToken.name || 'Anonymous',
                email: decodedToken.email,
                plan: 'free',
                extractionCount: 0,
                createdAt: new Date().toISOString()
            };
            await db.collection('users').doc(uid).set(userData);
            return res.json({ success: true, user: { id: uid, ...userData } });
        }

        res.json({ success: true, user: { id: uid, ...userDoc.data() } });
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
});

// POST /api/auth/register-sync (Initialize user in Firestore after Firebase Signup)
router.post('/register-sync', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const { name } = req.body;

        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const userData = {
            name: name || decodedToken.name || 'Anonymous',
            email: decodedToken.email,
            plan: 'free',
            extractionCount: 0,
            createdAt: new Date().toISOString()
        };

        await db.collection('users').doc(uid).set(userData, { merge: true });

        res.status(201).json({ success: true, user: { id: uid, ...userData } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
