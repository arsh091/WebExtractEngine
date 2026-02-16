import express from 'express';
import { extractData, testExtraction } from '../controllers/extractController.js';

const router = express.Router();

// Main extraction endpoint
router.post('/', extractData);

// Test endpoint
router.get('/test', testExtraction);

export default router;
