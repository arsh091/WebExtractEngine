import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Auth middleware
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, error: 'Please login' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-random-secret-key-min-32-chars-long');
        req.userId = decoded.id;
        next();
    } catch {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// Generate API Key
router.post('/generate', auth, async (req, res) => {
    try {
        // Generate unique API key: wxe_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        const apiKey = 'wxe_live_' + crypto.randomBytes(24).toString('hex');

        await User.findByIdAndUpdate(req.userId, {
            apiKey,
            apiKeyCreatedAt: new Date()
        });

        res.json({
            success: true,
            apiKey,
            message: 'Keep this key secret! It grants access to your account.'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get API Key info
router.get('/info', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('apiKey apiKeyCreatedAt apiUsage');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Revoke API Key
router.delete('/revoke', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.userId, {
            $unset: { apiKey: 1 },
            apiKeyCreatedAt: null
        });
        res.json({ success: true, message: 'API key revoked successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
