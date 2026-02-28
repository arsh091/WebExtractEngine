import { scrapeWebsite } from '../services/scraper.js';
import { validateUrl } from '../utils/validators.js';
import { extractPhones, extractEmails, extractAddresses } from '../services/extractor.js';
import { extractCompanyInfo } from '../services/companyExtractor.js';
import { extractSocialMedia } from '../services/socialExtractor.js';
import { db, auth, admin } from '../config/firebase.js';

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

        // Scrape website
        const scraped = await scrapeWebsite(url);

        // Extractions
        const phones = extractPhones(scraped.text);
        const emails = extractEmails(scraped.text);
        const addresses = extractAddresses(scraped.text);
        const companyInfo = extractCompanyInfo(scraped.html, url);
        const socialMedia = extractSocialMedia(scraped.text + '\n' + scraped.html, scraped.html);

        const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

        // Send response first
        res.json({
            success: true,
            data: { phones, emails, addresses, companyInfo, socialMedia },
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

        // Save to Firestore if token is present (Background)
        const authHeader = req.headers.authorization;
        if (authHeader) {
            try {
                const token = authHeader.split(' ')[1];
                const decodedToken = await auth.verifyIdToken(token);
                const uid = decodedToken.uid;

                const extractionData = {
                    userId: uid,
                    url,
                    type: 'single',
                    data: { phones, emails, addresses, companyInfo, socialMedia },
                    count: {
                        phones: phones.length,
                        emails: emails.length,
                        addresses: addresses.length,
                        total: phones.length + emails.length + addresses.length
                    },
                    processingTime: processingTime + 's',
                    createdAt: new Date().toISOString(),
                    isFavorite: false
                };

                // Add to extractions collection
                await db.collection('extractions').add(extractionData);

                // Update user usage count
                const userRef = db.collection('users').doc(uid);
                await userRef.set({
                    extractionCount: admin.firestore.FieldValue.increment(1)
                }, { merge: true });

            } catch (authError) {
                console.error('⚠️ Firebase Auth/DB Error:', authError.message);
            }
        }

    } catch (error) {
        console.error('Extraction Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to extract data. Please try again.'
        });
    }
};

export const testExtraction = (req, res) => {
    res.json({
        success: true,
        message: 'Extract controller is connected (Firebase Node)'
    });
};

import dns from 'dns';
import axios from 'axios';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

export const extractSiteInfo = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ success: false, error: 'URL is required' });
        }

        const hostname = new URL(url).hostname;

        // Parallel execution for performance
        const [ipResult, robotsResult] = await Promise.allSettled([
            lookup(hostname),
            axios.get(`${new URL(url).origin}/robots.txt`, { timeout: 5000 })
        ]);

        const ip = ipResult.status === 'fulfilled' ? ipResult.value.address : 'Unable to resolve';
        const robotsContent = robotsResult.status === 'fulfilled' ? robotsResult.value.data : 'robots.txt not found or inaccessible';

        res.json({
            success: true,
            data: {
                hostname,
                ip,
                robots: robotsContent,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Site Info Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch site information'
        });
    }
};
