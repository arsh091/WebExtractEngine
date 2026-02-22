import { db, admin } from '../config/firebase.js';

export const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API key required. Add header: x-api-key: your_key or query param: api_key=your_key'
        });
    }

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('apiKey', '==', apiKey).limit(1).get();

        if (snapshot.empty) {
            return res.status(401).json({
                success: false,
                error: 'Invalid API key'
            });
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();
        const uid = userDoc.id;

        // Rate limiting: Free=100/day, Pro=1000/day
        const limit = user.plan === 'pro' ? 1000 : 100;
        const apiUsage = user.apiUsage || { count: 0, monthlyCount: 0 };

        if (apiUsage.monthlyCount >= limit * 30) {
            return res.status(429).json({
                success: false,
                error: `Monthly limit reached (${limit * 30} requests). Upgrade to Pro.`
            });
        }

        // Update usage in background
        await db.collection('users').doc(uid).update({
            'apiUsage.count': admin.firestore.FieldValue.increment(1),
            'apiUsage.monthlyCount': admin.firestore.FieldValue.increment(1),
            'apiUsage.lastUsed': new Date().toISOString()
        });

        req.apiUser = { id: uid, ...user };
        next();
    } catch (error) {
        console.error('API Auth Error:', error);
        res.status(500).json({ success: false, error: 'Auth error' });
    }
};
