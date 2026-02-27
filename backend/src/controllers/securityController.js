import { scanWebsite } from '../services/securityScanner.js';
import { db } from '../config/firebase.js';

/**
 * Security Controller
 * Handles incoming security scan requests
 */
export const runSecurityScan = async (req, res) => {
    const { url } = req.body || req.query;

    if (!url) {
        return res.status(400).json({
            success: false,
            error: 'Target URL is required for security scanning'
        });
    }

    try {
        console.log(`[SecurityController] Starting scan for: ${url}`);
        const scanResults = await scanWebsite(url);

        // Optional: Save scan to history if user is authenticated
        if (req.uid) {
            try {
                await db.collection('security_scans').add({
                    userId: req.uid,
                    url: url,
                    score: scanResults.securityScore,
                    grade: scanResults.grade,
                    timestamp: new Date().toISOString()
                });
            } catch (dbErr) {
                console.error('[SecurityController] Failed to save scan to firestore:', dbErr.message);
                // Non-critical error, continue
            }
        }

        return res.json({
            success: true,
            data: scanResults
        });

    } catch (error) {
        console.error(`[SecurityController] Scan failed:`, error.message);
        return res.status(500).json({
            success: false,
            error: 'Failed to complete security analysis',
            message: error.message
        });
    }
};
