import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeWebsite = async (url) => {
    // High-level safety timeout to prevent app hang
    const totalTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Extraction timed out after 45 seconds')), 45000)
    );

    const actualScrape = (async () => {
        try {
            console.log(`[Scraper] Starting analysis for: ${url}`);

            // Phase 1: FAST SCRAPE (Axios + Cheerio)
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                    },
                    timeout: 8000 // 8s for fast scrape
                });

                const $ = cheerio.load(response.data);
                $('script, style, link, meta, iframe, noscript').remove();
                const text = $('body').text().replace(/\s+/g, ' ');

                if (text.trim().length > 1000) {
                    console.log(`[Scraper] Fast scrape successful (${text.length} chars)`);
                    return {
                        text: text,
                        html: response.data,
                        url: url
                    };
                }
                console.log(`[Scraper] Content too short (${text.length} chars), switching to browser...`);
            } catch (axiosErr) {
                console.log(`[Scraper] Fast scrape failed: ${axiosErr.message}. Falling back to browser...`);
            }

            // Phase 2: DEEP SCRAPE (Puppeteer)
            return await scrapeWithPuppeteer(url);

        } catch (error) {
            console.error(`[Scraper] Critical failure for ${url}:`, error.message);
            throw error;
        }
    })();

    return Promise.race([actualScrape, totalTimeout]);
};

const scrapeWithPuppeteer = async (url) => {
    let browser;
    try {
        console.log(`[Puppeteer] Launching browser...`);

        const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';

        if (isVercel) {
            const chromium = (await import('@sparticuz/chromium')).default;
            const puppeteerCore = (await import('puppeteer-core')).default;

            browser = await puppeteerCore.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });
        } else {
            const puppeteer = (await import('puppeteer')).default;
            browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu'
                ]
            });
        }

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');

        // Faster loading strategy
        console.log(`[Puppeteer] Navigating to ${url}...`);
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 25000
        });

        // Wait a small amount for any JS to finish rendering
        await new Promise(r => setTimeout(r, 2000));

        const result = await page.evaluate(() => {
            const html = document.documentElement.outerHTML;
            const irrelevant = document.querySelectorAll('script, style, link, meta, iframe, noscript, footer, nav');
            irrelevant.forEach(el => el.remove());
            const text = document.body.innerText;
            return { text, html };
        });

        const cleanedText = result.text.replace(/\s+/g, ' ');
        console.log(`[Puppeteer] Deep scrape successful (${cleanedText.length} chars)`);

        return {
            text: cleanedText,
            html: result.html,
            url: url
        };

    } catch (err) {
        console.error(`[Puppeteer] Failed for ${url}: ${err.message}`);
        throw new Error(`Browser analysis failed: ${err.message}`);
    } finally {
        if (browser) {
            console.log(`[Puppeteer] Closing browser.`);
            await browser.close();
        }
    }
};
