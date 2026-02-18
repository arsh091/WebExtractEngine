// ================================================================
// companyExtractor.js — ULTRA-POWERFUL Company Info v3.0
// ================================================================
import * as cheerio from 'cheerio';

// ================================================================
// MAIN EXPORT
// ================================================================
export const extractCompanyInfo = (html, url) => {
    console.log('\n🏢 ══════════ COMPANY INFO EXTRACTION v3 ══════════');
    const $ = cheerio.load(html);
    let baseOrigin = '';
    try { baseOrigin = new URL(url).origin; } catch (_) {}

    const info = {
        title:       '',
        name:        '',
        description: '',
        logo:        '',
        favicon:     '',
        language:    '',
        themeColor:  '',
        keywords:    '',
        ogImage:     '',
        // New fields
        foundedYear: '',
        type:        '',      // LocalBusiness, Organization, etc.
        priceRange:  '',      // e.g. "₹₹" from schema
        openingHours:'',
        address:     '',      // from schema
        phone:       '',      // from schema
        email:       '',      // from schema
        sameAs:      [],      // social links from schema
        rating:      null,    // aggregateRating
    };

    // ── 1. TITLE ────────────────────────────────────────────────
    info.title =
        $('title').first().text().trim() ||
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') ||
        $('meta[name="title"]').attr('content') || '';

    // ── 2. COMPANY NAME ─────────────────────────────────────────
    info.name =
        $('meta[property="og:site_name"]').attr('content') ||
        $('meta[name="application-name"]').attr('content') ||
        $('meta[name="apple-mobile-web-app-title"]').attr('content') ||
        $('[class*="logo"] img, [id*="logo"] img').first().attr('alt') ||
        $('[class*="brand"] img, [id*="brand"] img').first().attr('alt') ||
        $('header [class*="logo"], header [class*="brand"], header [class*="company"]').first().text().trim() ||
        $('[itemprop="name"]').first().text().trim() ||
        extractNameFromJsonLd($) ||
        extractNameFromTitle(info.title) ||
        '';

    // Trim if name is too long (probably captured wrong thing)
    if (info.name.length > 80) {
        info.name = info.name.split(/[,|–\-]/).shift().trim();
    }

    // ── 3. DESCRIPTION ──────────────────────────────────────────
    info.description =
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content') ||
        $('[itemprop="description"]').first().text().trim().substring(0, 300) ||
        '';

    // ── 4. LOGO ─────────────────────────────────────────────────
    // Priority: header logo image > og:image > largest img in header
    const logoCandidates = [
        $('header img[class*="logo"], header img[id*="logo"]').first().attr('src'),
        $('[class*="logo"] img, [id*="logo"] img').first().attr('src'),
        $('[class*="brand"] img').first().attr('src'),
        $('a[href="/"] img').first().attr('src'),        // Logo link to homepage
        $('meta[property="og:image"]').attr('content'),
        $('[itemprop="logo"]').attr('src') || $('[itemprop="logo"] img').attr('src'),
    ].filter(Boolean);

    for (const src of logoCandidates) {
        const resolved = resolveUrl(src, baseOrigin);
        if (resolved) { info.logo = resolved; break; }
    }

    // ── 5. FAVICON ──────────────────────────────────────────────
    const faviconCandidates = [
        $('link[rel="apple-touch-icon"]').attr('href'),                // 180×180
        $('link[rel="icon"][sizes="32x32"]').attr('href'),
        $('link[rel="icon"][sizes="16x16"]').attr('href'),
        $('link[rel="icon"]').first().attr('href'),
        $('link[rel="shortcut icon"]').attr('href'),
    ].filter(Boolean);

    const faviconSrc = faviconCandidates[0] || '/favicon.ico';
    info.favicon = resolveUrl(faviconSrc, baseOrigin) || `${baseOrigin}/favicon.ico`;

    // ── 6. LANGUAGE ─────────────────────────────────────────────
    info.language = $('html').attr('lang') || $('html').attr('xml:lang') || '';

    // ── 7. THEME COLOR ──────────────────────────────────────────
    info.themeColor =
        $('meta[name="theme-color"]').attr('content') ||
        $('meta[name="msapplication-TileColor"]').attr('content') || '';

    // ── 8. KEYWORDS ─────────────────────────────────────────────
    info.keywords = $('meta[name="keywords"]').attr('content') || '';

    // ── 9. OG IMAGE ─────────────────────────────────────────────
    const ogImg = $('meta[property="og:image"]').attr('content') || '';
    info.ogImage = resolveUrl(ogImg, baseOrigin) || '';

    // ── 10. JSON-LD DEEP EXTRACTION ─────────────────────────────
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).html() || '{}');
            enrichFromJsonLd(info, json, baseOrigin);
        } catch (_) {}
    });

    // ── 11. MICRODATA itemprop extraction ───────────────────────
    const ipPhone = $('[itemprop="telephone"]').first().text().trim();
    if (ipPhone && !info.phone) info.phone = ipPhone;

    const ipEmail = $('[itemprop="email"]').first().text().trim();
    if (ipEmail && !info.email) info.email = ipEmail.replace(/^mailto:/i, '');

    const ipAddress = $('[itemprop="address"]').first().text().replace(/\s+/g, ' ').trim();
    if (ipAddress && !info.address) info.address = ipAddress;

    const ipFoundedYear = $('[itemprop="foundingDate"]').first().text().trim();
    if (ipFoundedYear) info.foundedYear = ipFoundedYear.substring(0, 4);

    const ratingEl = $('[itemprop="ratingValue"]').first().text().trim();
    const countEl  = $('[itemprop="reviewCount"], [itemprop="ratingCount"]').first().text().trim();
    if (ratingEl) {
        info.rating = {
            value: parseFloat(ratingEl),
            count: countEl ? parseInt(countEl) : null,
        };
    }

    console.log(`  ✅ Name: ${info.name || '(not found)'}`);
    console.log(`  ✅ Title: ${info.title.substring(0, 60) || '(not found)'}`);
    console.log(`  ✅ Logo: ${info.logo ? 'Found' : 'Not found'}`);
    console.log(`  ✅ Phone (schema): ${info.phone || 'Not found'}`);
    console.log(`  ✅ Email (schema): ${info.email || 'Not found'}`);
    console.log(`  ✅ sameAs links: ${info.sameAs.length}`);
    console.log('══════════════════════════════════════════════════\n');

    return info;
};

// ================================================================
// JSON-LD ENRICHMENT
// ================================================================
function enrichFromJsonLd(info, obj, baseOrigin) {
    if (!obj || typeof obj !== 'object') return;

    // Handle @graph arrays
    if (obj['@graph'] && Array.isArray(obj['@graph'])) {
        obj['@graph'].forEach(item => enrichFromJsonLd(info, item, baseOrigin));
        return;
    }
    if (Array.isArray(obj)) {
        obj.forEach(item => enrichFromJsonLd(info, item, baseOrigin));
        return;
    }

    const type = obj['@type'] || '';
    const typeStr = Array.isArray(type) ? type.join(',') : type;

    // Organization, LocalBusiness, Corporation, Store, etc.
    const isOrgLike = /Organization|Business|Corporation|Store|Restaurant|Hotel|Hospital|School|University|Brand|Person/i.test(typeStr);

    if (isOrgLike) {
        if (!info.name && obj.name)   info.name = String(obj.name).trim();
        if (!info.type && typeStr)    info.type = typeStr;
        if (!info.phone && obj.telephone) info.phone = String(obj.telephone).trim();
        if (!info.email && obj.email)     info.email = String(obj.email).replace(/^mailto:/i, '').trim();
        if (!info.foundedYear && obj.foundingDate) info.foundedYear = String(obj.foundingDate).substring(0, 4);
        if (!info.priceRange && obj.priceRange)    info.priceRange = String(obj.priceRange).trim();

        // Opening hours
        if (!info.openingHours && obj.openingHours) {
            const oh = Array.isArray(obj.openingHours) ? obj.openingHours.join(', ') : String(obj.openingHours);
            info.openingHours = oh;
        }

        // Address from schema
        if (!info.address && obj.address) {
            const addr = obj.address;
            if (typeof addr === 'string') {
                info.address = addr;
            } else if (addr['@type'] === 'PostalAddress') {
                info.address = [
                    addr.streetAddress,
                    addr.addressLocality,
                    addr.addressRegion,
                    addr.postalCode,
                    addr.addressCountry,
                ].filter(Boolean).join(', ');
            }
        }

        // sameAs
        if (obj.sameAs) {
            const sa = Array.isArray(obj.sameAs) ? obj.sameAs : [obj.sameAs];
            sa.forEach(u => { if (typeof u === 'string' && !info.sameAs.includes(u)) info.sameAs.push(u); });
        }

        // Logo from schema
        if (!info.logo && obj.logo) {
            const logoVal = typeof obj.logo === 'string' ? obj.logo : obj.logo?.url || obj.logo?.contentUrl || '';
            if (logoVal) info.logo = resolveUrl(logoVal, baseOrigin) || logoVal;
        }

        // Rating
        if (!info.rating && obj.aggregateRating) {
            info.rating = {
                value: parseFloat(obj.aggregateRating.ratingValue) || null,
                count: parseInt(obj.aggregateRating.reviewCount || obj.aggregateRating.ratingCount) || null,
                bestRating: parseFloat(obj.aggregateRating.bestRating) || 5,
            };
        }
    }

    // Recurse into nested objects
    Object.values(obj).forEach(val => {
        if (val && typeof val === 'object') enrichFromJsonLd(info, val, baseOrigin);
    });
}

// ================================================================
// TITLE → NAME EXTRACTION
// ================================================================
function extractNameFromTitle(title) {
    if (!title) return '';

    // "Company Name | Page Title" or "Page Title - Company Name" or "Page Title — Company"
    const parts = title.split(/\s*[|–—]\s*/).map(p => p.trim()).filter(Boolean);

    if (parts.length > 1) {
        // Take the shortest part (usually the brand name)
        const shortest = parts.reduce((a, b) => a.length <= b.length ? a : b);
        // But not if it's too short (< 3 chars) or looks like a generic word
        if (shortest.length >= 3) return shortest;
    }

    // Fallback: first 3–5 words
    const words = title.split(/\s+/);
    return words.slice(0, Math.min(4, words.length)).join(' ');
}

/** Try to get name from JSON-LD without loading Cheerio again */
function extractNameFromJsonLd($) {
    let name = '';
    $('script[type="application/ld+json"]').each((_, el) => {
        if (name) return false; // stop once found
        try {
            const json = JSON.parse($(el).html() || '{}');
            const found = findFirstName(json);
            if (found) name = found;
        } catch (_) {}
    });
    return name;
}

function findFirstName(obj) {
    if (!obj || typeof obj !== 'object') return '';
    if (Array.isArray(obj)) {
        for (const item of obj) { const n = findFirstName(item); if (n) return n; }
        return '';
    }
    const type = String(obj['@type'] || '');
    if (/Organization|Business|Brand|Person|Corporation/i.test(type) && obj.name) {
        return String(obj.name).trim();
    }
    for (const val of Object.values(obj)) {
        if (val && typeof val === 'object') {
            const n = findFirstName(val);
            if (n) return n;
        }
    }
    return '';
}

// ================================================================
// URL RESOLVER
// ================================================================
function resolveUrl(src, baseOrigin) {
    if (!src) return '';
    src = src.trim();
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    if (src.startsWith('//')) return 'https:' + src;
    if (src.startsWith('/') && baseOrigin) return baseOrigin + src;
    if (baseOrigin) return baseOrigin + '/' + src;
    return src;
}