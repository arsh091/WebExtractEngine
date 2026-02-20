import express from 'express';
import { bulkExtract } from '../controllers/bulkController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const bulkLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Only 3 bulk requests per 5 minutes
    message: {
        success: false,
        error: 'Too many bulk requests. Please wait 5 minutes.'
    }
});

router.post('/', bulkLimiter, bulkExtract);

export default router;
