import express from 'express';
import { extractData, testExtraction, extractSiteInfo } from '../controllers/extractController.js';

const router = express.Router();

// Main extraction endpoint
router.post('/', extractData);

// Site info endpoint
router.post('/site-info', extractSiteInfo);

// Test endpoint
router.get('/test', testExtraction);

export default router;
