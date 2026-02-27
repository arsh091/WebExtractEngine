import express from 'express';
import { runSecurityScan } from '../controllers/securityController.js';
import { analyzeIP } from '../services/ipIntelligence.js';
import { deepWebsiteAnalysis } from '../services/advancedScanner.js';
import { db, admin } from '../config/firebase.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Specific rate limit for security scans as they are intensive
const scannerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 scans per window
    message: {
        success: false,
        error: 'Too many security scans from this IP, please try again after 15 minutes'
    }
});

/**
 * @route POST /api/security/scan
 * @desc  Run a full security audit on a target URL
 */
router.post('/scan', scannerLimiter, runSecurityScan);

/**
 * @route GET /api/security/scan
 * @desc  Convenience GET endpoint for scanning
 */
router.get('/scan', scannerLimiter, runSecurityScan);

/**
 * @route GET /api/security/ip
 * @desc  Get IP intelligence and risk analysis for the requester
 */
router.get('/ip', (req, res) => {
    try {
        const ipData = analyzeIP(req);
        res.json({
            success: true,
            data: ipData,
        });
    } catch (error) {
        console.error('IP analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'IP analysis failed',
        });
    }
});

/**
 * @route POST /api/security/save-scan
 * @desc  Save scan intelligence to Firebase vault
 */
router.post('/save-scan', async (req, res) => {
    try {
        const { userId, scanData } = req.body;

        if (!userId || !scanData) {
            return res.status(400).json({
                success: false,
                error: 'userId and scanData required',
            });
        }

        // Save to Firestore
        const docRef = await db.collection('security-scans').add({
            userId,
            ...scanData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.json({
            success: true,
            scanId: docRef.id,
        });
    } catch (error) {
        console.error('Save scan error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save scan',
        });
    }
});

/**
 * @route POST /api/security/advanced-scan
 * @desc  Run a deep website analysis (IP, DNS, Ports, Tech)
 */
router.post('/advanced-scan', scannerLimiter, async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || !url.startsWith('http')) {
            return res.status(400).json({
                success: false,
                error: 'Valid URL required',
            });
        }

        const analysisResult = await deepWebsiteAnalysis(url);

        res.json({ success: true, data: analysisResult });
    } catch (error) {
        console.error('Advanced scan error:', error);
        res.status(500).json({ success: false, error: 'Advanced scan failed' });
    }
});

export default router;
