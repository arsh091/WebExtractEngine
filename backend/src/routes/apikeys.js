import express from 'express';
import crypto from 'crypto';
import { db, auth, admin } from '../config/firebase.js';

const router = express.Router();

// Auth middleware for Firebase
const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ success: false, error: 'Please login' });

        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        req.uid = decodedToken.uid;
        next();
    } catch {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// Generate API Key
router.post('/generate', verifyFirebaseToken, async (req, res) => {
    try {
        const apiKey = 'wxe_live_' + crypto.randomBytes(24).toString('hex');

        await db.collection('users').doc(req.uid).update({
            apiKey,
            apiKeyCreatedAt: new Date().toISOString()
        });

        res.json({
            success: true,
            apiKey,
            message: 'Keep this key secret!'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get API Key info
router.get('/info', verifyFirebaseToken, async (req, res) => {
    try {
        const doc = await db.collection('users').doc(req.uid).get();
        if (!doc.exists) return res.status(404).json({ success: false, error: 'User not found' });

        const data = doc.data();
        res.json({
            success: true,
            data: {
                apiKey: data.apiKey,
                apiKeyCreatedAt: data.apiKeyCreatedAt,
                apiUsage: data.apiUsage || { count: 0, monthlyCount: 0 }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Revoke API Key
router.delete('/revoke', verifyFirebaseToken, async (req, res) => {
    try {
        await db.collection('users').doc(req.uid).update({
            apiKey: admin.firestore.FieldValue.delete(),
            apiKeyCreatedAt: admin.firestore.FieldValue.delete()
        });
        res.json({ success: true, message: 'API key revoked' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
