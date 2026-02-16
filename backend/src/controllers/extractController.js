import { scrapeWebsite } from '../services/scraper.js';
import { validateUrl } from '../utils/validators.js';
import {
    extractPhones,
    extractEmails,
    extractAddresses
} from '../services/extractor.js';

export const extractData = async (req, res) => {
    const startTime = Date.now();
    try {
        const { url } = req.body;
        console.log(`[Controller] Received request for: ${url}`);

        if (!validateUrl(url)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format'
            });
        }

        console.log(`[Controller] Starting scrape...`);
        const html = await scrapeWebsite(url);
        console.log(`[Controller] Scrape finished. HTML length: ${html?.length || 0}`);

        console.log(`[Controller] Extracting patterns...`);
        const phones = extractPhones(html);
        const emails = extractEmails(html);
        const addresses = extractAddresses(html);

        const duration = (Date.now() - startTime) / 1000;
        console.log(`[Controller] Extraction complete in ${duration}s. Found: ${phones.length} phones, ${emails.length} emails, ${addresses.length} addresses.`);

        res.json({
            success: true,
            data: {
                phones: [...new Set(phones)], // Remove duplicates
                emails: [...new Set(emails)],
                addresses: [...new Set(addresses)]
            },
            count: {
                phones: phones.length,
                emails: emails.length,
                addresses: addresses.length
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        const duration = (Date.now() - startTime) / 1000;
        console.error(`[Controller] Extraction failed after ${duration}s:`, error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to extract data. Please check the URL and try again.'
        });
    }
};

export const testExtraction = (req, res) => {
    res.json({
        success: true,
        message: 'Extract controller is connected and working'
    });
};
