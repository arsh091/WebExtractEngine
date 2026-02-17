import { scrapeWebsite } from '../services/scraper.js';
import { validateUrl } from '../utils/validators.js';
import { extractPhones, extractEmails, extractAddresses } from '../services/extractor.js';
import { extractCompanyInfo } from '../services/companyExtractor.js';
import { extractSocialMedia } from '../services/socialExtractor.js';

export const extractData = async (req, res) => {
    const startTime = Date.now();

    try {
        const { url } = req.body;

        if (!validateUrl(url)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format'
            });
        }

        // Scrape website (now returns {text, html, url})
        const scraped = await scrapeWebsite(url);

        // === EXISTING EXTRACTIONS ===
        const phones = extractPhones(scraped.text);
        const emails = extractEmails(scraped.text);
        const addresses = extractAddresses(scraped.text);

        // === NEW EXTRACTIONS ===
        const companyInfo = extractCompanyInfo(scraped.html, url);
        const socialMedia = extractSocialMedia(scraped.text + '\n' + scraped.html, scraped.html);

        const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

        res.json({
            success: true,
            data: {
                // Existing
                phones,
                emails,
                addresses,
                // New
                companyInfo,
                socialMedia
            },
            count: {
                phones: phones.length,
                emails: emails.length,
                addresses: addresses.length,
                socialPlatforms: Object.values(socialMedia)
                    .filter(v => v && (!Array.isArray(v) || v.length > 0)).length,
                whatsapp: socialMedia.whatsapp?.length || 0,
                total: phones.length + emails.length + addresses.length
            },
            metadata: {
                url,
                processingTime: processingTime + 's',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Extraction error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to extract data. Please try again.'
        });
    }
};

export const testExtraction = (req, res) => {
    res.json({
        success: true,
        message: 'Extract controller is connected and working'
    });
};
