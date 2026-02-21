import User from '../models/User.js';

export const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API key required. Add header: x-api-key: your_key or query param: api_key=your_key'
        });
    }

    try {
        const user = await User.findOne({ apiKey });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid API key'
            });
        }

        // Rate limiting: Free=100/day, Pro=1000/day
        const limit = user.plan === 'pro' ? 1000 : 100;
        // Monthly estimation for simple logic (can be refined to daily)
        if (user.apiUsage.monthlyCount >= limit * 30) {
            return res.status(429).json({
                success: false,
                error: `Monthly limit reached (${limit * 30} requests). Upgrade to Pro.`
            });
        }

        // Update usage
        await User.findByIdAndUpdate(user._id, {
            $inc: { 'apiUsage.count': 1, 'apiUsage.monthlyCount': 1 },
            'apiUsage.lastUsed': new Date()
        });

        req.apiUser = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, error: 'Auth error' });
    }
};
