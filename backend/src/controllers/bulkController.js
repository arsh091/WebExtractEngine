import { scrapeWebsite } from '../services/scraper.js';
import { validateUrl } from '../utils/validators.js';
import { extractPhones, extractEmails, extractAddresses } from '../services/extractor.js';
import { extractCompanyInfo } from '../services/companyExtractor.js';
import { extractSocialMedia } from '../services/socialExtractor.js';

export const bulkExtract = async (req, res) => {
    const { urls } = req.body;

    // Validate input
    if (!Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Please provide an array of URLs'
        });
    }

    if (urls.length > 20) {
        return res.status(400).json({
            success: false,
            error: 'Maximum 20 URLs allowed per bulk request'
        });
    }

    // Filter valid URLs
    const validUrls = urls.filter(url => validateUrl(url));

    if (validUrls.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'No valid URLs provided'
        });
    }

    console.log(`🔄 Bulk processing ${validUrls.length} URLs...`);

    // Use SSE (Server-Sent Events) for real-time progress
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const results = [];
    let completed = 0;

    // Send initial event
    res.write(`data: ${JSON.stringify({
        type: 'start',
        total: validUrls.length
    })}\n\n`);

    // Process URLs one by one (to avoid overloading)
    for (const url of validUrls) {
        try {
            console.log(`  Processing: ${url}`);

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

            // Send progress update
            res.write(`data: ${JSON.stringify({
                type: 'progress',
                completed,
                total: validUrls.length,
                url,
                result,
                percentage: Math.round((completed / validUrls.length) * 100)
            })}\n\n`);

        } catch (error) {
            const failedResult = {
                url,
                status: 'failed',
                error: error.message,
                data: null
            };

            results.push(failedResult);
            completed++;

            res.write(`data: ${JSON.stringify({
                type: 'progress',
                completed,
                total: validUrls.length,
                url,
                result: failedResult,
                percentage: Math.round((completed / validUrls.length) * 100)
            })}\n\n`);
        }

        // Small delay between requests (be respectful)
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Send completion event
    res.write(`data: ${JSON.stringify({
        type: 'complete',
        results,
        summary: {
            total: validUrls.length,
            successful: results.filter(r => r.status === 'success').length,
            failed: results.filter(r => r.status === 'failed').length,
            totalPhones: results.reduce((sum, r) => sum + (r.data?.phones?.length || 0), 0),
            totalEmails: results.reduce((sum, r) => sum + (r.data?.emails?.length || 0), 0),
            totalAddresses: results.reduce((sum, r) => sum + (r.data?.addresses?.length || 0), 0)
        }
    })}\n\n`);

    res.end();
};
