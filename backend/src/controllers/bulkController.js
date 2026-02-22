import { scrapeWebsite } from '../services/scraper.js';
import { validateUrl } from '../utils/validators.js';
import { extractPhones, extractEmails, extractAddresses } from '../services/extractor.js';
import { extractCompanyInfo } from '../services/companyExtractor.js';
import { extractSocialMedia } from '../services/socialExtractor.js';
import { db, auth, admin } from '../config/firebase.js';

export const bulkExtract = async (req, res) => {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ success: false, error: 'Please provide an array of URLs' });
    }

    const validUrls = urls.filter(url => validateUrl(url));
    if (validUrls.length === 0) {
        return res.status(400).json({ success: false, error: 'No valid URLs provided' });
    }

    // SSE Setup
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const results = [];
    let completed = 0;

    res.write(`data: ${JSON.stringify({ type: 'start', total: validUrls.length })}\n\n`);

    for (const url of validUrls) {
        try {
            const scraped = await scrapeWebsite(url);
            const result = {
                url,
                status: 'success',
                data: {
                    phones: extractPhones(scraped.text),
                    emails: extractEmails(scraped.text),
                    addresses: extractAddresses(scraped.text),
                    companyInfo: extractCompanyInfo(scraped.html, url),
                    socialMedia: extractSocialMedia(scraped.text + '\n' + scraped.html, scraped.html)
                }
            };

            results.push(result);
            completed++;

            res.write(`data: ${JSON.stringify({
                type: 'progress',
                completed,
                total: validUrls.length,
                url,
                result,
                percentage: Math.round((completed / validUrls.length) * 100)
            })}\n\n`);

            // Save to DB in Background
            const authHeader = req.headers.authorization;
            if (authHeader) {
                try {
                    const token = authHeader.split(' ')[1];
                    const decodedToken = await auth.verifyIdToken(token);
                    const uid = decodedToken.uid;

                    await db.collection('extractions').add({
                        userId: uid,
                        url,
                        type: 'bulk',
                        data: result.data,
                        count: {
                            phones: result.data.phones.length,
                            emails: result.data.emails.length,
                            addresses: result.data.addresses.length,
                            total: result.data.phones.length + result.data.emails.length + result.data.addresses.length
                        },
                        createdAt: new Date().toISOString()
                    });

                    await db.collection('users').doc(uid).set({
                        extractionCount: admin.firestore.FieldValue.increment(1)
                    }, { merge: true });

                } catch (e) { console.error('Bulk DB error:', e.message); }
            }

        } catch (error) {
            completed++;
            res.write(`data: ${JSON.stringify({
                type: 'progress',
                completed,
                total: validUrls.length,
                url,
                status: 'failed',
                error: error.message
            })}\n\n`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.write(`data: ${JSON.stringify({ type: 'complete', summary: { total: validUrls.length } })}\n\n`);
    res.end();
};
