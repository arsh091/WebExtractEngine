import express from 'express';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import { scrapeWebsite } from '../services/scraper.js';
import { extractPhones, extractEmails, extractAddresses } from '../services/extractor.js';
import { extractCompanyInfo } from '../services/companyExtractor.js';
import { extractSocialMedia } from '../services/socialExtractor.js';
import { scanWebsite } from '../services/securityScanner.js';
import { validateUrl } from '../utils/validators.js';

const router = express.Router();

// All public API routes require API key
router.use(apiKeyAuth);

/**
 * @api {get} /v1/extract Extract data from URL
 */
router.get('/extract', async (req, res) => {
    try {
        const { url, fields } = req.query;
        const requestedFields = fields ? fields.split(',') : ['phones', 'emails', 'addresses', 'social', 'company'];

        if (!url || !validateUrl(url)) {
            return res.status(400).json({ success: false, error: 'Valid URL is required' });
        }

        console.log(`[Public API] Extracting: ${url}`);
        const scraped = await scrapeWebsite(url);
        const result = { url, timestamp: new Date().toISOString() };

        if (requestedFields.includes('phones')) result.phones = extractPhones(scraped.text);
        if (requestedFields.includes('emails')) result.emails = extractEmails(scraped.text);
        if (requestedFields.includes('addresses')) result.addresses = extractAddresses(scraped.text);
        if (requestedFields.includes('company')) result.company = extractCompanyInfo(scraped.html, url);
        if (requestedFields.includes('social')) result.social = extractSocialMedia(scraped.text + '\n' + scraped.html, scraped.html);

        result.count = {
            phones: result.phones?.length || 0,
            emails: result.emails?.length || 0,
            addresses: result.addresses?.length || 0
        };

        res.json({ success: true, data: result });
    } catch (error) {
        console.error(`[Public API] Error:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @api {post} /v1/bulk Bulk extract from multiple URLs
 */
router.post('/bulk', async (req, res) => {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length > 10) {
        return res.status(400).json({
            success: false,
            error: 'Provide array of max 10 URLs'
        });
    }

    const results = await Promise.allSettled(
        urls.map(async (url) => {
            if (!validateUrl(url)) throw new Error('Invalid URL');
            const scraped = await scrapeWebsite(url);
            return {
                url,
                phones: extractPhones(scraped.text),
                emails: extractEmails(scraped.text),
                addresses: extractAddresses(scraped.text),
                companyInfo: extractCompanyInfo(scraped.html, url),
                socialMedia: extractSocialMedia(scraped.text + '\n' + scraped.html, scraped.html)
            };
        })
    );

    res.json({
        success: true,
        data: results.map((r, i) => ({
            url: urls[i],
            status: r.status,
            data: r.status === 'fulfilled' ? r.value : null,
            error: r.status === 'rejected' ? r.reason?.message : null
        }))
    });
});

/**
 * @api {get} /v1/usage Get API usage stats
 */
router.get('/usage', (req, res) => {
    const user = req.apiUser;
    res.json({
        success: true,
        usage: {
            total: user.apiUsage.count,
            monthly: user.apiUsage.monthlyCount,
            lastUsed: user.apiUsage.lastUsed,
            plan: user.plan,
            limit: user.plan === 'pro' ? '1000/day' : '100/day'
        }
    });
});

/**
 * @api {get} /v1/audit Run security audit on URL
 */
router.get('/audit', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url || !validateUrl(url)) {
            return res.status(400).json({ success: false, error: 'Valid URL is required' });
        }

        console.log(`[Public API] Security Audit: ${url}`);
        const audit = await scanWebsite(url);

        res.json({ success: true, data: audit });
    } catch (error) {
        console.error(`[Public API] Audit Error:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
