import express from 'express';
import jwt from 'jsonwebtoken';
import Extraction from '../models/Extraction.js';
import User from '../models/User.js';

const router = express.Router();

// Auth middleware
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, error: 'Please login' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
        req.userId = decoded.id;
        next();
    } catch {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// GET /api/history - Get user's extraction history
router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const extractions = await Extraction
            .find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-data.phones -data.emails -data.addresses'); // Compact view

        const total = await Extraction.countDocuments({ userId: req.userId });

        res.json({
            success: true,
            data: extractions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/history/:id - Get single extraction details
router.get('/:id', auth, async (req, res) => {
    try {
        const extraction = await Extraction.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!extraction) {
            return res.status(404).json({ success: false, error: 'Not found' });
        }

        res.json({ success: true, data: extraction });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/history/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        await Extraction.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PATCH /api/history/:id/favorite - Toggle favorite
router.patch('/:id/favorite', auth, async (req, res) => {
    try {
        const extraction = await Extraction.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!extraction) return res.status(404).json({ success: false, error: 'Not found' });

        extraction.isFavorite = !extraction.isFavorite;
        await extraction.save();

        res.json({ success: true, isFavorite: extraction.isFavorite });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/history - Clear all history
router.delete('/', auth, async (req, res) => {
    try {
        await Extraction.deleteMany({ userId: req.userId });
        res.json({ success: true, message: 'History cleared' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
