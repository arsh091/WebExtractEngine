import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import './config/firebase.js'; // Initialize Firebase Admin

// Import routes
import extractRouter from './routes/extract.js';
import bulkRouter from './routes/bulk.js';
import authRouter from './routes/auth.js';
import historyRouter from './routes/history.js';
import apiKeysRouter from './routes/apikeys.js';
import publicApiRouter from './routes/publicApi.js';

dotenv.config();
const app = express();

// Middleware
app.use(helmet());

const allowedOrigins = [
    'https://web-extract-engine.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

// Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // Increased for bulk 
    message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

// Routes
app.use('/api/extract', extractRouter);
app.use('/api/bulk', bulkRouter);
app.use('/api/auth', authRouter);
app.use('/api/history', historyRouter);
app.use('/api/apikeys', apiKeysRouter);
app.use('/api/v1', publicApiRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running with Firebase Node' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.PORT ? '0.0.0.0' : 'localhost';

console.log(`[Server] Environment: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, HOST, () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
    });
}

export default app;
