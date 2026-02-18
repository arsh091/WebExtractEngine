// ================================================================
// extractor.js — ULTRA-POWERFUL Data Extractor v3.0
// ================================================================
import {
    phonePatterns,
    emailPatterns,
    emailPattern,
    addressPatterns,
} from '../utils/patterns.js';

// ════════════════════════════════════════════════════════════════
// 📞 PHONE EXTRACTION
// ════════════════════════════════════════════════════════════════
export const extractPhones = (text) => {
    if (!text) return [];
    const raw = new Set();

    // ── Pass 1: Regex patterns ──────────────────────────────────
    phonePatterns.forEach((pattern) => {
        try {
            const regex = new RegExp(pattern, 'gi');
            let m;
            while ((m = regex.exec(text)) !== null) {
                const val = (m[1] ?? m[0]).trim();
                if (val) raw.add(val);
            }
        } catch (_) { }
    });

    // ── Pass 2: tel: href attributes ────────────────────────────
    const telRe = /href=["']tel:([^"'\s]+)["']/gi;
    let m;
    while ((m = telRe.exec(text)) !== null) {
        const num = m[1].replace(/[()]/g, '').trim();
        if (num) raw.add(num);
    }

    // ── Pass 3: JSON-LD telephone field ─────────────────────────
    const jsonLdRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    while ((m = jsonLdRe.exec(text)) !== null) {
        try {
            const obj = JSON.parse(m[1]);
            findJsonValues(obj, 'telephone').forEach(v => raw.add(v));
            findJsonValues(obj, 'phone').forEach(v => raw.add(v));
        } catch (_) { }
    }

    return cleanPhoneNumbers([...raw]);
};

// ════════════════════════════════════════════════════════════════
// 📧 EMAIL EXTRACTION
// ════════════════════════════════════════════════════════════════
export const extractEmails = (text) => {
    if (!text) return [];
    const raw = new Set();

    // ── Pre-decode common obfuscation ───────────────────────────
    const decoded = text
        .replace(/&#64;/g, '@').replace(/&#46;/g, '.')
        .replace(/&amp;/g, '&').replace(/&at;/gi, '@')
        .replace(/\[dot\]/gi, '.').replace(/\(dot\)/gi, '.')
        .replace(/\s*\[at\]\s*/gi, '@').replace(/\s*\(at\)\s*/gi, '@')
        .replace(/\s*\{at\}\s*/gi, '@').replace(/\s+at\s+/gi, '@');

    // ── Pass 1: All email patterns ──────────────────────────────
    emailPatterns.forEach((pattern) => {
        try {
            const regex = new RegExp(pattern, 'gi');
            let m;
            while ((m = regex.exec(decoded)) !== null) {
                const candidate = (m[1] ?? m[0]).trim();
                // Extract pure email from possible label prefix
                const found = candidate.match(/[a-zA-Z0-9][a-zA-Z0-9._%+\-]{0,63}@[a-zA-Z0-9][a-zA-Z0-9.\-]{0,62}\.[a-zA-Z]{2,10}/);
                if (found) raw.add(found[0].toLowerCase());
            }
        } catch (_) { }
    });

    // ── Pass 2: mailto: hrefs ───────────────────────────────────
    const mailtoRe = /href=["']mailto:([^"'?\s]+)/gi;
    let m;
    while ((m = mailtoRe.exec(text)) !== null) {
        raw.add(m[1].toLowerCase().trim());
    }

    // ── Pass 3: data-email / data-mail attributes ────────────────
    const dataRe = /data-(?:email|mail)=["']([^"']+)["']/gi;
    while ((m = dataRe.exec(text)) !== null) {
        const v = m[1].toLowerCase().trim();
        if (v.includes('@')) raw.add(v);
    }

    // ── Pass 4: CF email decode (Cloudflare) ────────────────────
    // Cloudflare encodes emails as data-cfemail="xxx"
    const cfRe = /data-cfemail=["']([0-9a-f]+)["']/gi;
    while ((m = cfRe.exec(text)) !== null) {
        const decoded2 = decodeCfEmail(m[1]);
        if (decoded2 && decoded2.includes('@')) raw.add(decoded2);
    }

    // ── Pass 5: JSON-LD email field ─────────────────────────────
    const jsonLdRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    while ((m = jsonLdRe.exec(text)) !== null) {
        try {
            const obj = JSON.parse(m[1]);
            findJsonValues(obj, 'email').forEach(v => {
                const clean = v.replace(/^mailto:/i, '').toLowerCase().trim();
                if (clean.includes('@')) raw.add(clean);
            });
        } catch (_) { }
    }

    return cleanEmails([...raw]);
};

// ════════════════════════════════════════════════════════════════
// 📍 ADDRESS EXTRACTION
// ════════════════════════════════════════════════════════════════
export const extractAddresses = (text) => {
    if (!text) return [];
    const raw = new Set();

    // ── Pass 1: Regex patterns ──────────────────────────────────
    addressPatterns.forEach((pattern) => {
        try {
            const regex = new RegExp(pattern, 'gi');
            let m;
            while ((m = regex.exec(text)) !== null) {
                const val = m[0].trim();
                if (val.length >= 20) raw.add(val);
            }
        } catch (_) { }
    });

    // ── Pass 2: HTML <address> tags ─────────────────────────────
    const addrTagRe = /<address[^>]*>([\s\S]*?)<\/address>/gi;
    let m;
    while ((m = addrTagRe.exec(text)) !== null) {
        const clean = stripHtml(m[1]);
        if (clean.length >= 20) raw.add(clean);
    }

    // ── Pass 3: itemprop / schema.org microdata ──────────────────
    // Collect individual parts then combine
    const parts = {
        street: '',
        locality: '',
        region: '',
        postal: '',
        country: '',
    };
    const ipMap = {
        streetAddress: 'street',
        addressLocality: 'locality',
        addressRegion: 'region',
        postalCode: 'postal',
        addressCountry: 'country',
    };
    Object.entries(ipMap).forEach(([prop, key]) => {
        const re = new RegExp(`itemprop=["']${prop}["'][^>]*>([^<]+)<`, 'gi');
        let im;
        while ((im = re.exec(text)) !== null) {
            if (!parts[key]) parts[key] = im[1].trim();
        }
        // Also check content attribute: <meta itemprop="postalCode" content="110001">
        const re2 = new RegExp(`itemprop=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'gi');
        while ((im = re2.exec(text)) !== null) {
            if (!parts[key]) parts[key] = im[1].trim();
        }
    });
    const combined = [parts.street, parts.locality, parts.region, parts.postal, parts.country]
        .filter(Boolean).join(', ');
    if (combined.length >= 20) raw.add(combined);

    // ── Pass 4: JSON-LD PostalAddress ───────────────────────────
    const jsonLdRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    while ((m = jsonLdRe.exec(text)) !== null) {
        try {
            const obj = JSON.parse(m[1]);
            extractJsonLdAddresses(obj).forEach(a => raw.add(a));
        } catch (_) { }
    }

    // ── Pass 5: Footer block scanning ───────────────────────────
    // Grab text between <footer> tags and scan line-groups
    const footerRe = /<footer[^>]*>([\s\S]*?)<\/footer>/gi;
    while ((m = footerRe.exec(text)) !== null) {
        const footerText = stripHtml(m[1]);
        const lines = footerText.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 8);
        for (let i = 0; i < lines.length - 1; i++) {
            const combo2 = lines[i] + ', ' + lines[i + 1];
            const combo3 = i + 2 < lines.length
                ? combo2 + ', ' + lines[i + 2]
                : combo2;
            if (looksLikeAddress(combo3) && combo3.length <= 280) raw.add(combo3);
            else if (looksLikeAddress(combo2) && combo2.length <= 280) raw.add(combo2);
        }
    }

    // ── Pass 6: contact/about section scanning ───────────────────
    const contactSecRe = /<(?:div|section|article)[^>]*(?:id|class)=["'][^"']*(?:contact|address|location|office|reach)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section|article)>/gi;
    while ((m = contactSecRe.exec(text)) !== null) {
        const secText = stripHtml(m[1]);
        const lines = secText.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 8);
        for (let i = 0; i < lines.length - 1; i++) {
            const combo = lines.slice(i, i + 3).join(', ');
            if (looksLikeAddress(combo) && combo.length <= 280) raw.add(combo);
        }
    }

    return cleanAddresses([...raw]);
};

// ════════════════════════════════════════════════════════════════
// 🔧 UTILITIES
// ════════════════════════════════════════════════════════════════

/** Recursively find all values for a key inside a JSON object */
function findJsonValues(obj, key) {
    const results = [];
    if (!obj || typeof obj !== 'object') return results;
    if (Array.isArray(obj)) {
        obj.forEach(item => results.push(...findJsonValues(item, key)));
    } else {
        Object.entries(obj).forEach(([k, v]) => {
            if (k.toLowerCase() === key.toLowerCase() && typeof v === 'string') {
                results.push(v);
            } else {
                results.push(...findJsonValues(v, key));
            }
        });
    }
    return results;
}

/** Decode Cloudflare-encoded email */
function decodeCfEmail(encoded) {
    try {
        const r = parseInt(encoded.substr(0, 2), 16);
        let email = '';
        for (let n = 2; n < encoded.length; n += 2) {
            email += String.fromCharCode(parseInt(encoded.substr(n, 2), 16) ^ r);
        }
        return email;
    } catch (_) {
        return '';
    }
}

/** Extract addresses from JSON-LD (PostalAddress, sameAs etc.) */
function extractJsonLdAddresses(obj) {
    const results = [];
    if (!obj || typeof obj !== 'object') return results;

    if (obj['@type'] === 'PostalAddress') {
        const parts = [
            obj.streetAddress,
            obj.addressLocality,
            obj.addressRegion,
            obj.postalCode,
            obj.addressCountry,
        ].filter(Boolean);
        if (parts.length >= 2) results.push(parts.join(', '));
    }

    // Recurse
    Object.values(obj).forEach(val => {
        if (Array.isArray(val)) val.forEach(v => results.push(...extractJsonLdAddresses(v)));
        else if (val && typeof val === 'object') results.push(...extractJsonLdAddresses(val));
    });

    return results;
}

/** Strip HTML tags and normalise whitespace */
function stripHtml(html) {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(?:p|div|li|td|tr|h[1-6]|section|article)>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Heuristic: does this text look like a physical address? */
function looksLikeAddress(text) {
    const hasPin = /\b\d{6}\b/.test(text);
    const hasZip = /\b\d{5}(?:-\d{4})?\b/.test(text);
    const hasUkPc = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/.test(text);
    const hasStreet = /(?:street|road|lane|avenue|nagar|colony|sector|building|tower|marg|block|phase|flat|plot|house|floor|wing|floor|drive|blvd|pkwy)/i.test(text);
    const hasCity = /(?:mumbai|delhi|bangalore|bengaluru|chennai|kolkata|hyderabad|pune|ahmedabad|surat|jaipur|lucknow|gurgaon|gurugram|noida|new york|london|dubai|singapore|toronto|los angeles)/i.test(text);
    return (hasPin || hasZip || hasUkPc) && (hasStreet || hasCity || text.split(',').length >= 3);
}

// ════════════════════════════════════════════════════════════════
// 🧹 CLEANERS
// ════════════════════════════════════════════════════════════════

const cleanPhoneNumbers = (phones) => {
    const seen = new Set();
    return phones
        .map(p => p.trim().replace(/^tel:/i, ''))
        .map(p => p.replace(/[.\-]/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(p => {
            const digits = p.replace(/\D/g, '');
            return digits.length >= 7 && digits.length <= 16;
        })
        .filter(p => {
            // Reject obvious garbage: all same digit
            const digits = p.replace(/\D/g, '');
            return !/^(\d)\1+$/.test(digits);
        })
        .filter(p => {
            // Dedup on digit-only key
            const key = p.replace(/\D/g, '');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
};

const INVALID_EMAIL_DOMAINS = new Set([
    'example.com', 'test.com', 'domain.com', 'email.com',
    'yourdomain.com', 'yourcompany.com', 'placeholder.com',
    'sample.com', 'company.com', 'website.com',
    'sentry.io', 'wixpress.com', 'squarespace.com',
    'cloudflare.com', 'amazonaws.com', 'googletagmanager.com',
    'schema.org',
]);

const cleanEmails = (emails) => {
    const seen = new Set();
    return emails
        .map(e => e.toLowerCase().trim())
        .map(e => e
            .replace(/&#64;/g, '@').replace(/&#46;/g, '.')
            .replace(/\(dot\)/gi, '.').replace(/\[dot\]/gi, '.')
            .replace(/\(at\)/gi, '@').replace(/\[at\]/gi, '@')
        )
        .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e))
        .filter(e => !/\.{2,}/.test(e))              // no consecutive dots
        .filter(e => !e.startsWith('.') && !e.startsWith('@'))
        .filter(e => {
            const domain = e.split('@')[1] ?? '';
            return ![...INVALID_EMAIL_DOMAINS].some(bad => domain === bad || domain.endsWith('.' + bad));
        })
        .filter(e => {
            if (seen.has(e)) return false;
            seen.add(e);
            return true;
        });
};

const cleanAddresses = (addresses) => {
    const seen = new Set();
    return addresses
        .map(a => a
            .replace(/\s+/g, ' ')
            .replace(/,\s*,+/g, ',')
            .replace(/^[,\s\-]+|[,\s\-]+$/g, '')
            // Strip common labels
            .replace(/^(?:Address|Location|Locality|Registered\s+Office|Corporate\s+Office|Head\s+Office|Regd\.?\s+Office|Branch\s+Office|Office\s+Address|Our\s+Address|Find\s+Us|Visit\s+Us)\s*:?\s*/i, '')
            .trim()
        )
        .filter(a => a.length >= 20 && a.length <= 350)
        .filter(a => /\d/.test(a))                          // must have a digit
        .filter(a => (a.match(/[a-zA-Z]/g) ?? []).length >= 10) // must have letters
        .filter(a => {
            // Reject if >45% digits (probably a phone number got in)
            const digits = (a.match(/\d/g) ?? []).length;
            return digits / a.length < 0.45;
        })
        .filter(a => {
            // Dedup: normalise for comparison
            const key = a.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
};
