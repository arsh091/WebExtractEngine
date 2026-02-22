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

        const historyRef = db.collection('extractions');
        const snapshot = await historyRef
            .where('userId', '==', req.uid)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            // Note: StartAfter could be added for better pagination
            .get();

        const extractions = [];
        snapshot.forEach(doc => {
            extractions.push({ id: doc.id, ...doc.data() });
        });

        // Simplified total count for Firebase (can use separate counter in prod)
        const totalSnapshot = await historyRef.where('userId', '==', req.uid).count().get();
        const total = totalSnapshot.data().count;

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
