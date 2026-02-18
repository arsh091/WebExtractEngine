// ================================================================
// socialExtractor.js — ULTRA-POWERFUL Social + WhatsApp v3.0
// ================================================================
import * as cheerio from 'cheerio';
import { socialMediaPatterns, whatsappPatterns } from '../utils/patterns.js';

// Platform → blocklist for invalid URL fragments
const PLATFORM_BLOCKLIST = {
    _all: ['login', 'signup', 'oauth', 'auth', 'dialog', 'widget', 'plugins', 'privacy', 'terms', 'help', 'support', 'developers', 'api.'],
    facebook: ['sharer', 'share', 'intent', '/photo', '/video', '/events/', '/groups/', 'ads', 'advertising', 'business.facebook'],
    instagram: ['/p/', '/explore', '/reels/', '/stories/', '/accounts/', '/direct/'],
    twitter: ['/intent/', '/share', '/search', '/hashtag', '/i/', '/compose'],
    youtube: ['/watch', '/playlist', '/results', 'youtu.be'],
    linkedin: ['/authwall', '/jobs', '/learning'],
    telegram: ['/share', '/proxy', '/socks'],
    _none: [], // platforms with no extra blocks
};

// Platform keywords used for scoring DOM context
const PLATFORM_KEYWORDS = {
    facebook:  ['facebook', 'fb-', 'fb_', 'fb icon', 'fb logo'],
    instagram: ['instagram', 'insta', 'ig-', 'ig_'],
    twitter:   ['twitter', 'x-com', 'x icon', 'tweet'],
    linkedin:  ['linkedin', 'linked-in', 'linked_in'],
    youtube:   ['youtube', 'yt-', 'yt_', 'youtube icon'],
    telegram:  ['telegram', 'tg-', 'tg_'],
    pinterest: ['pinterest', 'pin-'],
    tiktok:    ['tiktok', 'tik-tok'],
    threads:   ['threads'],
    snapchat:  ['snapchat', 'snap-'],
    koo:       ['koo'],
    shareChat: ['sharechat'],
};

// ================================================================
// MAIN EXPORT
// ================================================================
export const extractSocialMedia = (content, html) => {
    console.log('\n📱 ══════════ SOCIAL MEDIA EXTRACTION v3 ══════════');

    const $ = cheerio.load(html);

    const social = {
        facebook:  null,
        instagram: null,
        twitter:   null,
        linkedin:  null,
        youtube:   null,
        telegram:  null,
        pinterest: null,
        tiktok:    null,
        threads:   null,
        snapchat:  null,
        koo:       null,
        shareChat: null,
        whatsapp:  [],
    };

    // ── PASS 1: JSON-LD sameAs (highest confidence) ───────────────
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).html() || '{}');
            const sameAsUrls = collectSameAs(json);
            sameAsUrls.forEach(url => {
                const platform = detectPlatformFromUrl(url);
                if (platform && social[platform] === null) {
                    const clean = normalizeUrl(url);
                    if (clean && isValidSocialLink(clean, platform)) {
                        social[platform] = clean;
                        console.log(`  ✅ ${platform} (JSON-LD sameAs): ${clean}`);
                    }
                }
            });
        } catch (_) {}
    });

    // ── PASS 2: Priority DOM zones ────────────────────────────────
    // Footer > Header > [class*="social"] > [class*="follow"]
    const prioritySelectors = [
        'footer a[href]',
        'header a[href]',
        '[class*="social"] a[href]',
        '[id*="social"] a[href]',
        '[class*="follow"] a[href]',
        '[class*="connect"] a[href]',
        '[class*="network"] a[href]',
        '[aria-label*="social" i] a[href]',
        'nav a[href]',
    ];

    for (const sel of prioritySelectors) {
        $(sel).each((_, el) => scanAnchor($, el, social, true));
    }

    // ── PASS 3: Full-page DOM scan ────────────────────────────────
    $('a[href]').each((_, el) => scanAnchor($, el, social, false));

    // ── PASS 4: Regex on raw HTML/text (JS vars, data attrs) ──────
    const combined = content + '\n' + html;
    for (const [platform, patterns] of Object.entries(socialMediaPatterns)) {
        if (social[platform] !== null) continue;

        for (const pattern of patterns) {
            try {
                const regex = new RegExp(pattern, 'gi');
                let m;
                while ((m = regex.exec(combined)) !== null) {
                    const raw = (m[0] || '').trim().replace(/\/$/, '');
                    const url = normalizeUrl(raw);
                    if (isValidSocialLink(url, platform)) {
                        social[platform] = url;
                        console.log(`  ✅ ${platform} (Regex): ${url}`);
                        break;
                    }
                }
            } catch (_) {}
            if (social[platform] !== null) break;
        }
    }

    // ── PASS 5: WhatsApp dedicated extraction ─────────────────────
    social.whatsapp = extractWhatsApp(combined, $);

    const found = Object.entries(social).filter(([k, v]) => k !== 'whatsapp' ? v !== null : v.length > 0).length;
    console.log(`  📊 Total found: ${found} platforms | ${social.whatsapp.length} WhatsApp`);
    console.log('══════════════════════════════════════════════════\n');

    return social;
};

// ================================================================
// DOM ANCHOR SCANNER
// ================================================================
function scanAnchor($, el, social, isPriorityZone) {
    const $el = $(el);
    const href = ($el.attr('href') || '').trim();

    if (!href || href === '#' || href.startsWith('javascript:') ||
        href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const context = [
        $el.attr('class') || '',
        $el.attr('id') || '',
        $el.attr('aria-label') || '',
        $el.attr('title') || '',
        $el.attr('data-platform') || '',
        $el.attr('rel') || '',
        $el.html() || '',
    ].join(' ').toLowerCase();

    for (const [platform, patterns] of Object.entries(socialMediaPatterns)) {
        // Don't overwrite a confident match unless we're in a priority zone
        if (social[platform] !== null && !isPriorityZone) continue;

        for (const pattern of patterns) {
            try {
                const regex = new RegExp(pattern, 'i');
                const match = href.match(regex);
                if (!match) continue;

                const url = normalizeUrl(match[0].trim().replace(/\/$/, ''));
                if (!isValidSocialLink(url, platform)) continue;

                // Score: does the surrounding context confirm this platform?
                const keywords = PLATFORM_KEYWORDS[platform] || [];
                const hasContext =
                    context.includes('social') ||
                    context.includes('follow') ||
                    keywords.some(k => context.includes(k));

                // Update if: slot empty, or new match has better context
                if (social[platform] === null || (hasContext && isPriorityZone)) {
                    social[platform] = url;
                    console.log(`  ✅ ${platform} (DOM${isPriorityZone ? '/priority' : ''}): ${url}`);
                }
                break;
            } catch (_) {}
        }
    }
}

// ================================================================
// WHATSAPP EXTRACTION
// ================================================================
function extractWhatsApp(content, $) {
    const seen = new Set();
    const results = [];

    // Method 1: Regex on all content
    whatsappPatterns.forEach(pattern => {
        try {
            const regex = new RegExp(pattern, 'gi');
            let m;
            while ((m = regex.exec(content)) !== null) {
                const raw = m[1] || m[0];
                // Extract only digits
                const digits = raw.replace(/[^0-9]/g, '');
                if (digits.length >= 10 && digits.length <= 15 && !seen.has(digits)) {
                    seen.add(digits);
                    results.push({
                        number: '+' + digits,
                        waLink: `https://wa.me/${digits}`,
                        source: 'regex'
                    });
                }
            }
        } catch (_) {}
    });

    // Method 2: DOM — any <a> with wa.me or whatsapp.com
    if ($) {
        $('a[href]').each((_, el) => {
            const href = ($(el).attr('href') || '').toLowerCase();
            if (!href.includes('wa.me') && !href.includes('whatsapp.com')) return;

            const digits = href.replace(/[^0-9]/g, '');
            if (digits.length >= 10 && digits.length <= 15 && !seen.has(digits)) {
                seen.add(digits);
                results.push({
                    number: '+' + digits,
                    waLink: `https://wa.me/${digits}`,
                    source: 'dom'
                });
            }
        });
    }

    // Method 3: data-phone / data-whatsapp attributes
    if ($) {
        $('[data-phone], [data-whatsapp], [data-wa]').each((_, el) => {
            const val = ($(el).attr('data-phone') || $(el).attr('data-whatsapp') || $(el).attr('data-wa') || '');
            const digits = val.replace(/[^0-9]/g, '');
            if (digits.length >= 10 && digits.length <= 15 && !seen.has(digits)) {
                seen.add(digits);
                results.push({
                    number: '+' + digits,
                    waLink: `https://wa.me/${digits}`,
                    source: 'data-attr'
                });
            }
        });
    }

    return results;
}

// ================================================================
// VALIDATION
// ================================================================
function isValidSocialLink(url, platform) {
    if (!url || typeof url !== 'string') return false;

    const lower = url.toLowerCase();

    // Global blocklist
    const globalBlocked = PLATFORM_BLOCKLIST._all || [];
    if (globalBlocked.some(b => lower.includes(b))) return false;

    // Platform-specific blocklist
    const platformBlocked = PLATFORM_BLOCKLIST[platform] || [];
    if (platformBlocked.some(b => lower.includes(b))) return false;

    // Must have a non-root path (e.g. /username not just /)
    try {
        const u = new URL(lower.startsWith('http') ? lower : 'https:' + lower);
        const path = u.pathname.replace(/\/$/, '');
        if (!path || path === '') return false;
    } catch (_) {
        return false;
    }

    return true;
}

// ================================================================
// URL UTILITIES
// ================================================================
function normalizeUrl(url) {
    if (!url) return '';
    url = url.trim();
    // Remove trailing punctuation that leaked in
    url = url.replace(/['"<>)\],;]+$/, '');
    if (url.startsWith('//')) return 'https:' + url;
    if (!url.startsWith('http')) return 'https://' + url;
    return url;
}

// ================================================================
// JSON-LD HELPERS
// ================================================================
function collectSameAs(obj) {
    const urls = [];
    if (!obj || typeof obj !== 'object') return urls;

    if (obj.sameAs) {
        const sa = Array.isArray(obj.sameAs) ? obj.sameAs : [obj.sameAs];
        sa.forEach(v => { if (typeof v === 'string') urls.push(v); });
    }

    // Recurse into nested objects
    for (const val of Object.values(obj)) {
        if (Array.isArray(val)) {
            val.forEach(v => urls.push(...collectSameAs(v)));
        } else if (val && typeof val === 'object') {
            urls.push(...collectSameAs(val));
        }
    }
    return urls;
}

function detectPlatformFromUrl(url) {
    const lower = (url || '').toLowerCase();
    if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'facebook';
    if (lower.includes('instagram.com'))  return 'instagram';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
    if (lower.includes('linkedin.com'))   return 'linkedin';
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('t.me') || lower.includes('telegram.')) return 'telegram';
    if (lower.includes('pinterest.com'))  return 'pinterest';
    if (lower.includes('tiktok.com'))     return 'tiktok';
    if (lower.includes('threads.net'))    return 'threads';
    if (lower.includes('snapchat.com'))   return 'snapchat';
    if (lower.includes('kooapp.com'))     return 'koo';
    if (lower.includes('sharechat.com'))  return 'shareChat';
    return null;
}