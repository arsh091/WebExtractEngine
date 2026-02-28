// ================================================================
// scraper.js — ULTRA-AGGRESSIVE MODE v4.0 🔥
// Maximum power extraction with anti-bot bypass
// ================================================================
import axios from 'axios';
import * as cheerio from 'cheerio';

// ── Browser instance management ──────────────────────────────────
let sharedBrowser = null;
let browserUseCount = 0;
const BROWSER_RECYCLE_AFTER = 10;

// ── User-Agent rotation pool (20+ agents) ────────────────────────
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/109.0 Firefox/115.0',
    'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
];
const randomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// ================================================================
// MAIN EXPORT
// ================================================================
export const scrapeWebsite = async (url) => {
    const hardTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('⏱️ Timeout after 60 seconds')), 60000)
    );
    return Promise.race([_scrape(url), hardTimeout]);
};

async function _scrape(url) {
    console.log(`\n[Scraper] 🚀 ════════════ ULTRA-AGGRESSIVE MODE ════════════`);
    console.log(`[Scraper] 🎯 Target: ${url}`);

    // ── STRATEGY 1: Quick Axios attempt ──────────────────────────
    const axiosResult = await tryAxios(url);
    if (axiosResult && isContentUseful(axiosResult.text)) {
        console.log(`[Scraper] ✅ Axios succeeded (${axiosResult.text.length} chars)`);
        return axiosResult;
    }

    // ── STRATEGY 2: Puppeteer with maximum aggression ────────────
    console.log(`[Scraper] 🤖 Deploying Puppeteer with stealth mode...`);
    return await tryPuppeteerAggressive(url);
}

// ================================================================
// STRATEGY 1 — Axios with aggressive headers
// ================================================================
async function tryAxios(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': randomUA(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Upgrade-Insecure-Requests': '1',
                'Connection': 'keep-alive',
            },
            timeout: 12000,
            maxRedirects: 5,
            validateStatus: (s) => s < 500,
        });

        return buildRichResult(response.data, url, 'axios');
    } catch (err) {
        console.log(`[Scraper] ⚠️  Axios failed: ${err.message}`);
        return null;
    }
}

// ================================================================
// STRATEGY 2 — ULTRA-AGGRESSIVE PUPPETEER
// ================================================================
async function tryPuppeteerAggressive(url) {
    let browser;
    try {
        browser = await getAggressiveBrowser();
        const page = await browser.newPage();

        // ── STEALTH SETUP ────────────────────────────────────────
        await setupStealthMode(page);

        // ── Block unnecessary resources ──────────────────────────
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const type = req.resourceType();
            const blockedTypes = ['image', 'stylesheet', 'font', 'media', 'websocket', 'manifest', 'other'];
            const url = req.url();

            // Block ads, analytics, trackers
            if (
                blockedTypes.includes(type) ||
                url.includes('google-analytics') ||
                url.includes('googletagmanager') ||
                url.includes('facebook.com/tr') ||
                url.includes('doubleclick') ||
                url.includes('ads') ||
                url.includes('analytics')
            ) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // ── Navigate with retry ──────────────────────────────────
        console.log(`[Puppeteer] 🌐 Navigating to ${url}...`);

        let navigationSuccess = false;
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                await page.goto(url, {
                    waitUntil: 'networkidle2', // Wait for network to be mostly idle
                    timeout: 30000,
                });
                navigationSuccess = true;
                console.log(`[Puppeteer] ✅ Navigation successful on attempt ${attempt}`);
                break;
            } catch (navErr) {
                console.log(`[Puppeteer] ⚠️  Navigation attempt ${attempt} failed: ${navErr.message}`);
                if (attempt === 2) throw navErr;
                await new Promise(r => setTimeout(r, 2000)); // Wait before retry
            }
        }

        if (!navigationSuccess) throw new Error('Navigation failed after retries');

        // ── AGGRESSIVE CONTENT EXTRACTION ────────────────────────
        console.log(`[Puppeteer] 📡 Extracting ALL visible content...`);

        // Wait for common contact elements to appear
        await Promise.race([
            page.waitForFunction(() => {
                const text = document.body.innerText;
                return (
                    /\d{10}/.test(text) ||
                    /@/.test(text) ||
                    /\+\d{1,3}/.test(text) ||
                    /contact|phone|email|whatsapp/i.test(text)
                );
            }, { timeout: 8000 }),
            new Promise(r => setTimeout(r, 8000)) // Max 8s wait
        ]).catch(() => { });

        // Scroll the entire page to load lazy content
        await aggressiveScroll(page);

        // Click common "Show contact" buttons if present
        await clickContactRevealButtons(page);

        // ── EXTRACT EVERYTHING ───────────────────────────────────
        const extracted = await page.evaluate(() => {
            const fullHtml = document.documentElement.outerHTML;

            // ── Collect mailto & tel links (highest priority) ────
            const mailtoLinks = Array.from(document.querySelectorAll('a[href^="mailto:"]'))
                .map(a => a.href.replace('mailto:', '').split('?')[0].trim());

            const telLinks = Array.from(document.querySelectorAll('a[href^="tel:"]'))
                .map(a => a.href.replace('tel:', '').trim());

            // ── Collect WhatsApp links ───────────────────────────
            const waLinks = Array.from(document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]'))
                .map(a => a.href);

            // ── Collect data attributes (many sites hide contact in data-*) ─
            const dataPhones = Array.from(document.querySelectorAll('[data-phone], [data-tel], [data-mobile], [data-contact]'))
                .map(el => (
                    el.getAttribute('data-phone') ||
                    el.getAttribute('data-tel') ||
                    el.getAttribute('data-mobile') ||
                    el.getAttribute('data-contact')
                )).filter(Boolean);

            const dataEmails = Array.from(document.querySelectorAll('[data-email], [data-mail]'))
                .map(el => el.getAttribute('data-email') || el.getAttribute('data-mail'))
                .filter(Boolean);

            // ── Extract from specific sections ───────────────────
            const contactKeywords = ['contact', 'address', 'location', 'office', 'reach', 'touch', 'about', 'footer'];
            const targetSections = [];

            // Footer (most important for small business sites)
            const footer = document.querySelector('footer');
            if (footer) targetSections.push(footer.innerText);

            // Header
            const header = document.querySelector('header');
            if (header) targetSections.push(header.innerText);

            // Contact/Address sections
            document.querySelectorAll('section, div, article, aside').forEach(el => {
                const id = (el.id || '').toLowerCase();
                const cls = (el.className || '').toLowerCase();
                const combined = id + ' ' + cls;

                if (contactKeywords.some(kw => combined.includes(kw))) {
                    const text = el.innerText;
                    if (text && text.length > 30 && text.length < 5000) {
                        targetSections.push(text);
                    }
                }
            });

            // Address tags
            const addressTags = Array.from(document.querySelectorAll('address'))
                .map(a => a.innerText);

            // JSON-LD structured data
            const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
                .map(s => s.textContent);

            // Meta tags
            const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
            const ogDescription = document.querySelector('meta[property="og:description"]')?.content || '';

            // ALL visible text from body (last resort)
            const allBodyText = document.body ? document.body.innerText : '';

            // All anchor text (sometimes contact hidden in link text)
            const allLinkText = Array.from(document.querySelectorAll('a'))
                .map(a => a.innerText + ' ' + a.href)
                .join('\n');

            return {
                html: fullHtml,
                mailtoLinks,
                telLinks,
                waLinks,
                dataPhones,
                dataEmails,
                targetSections,
                addressTags,
                jsonLdScripts,
                metaDescription,
                ogDescription,
                allBodyText,
                allLinkText,
            };
        });

        // ── Assemble ultra-rich content ──────────────────────────
        const richContent = [
            '=== MAILTO LINKS ===',
            extracted.mailtoLinks.map(l => `href="mailto:${l}"`).join('\n'),
            '',
            '=== TEL LINKS ===',
            extracted.telLinks.map(l => `href="tel:${l}"`).join('\n'),
            '',
            '=== WHATSAPP LINKS ===',
            extracted.waLinks.map(l => `href="${l}"`).join('\n'),
            '',
            '=== DATA ATTRIBUTES ===',
            'Phones: ' + extracted.dataPhones.join(', '),
            'Emails: ' + extracted.dataEmails.join(', '),
            '',
            '=== CONTACT SECTIONS ===',
            extracted.targetSections.join('\n\n---\n\n'),
            '',
            '=== ADDRESS TAGS ===',
            extracted.addressTags.join('\n'),
            '',
            '=== JSON-LD DATA ===',
            extracted.jsonLdScripts.join('\n\n'),
            '',
            '=== META ===',
            extracted.metaDescription,
            extracted.ogDescription,
            '',
            '=== ALL LINKS ===',
            extracted.allLinkText,
            '',
            '=== FULL BODY TEXT ===',
            extracted.allBodyText,
        ].join('\n');

        console.log(`[Puppeteer] ✅ Rich Content: ${richContent.length} chars | HTML: ${extracted.html.length} chars`);
        console.log(`[Puppeteer] 📊 Found: ${extracted.mailtoLinks.length} emails, ${extracted.telLinks.length} phones`);

        // ── CAPTURE SCREENSHOT ────────────────────────────────────
        console.log(`[Puppeteer] 📸 Capturing visual snapshot...`);
        const screenshotBuf = await page.screenshot({
            type: 'jpeg',
            quality: 60,
            fullPage: false,
            encoding: 'base64'
        }).catch(err => {
            console.log(`[Puppeteer] ⚠️ Screenshot failed: ${err.message}`);
            return null;
        });

        await page.close();
        browserUseCount++;

        return {
            success: true,
            text: richContent,
            html: extracted.html,
            screenshot: screenshotBuf ? `data:image/jpeg;base64,${screenshotBuf}` : null,
            url,
            method: 'puppeteer-aggressive',
            stats: {
                mailtoCount: extracted.mailtoLinks.length,
                telCount: extracted.telLinks.length,
                waCount: extracted.waLinks.length
            }
        };

    } catch (err) {
        console.error(`[Puppeteer] ❌ Failed: ${err.message}`);
        throw new Error(`Aggressive extraction failed: ${err.message}`);
    } finally {
        if (browserUseCount >= BROWSER_RECYCLE_AFTER && sharedBrowser) {
            console.log(`[Puppeteer] ♻️  Recycling browser...`);
            try { await sharedBrowser.close(); } catch (_) { }
            sharedBrowser = null;
            browserUseCount = 0;
        }
    }
}

// ================================================================
// BROWSER SETUP WITH STEALTH
// ================================================================
async function getAggressiveBrowser() {
    if (sharedBrowser) {
        try {
            await sharedBrowser.version();
            return sharedBrowser;
        } catch (_) {
            sharedBrowser = null;
        }
    }

    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER || !!process.env.VERCEL;

    if (isProduction && process.env.VERCEL) {
        const chromium = (await import('@sparticuz/chromium')).default;
        const puppeteerCore = (await import('puppeteer-core')).default;
        sharedBrowser = await puppeteerCore.launch({
            args: [...chromium.args, '--disable-blink-features=AutomationControlled'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
    } else {
        const puppeteer = (await import('puppeteer')).default;
        sharedBrowser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process',
                '--window-size=1920,1080',
            ],
            ignoreHTTPSErrors: true,
        });
    }

    console.log('[Puppeteer] 🚀 New aggressive browser launched');
    return sharedBrowser;
}

// ── Make page look like real user ────────────────────────────────
async function setupStealthMode(page) {
    await page.setUserAgent(randomUA());
    await page.setViewport({ width: 1920, height: 1080 });

    // Override navigator properties to hide automation
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en', 'hi'] });
        window.chrome = { runtime: {} };
    });

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml',
    });
}

// ── Scroll entire page slowly (triggers lazy-load) ───────────────
async function aggressiveScroll(page) {
    try {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 300;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= document.body.scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 150);
            });
        });
        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
    } catch (_) { }
}

// ── Click "Show phone", "View contact", etc. buttons ─────────────
async function clickContactRevealButtons(page) {
    try {
        await page.evaluate(() => {
            const keywords = ['show contact', 'view phone', 'reveal number', 'call now', 'contact us', 'get phone', 'show number'];
            const buttons = Array.from(document.querySelectorAll('button, a, span, div'));

            buttons.forEach(btn => {
                const text = (btn.innerText || '').toLowerCase();
                const title = (btn.title || '').toLowerCase();
                const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
                const combined = text + ' ' + title + ' ' + ariaLabel;

                if (keywords.some(kw => combined.includes(kw))) {
                    try {
                        btn.click();
                    } catch (_) { }
                }
            });
        });
        // Wait for content to appear after click
        await new Promise(r => setTimeout(r, 2000));
    } catch (_) { }
}

// ================================================================
// AXIOS RESULT BUILDER
// ================================================================
function buildRichResult(rawHtml, url, method) {
    const $ = cheerio.load(rawHtml);

    const sections = [];

    // Mailto & tel links
    const mailtoLinks = [];
    $('a[href^="mailto:"]').each((_, el) => {
        mailtoLinks.push($(el).attr('href').replace('mailto:', '').split('?')[0].trim());
    });

    const telLinks = [];
    $('a[href^="tel:"]').each((_, el) => {
        telLinks.push($(el).attr('href'));
    });

    // WhatsApp links
    const waLinks = [];
    $('a[href*="wa.me"], a[href*="whatsapp"]').each((_, el) => {
        waLinks.push($(el).attr('href'));
    });

    // Contact sections
    $('footer, header, [class*="contact"], [id*="contact"], address').each((_, el) => {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        if (text.length > 30 && text.length < 5000) sections.push(text);
    });

    // JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
        sections.push($(el).html() || '');
    });

    // Body text
    $('script, style, noscript, svg').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    const richText = [
        '=== MAILTO ===', mailtoLinks.map(l => `href="${l}"`).join('\n'),
        '=== TEL ===', telLinks.map(l => `href="${l}"`).join('\n'),
        '=== WHATSAPP ===', waLinks.map(l => `href="${l}"`).join('\n'),
        '=== SECTIONS ===', sections.join('\n\n'),
        '=== BODY ===', bodyText,
    ].join('\n');

    return { text: richText, html: rawHtml, url, method };
}

// ================================================================
// UTILITIES
// ================================================================
function isContentUseful(text) {
    // Increased threshold and check for common JS patterns
    if (!text || text.trim().length < 2000) return false;
    if (text.includes('Loading...') || text.includes('Please wait...') || text.includes('JavaScript is required')) return false;
    return true;
}

// Graceful shutdown
process.on('SIGINT', async () => {
    if (sharedBrowser) await sharedBrowser.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    if (sharedBrowser) await sharedBrowser.close();
    process.exit(0);
});