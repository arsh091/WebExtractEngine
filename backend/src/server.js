import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

// Import routes
import extractRouter from './routes/extract.js';
import bulkRouter from './routes/bulk.js';
import authRouter from './routes/auth.js';
import historyRouter from './routes/history.js';

dotenv.config();
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
    max: 10, // 10 requests per minute
    message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

// Routes
app.use('/api/extract', extractRouter);
app.use('/api/bulk', bulkRouter);
app.use('/api/auth', authRouter);
app.use('/api/history', historyRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
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
} else {
    console.log('[Server] Running in test mode, skipping listen.');
}

export default app;
