// ================================================================
// scraper.js — ULTRA-POWERFUL Multi-Strategy Scraper v3.0
// ================================================================
import axios from 'axios';
import * as cheerio from 'cheerio';

// ── Shared browser instance (reuse across requests) ─────────────
let sharedBrowser = null;
let browserUseCount = 0;
const BROWSER_RECYCLE_AFTER = 15; // restart browser every 15 uses

// ── Rotating User-Agent pool ─────────────────────────────────────
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
];
const randomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// ── Axios base headers ────────────────────────────────────────────
const buildHeaders = () => ({
    'User-Agent': randomUA(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Connection': 'keep-alive',
});

// ================================================================
// MAIN EXPORT
// ================================================================
export const scrapeWebsite = async (url) => {
    // Safety: hard 50s timeout around everything
    const hardTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Extraction timed out (50s)')), 50000)
    );

    return Promise.race([_scrape(url), hardTimeout]);
};

async function _scrape(url) {
    console.log(`\n[Scraper] ══════════ Starting: ${url} ══════════`);

    // ── Strategy 1: Axios (fast, no JS) ─────────────────────────
    const axiosResult = await tryAxios(url);
    if (axiosResult && isContentRich(axiosResult.text)) {
        console.log(`[Scraper] ✅ Strategy 1 (Axios) succeeded — ${axiosResult.text.length} chars`);
        return axiosResult;
    }

    // ── Strategy 2: Axios with different headers (bypass some blocks) ──
    if (!axiosResult) {
        const axiosResult2 = await tryAxiosAlt(url);
        if (axiosResult2 && isContentRich(axiosResult2.text)) {
            console.log(`[Scraper] ✅ Strategy 2 (Axios-Alt) succeeded — ${axiosResult2.text.length} chars`);
            return axiosResult2;
        }
    }

    // ── Strategy 3: Puppeteer (JS-rendered pages) ────────────────
    console.log(`[Scraper] ⏳ Falling back to Puppeteer...`);
    return await tryPuppeteer(url);
}

// ================================================================
// STRATEGY 1 — Axios + Cheerio (standard)
// ================================================================
async function tryAxios(url) {
    try {
        const response = await axios.get(url, {
            headers: buildHeaders(),
            timeout: 10000,
            maxRedirects: 5,
            responseType: 'text',
            validateStatus: (s) => s < 400,
        });

        return buildResult(response.data, url, 'axios');
    } catch (err) {
        console.log(`[Scraper] Axios failed: ${err.message}`);
        return null;
    }
}

// ================================================================
// STRATEGY 2 — Axios with mobile/crawler UA (bypass anti-bot)
// ================================================================
async function tryAxiosAlt(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
                'Accept': 'text/html',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
            },
            timeout: 10000,
            maxRedirects: 5,
            validateStatus: (s) => s < 400,
        });

        return buildResult(response.data, url, 'axios-alt');
    } catch (err) {
        console.log(`[Scraper] Axios-Alt failed: ${err.message}`);
        return null;
    }
}

// ================================================================
// BUILD RESULT — extract rich content from raw HTML
// ================================================================
function buildResult(rawHtml, url, method) {
    const $ = cheerio.load(rawHtml);

    // ── Pull targeted content BEFORE stripping ───────────────────
    const contactSectionText = extractContactSections($);
    const footerText = $('footer').text();
    const addressTagText = $('address').map((_, el) => $(el).text()).get().join('\n');

    // ── Collect mailto + tel links ────────────────────────────────
    const mailtoLinks = [];
    $('a[href^="mailto:"]').each((_, el) => {
        mailtoLinks.push($(el).attr('href').replace(/^mailto:/i, '').split('?')[0].trim());
    });

    const telLinks = [];
    $('a[href^="tel:"]').each((_, el) => {
        telLinks.push($(el).attr('href'));
    });

    // ── Pull JSON-LD blocks raw (before stripping) ────────────────
    const jsonLdBlocks = [];
    $('script[type="application/ld+json"]').each((_, el) => {
        jsonLdBlocks.push($(el).html() || '');
    });

    // ── Pull meta content ─────────────────────────────────────────
    const metaContent = [
        $('meta[name="description"]').attr('content') || '',
        $('meta[property="og:description"]').attr('content') || '',
        $('meta[name="keywords"]').attr('content') || '',
    ].join(' ');

    // ── Strip script/style for clean body text ────────────────────
    $('script, style, noscript, svg, canvas, template, head').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    // ── Assemble rich content sections ────────────────────────────
    const richText = [
        bodyText,
        contactSectionText,
        footerText,
        addressTagText,
        mailtoLinks.join('\n'),
        telLinks.join('\n'),
        metaContent,
        jsonLdBlocks.join('\n'),
    ].filter(Boolean).join('\n\n=====SECTION=====\n\n');

    return {
        text: richText,
        html: rawHtml,
        url,
        method,
        stats: {
            bodyChars: bodyText.length,
            mailtoCount: mailtoLinks.length,
            telCount: telLinks.length,
            jsonLdCount: jsonLdBlocks.length,
        }
    };
}

// ================================================================
// STRATEGY 3 — Puppeteer (JS-rendered, SPA, protected pages)
// ================================================================
async function tryPuppeteer(url) {
    let browser;
    let ownBrowser = false;

    try {
        browser = await getBrowser();

        const page = await browser.newPage();

        // ── Setup ─────────────────────────────────────────────────
        await page.setUserAgent(randomUA());
        await page.setViewport({ width: 1366, height: 768 });
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
        });

        // ── Block unnecessary resources (speed) ───────────────────
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const type = req.resourceType();
            if (['image', 'stylesheet', 'font', 'media', 'websocket'].includes(type)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // ── Navigate ──────────────────────────────────────────────
        console.log(`[Puppeteer] Navigating to ${url}...`);
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 28000,
        });

        // ── Wait for contact info to appear ───────────────────────
        await waitForContactContent(page);

        // ── Scroll to trigger lazy-loaded content ─────────────────
        await autoScroll(page);

        // ── Extract rich data from page ───────────────────────────
        const result = await page.evaluate(() => {
            const fullHtml = document.documentElement.outerHTML;

            // Gather mailto/tel before removing anything
            const mailtoLinks = Array.from(document.querySelectorAll('a[href^="mailto:"]'))
                .map(a => a.href.replace('mailto:', '').split('?')[0]);

            const telLinks = Array.from(document.querySelectorAll('a[href^="tel:"]'))
                .map(a => a.href);

            // Contact sections
            const contactKeywords = ['contact', 'address', 'location', 'office', 'reach', 'touch'];
            const contactSections = Array.from(document.querySelectorAll('section, div, footer, article'))
                .filter(el => {
                    const combined = ((el.id || '') + ' ' + (el.className || '')).toLowerCase();
                    return contactKeywords.some(kw => combined.includes(kw));
                })
                .map(el => el.innerText)
                .join('\n');

            // Address tags
            const addressTags = Array.from(document.querySelectorAll('address'))
                .map(el => el.innerText).join('\n');

            // JSON-LD
            const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
                .map(s => s.textContent).join('\n');

            // Footer text
            const footer = document.querySelector('footer');
            const footerText = footer ? footer.innerText : '';

            // Clean body text
            ['script', 'style', 'noscript', 'svg', 'canvas'].forEach(tag => {
                document.querySelectorAll(tag).forEach(el => el.remove());
            });
            const bodyText = document.body ? document.body.innerText : '';

            return {
                html: fullHtml,
                bodyText,
                contactSections,
                addressTags,
                footerText,
                mailtoLinks,
                telLinks,
                jsonLd,
            };
        });

        const richText = [
            result.bodyText,
            result.contactSections,
            result.addressTags,
            result.footerText,
            result.mailtoLinks.join('\n'),
            result.telLinks.join('\n'),
            result.jsonLd,
        ].filter(Boolean).join('\n\n=====SECTION=====\n\n');

        console.log(`[Puppeteer] ✅ Success — ${richText.length} chars`);

        await page.close();
        browserUseCount++;

        return {
            text: richText,
            html: result.html,
            url,
            method: 'puppeteer',
        };

    } catch (err) {
        console.error(`[Puppeteer] ❌ Failed: ${err.message}`);
        throw new Error(`All scraping strategies failed: ${err.message}`);
    } finally {
        // If browser exceeded use limit, close it so it gets recreated fresh
        if (browserUseCount >= BROWSER_RECYCLE_AFTER) {
            console.log(`[Puppeteer] ♻️ Recycling browser after ${browserUseCount} uses`);
            try { if (sharedBrowser) await sharedBrowser.close(); } catch (_) {}
            sharedBrowser = null;
            browserUseCount = 0;
        }
    }
}

// ================================================================
// PUPPETEER HELPERS
// ================================================================

/** Get or create shared browser instance */
async function getBrowser() {
    if (sharedBrowser) {
        try {
            // Quick health check
            await sharedBrowser.version();
            return sharedBrowser;
        } catch (_) {
            sharedBrowser = null;
        }
    }

    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER;

    if (isProduction && process.env.VERCEL) {
        // Vercel: use @sparticuz/chromium
        const chromium = (await import('@sparticuz/chromium')).default;
        const puppeteerCore = (await import('puppeteer-core')).default;
        sharedBrowser = await puppeteerCore.launch({
            args: [...chromium.args, '--disable-web-security', '--no-first-run'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
    } else {
        // Local / Render: use puppeteer directly
        const puppeteer = (await import('puppeteer')).default;
        sharedBrowser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--blink-settings=imagesEnabled=false',
                '--window-size=1366,768',
                '--no-first-run',
                '--no-zygote',
            ],
            ignoreHTTPSErrors: true,
        });
    }

    console.log('[Puppeteer] 🚀 New browser instance created');
    return sharedBrowser;
}

/** Wait up to 5s for phone/email content to appear on page */
async function waitForContactContent(page) {
    try {
        await page.waitForFunction(
            () => {
                const text = document.body?.innerText || '';
                return (
                    /\d{10}/.test(text) ||
                    /@/.test(text) ||
                    /address|contact|phone|email/i.test(text)
                );
            },
            { timeout: 5000 }
        );
    } catch (_) {
        // If nothing found in 5s, continue anyway
    }
}

/** Slowly scroll the full page to trigger lazy-loaded sections */
async function autoScroll(page) {
    try {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                const distance = 400;
                const delay = 100;
                let scrolled = 0;
                const height = document.body.scrollHeight;

                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    scrolled += distance;
                    if (scrolled >= height) {
                        clearInterval(timer);
                        resolve();
                    }
                }, delay);
            });
        });
    } catch (_) {}
}

// ================================================================
// CHEERIO HELPERS
// ================================================================

/** Extract text from contact/address/location sections via DOM */
function extractContactSections($) {
    const keywords = ['contact', 'address', 'location', 'office', 'reach', 'touch', 'connect'];
    const results = [];

    $('section, div, article, aside, footer').each((_, el) => {
        const $el = $(el);
        const id = ($el.attr('id') || '').toLowerCase();
        const cls = ($el.attr('class') || '').toLowerCase();
        const combined = id + ' ' + cls;

        if (keywords.some(kw => combined.includes(kw))) {
            const text = $el.text().replace(/\s+/g, ' ').trim();
            if (text.length > 20) results.push(text);
        }
    });

    return results.join('\n');
}

// ================================================================
// UTILITY
// ================================================================
function isContentRich(text) {
    // Consider content useful if it has > 800 chars
    return text && text.trim().length > 800;
}

// Graceful shutdown
process.on('SIGINT', async () => {
    if (sharedBrowser) {
        console.log('[Puppeteer] Closing shared browser on exit...');
        await sharedBrowser.close();
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    if (sharedBrowser) await sharedBrowser.close();
    process.exit(0);
});