import express from 'express';
import { db, auth } from '../config/firebase.js';

const router = express.Router();

// Auth middleware for history
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

router.use(verifyFirebaseToken);

// GET /api/history - Get user's extraction history from Firestore
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        let query = db.collection('extractions')
            .where('userId', '==', req.uid)
            .orderBy('createdAt', 'desc');

        // Simple search logic - fetch all for user and filter in memory if searching 
        // (Firestore doesn't support easy case-insensitive contains search)
        // For production, we'd use a better search index like Algolia

        let snapshot = await query.get();
        let extractions = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (!search || (data.url && data.url.toLowerCase().includes(search.toLowerCase()))) {
                extractions.push({ id: doc.id, ...data });
            }
        });

        const total = extractions.length;
        const start = (page - 1) * limit;
        const paginatedExtractions = extractions.slice(start, start + limit);

        res.json({
            success: true,
            data: paginatedExtractions,
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

// GET /api/history/:id
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('extractions').doc(req.params.id).get();

        if (!doc.exists || doc.data().userId !== req.uid) {
            return res.status(404).json({ success: false, error: 'Not found' });
        }

        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/history/:id
router.delete('/:id', async (req, res) => {
    try {
        const docRef = db.collection('extractions').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists || doc.data().userId !== req.uid) {
            return res.status(404).json({ success: false, error: 'Not authorized' });
        }

        await docRef.delete();
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PATCH /api/history/:id/favorite
router.patch('/:id/favorite', async (req, res) => {
    try {
        const docRef = db.collection('extractions').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists || doc.data().userId !== req.uid) {
            return res.status(404).json({ success: false, error: 'Not authorized' });
        }

        const newFavStatus = !doc.data().isFavorite;
        await docRef.update({ isFavorite: newFavStatus });

        res.json({ success: true, isFavorite: newFavStatus });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
