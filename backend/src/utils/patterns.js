// ================================================================
// patterns.js — ULTRA-POWERFUL Extraction Patterns v3.0
// ================================================================

// ════════════════════════════════════════════════════════════════
// 📞 PHONE PATTERNS
// Covers: Indian mobile/landline/toll-free, International,
//         US/Canada, UK, UAE, obfuscated, tel: href
// ════════════════════════════════════════════════════════════════
export const phonePatterns = [

    // ── INDIAN MOBILE ──────────────────────────────────────────
    // +91 98765 43210 | +91-9876543210 | 09876543210
    '(?:(?:\\+|00)91[\\s\\-\\.]?)?(?:0)?[6-9]\\d{4}[\\s\\-\\.]?\\d{5}',

    // Spaced formats: 98765 43210 | 9876 543 210
    '[6-9]\\d{4}\\s\\d{5}',
    '[6-9]\\d{3}\\s\\d{3}\\s\\d{3}',

    // ── INDIAN LANDLINE ─────────────────────────────────────────
    // 011-23456789 | (0141) 2345678 | 04422345678
    '0\\d{2,4}[\\s\\-]\\d{6,8}',
    '\\(0\\d{2,4}\\)\\s*\\d{6,8}',

    // ── INDIAN TOLL-FREE ────────────────────────────────────────
    // 1800-123-4567 | 1800 103 1234 | 18001031234
    '1800[\\s\\-]?\\d{3,4}[\\s\\-]?\\d{3,4}',
    '1\\-800\\-\\d{3}\\-\\d{4}',

    // ── INTERNATIONAL (country code prefix) ─────────────────────
    // +44 20 7946 0958 | +1-555-123-4567 | +971 4 123 4567
    '\\+[1-9]\\d{0,3}[\\s\\-\\.]?(?:\\(?\\d{1,4}\\)?[\\s\\-\\.]?){2,5}\\d{2,9}',

    // ── USA / CANADA ────────────────────────────────────────────
    // (555) 123-4567 | 555-123-4567 | 555.123.4567
    '\\(?[2-9]\\d{2}\\)?[\\s\\.\\-]\\d{3}[\\s\\.\\-]\\d{4}',

    // ── UK ──────────────────────────────────────────────────────
    // 020 7946 0958 | 07911 123456
    '0[1-9]\\d{1,4}[\\s\\-]\\d{3,4}[\\s\\-]?\\d{3,4}',

    // ── UAE ─────────────────────────────────────────────────────
    // +971 4 123 4567 | 04-1234567
    '(?:\\+971|0)(?:[\\s\\-]?[0-9]){7,9}',

    // ── tel: HREF ───────────────────────────────────────────────
    // href="tel:+919876543210"
    'tel:[+\\d\\s\\-\\.()]{7,20}',

    // ── NUMBER IN BRACKETS COUNTRY CODE ─────────────────────────
    // (+91) 98765-43210
    '\\(\\+\\d{1,3}\\)\\s*[\\d\\s\\-\\.]{8,15}',

    // ── PLAIN 10-DIGIT (last resort) ───────────────────────────
    '\\b[6-9]\\d{9}\\b',
];

// ════════════════════════════════════════════════════════════════
// 📧 EMAIL PATTERNS
// Covers: standard, obfuscated ([at], (dot), HTML entities),
//         labelled emails, mailto: href, data-email attribute
// ════════════════════════════════════════════════════════════════

// Primary fast pattern
export const emailPattern =
    '[a-zA-Z0-9][a-zA-Z0-9._%+\\-]{0,63}@[a-zA-Z0-9][a-zA-Z0-9\\-]{0,62}\\.[a-zA-Z]{2,10}';

// Full pattern array for deep extraction
export const emailPatterns = [

    // Standard email
    '[a-zA-Z0-9][a-zA-Z0-9._%+\\-]{0,63}@(?:[a-zA-Z0-9\\-]{1,63}\\.)+[a-zA-Z]{2,10}',

    // Obfuscated with [at] / (at) / {at}
    '[a-zA-Z0-9._%+\\-]{2,64}\\s*[\\[\\(\\{]\\s*at\\s*[\\]\\)\\}]\\s*[a-zA-Z0-9.\\-]{2,64}\\s*(?:[\\[\\(\\{]\\s*dot\\s*[\\]\\)\\}]\\s*[a-zA-Z]{2,10})',

    // Spaced: name at domain dot com
    '[a-zA-Z0-9._%+\\-]{2,64}\\s+at\\s+[a-zA-Z0-9.\\-]{2,64}\\s+dot\\s+[a-zA-Z]{2,10}',

    // HTML entity: user&#64;domain.com
    '[a-zA-Z0-9._%+\\-]+&#64;[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,10}',

    // Labelled: "Email: user@domain.com" or "Contact: ..."
    '(?:e[\\-\\s]?mail|contact|mail|write(?:\\s+to)?|reach(?:\\s+(?:us|me))?(?:\\s+at)?|send\\s+mail\\s+to)\\s*:?\\s*([a-zA-Z0-9][a-zA-Z0-9._%+\\-]{0,63}@[a-zA-Z0-9][a-zA-Z0-9\\-]{0,62}\\.[a-zA-Z]{2,10})',

    // mailto: href
    'mailto:([a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,10})',
];

// ════════════════════════════════════════════════════════════════
// 📍 ADDRESS PATTERNS
// Covers: Indian (full, PIN, landmark, state),
//         US (street + ZIP), UK (postcode),
//         Schema.org itemprop, generic fallback
// ════════════════════════════════════════════════════════════════
export const addressPatterns = [

    // ── INDIAN: Plot/Flat/House/Door + full address + PIN ────────
    // "Plot 45, Sector 14, Gurgaon, Haryana - 122001"
    '(?:Plot|House|Flat|Unit|Door|H\\.?No?\\.?|Shop|Khasra|Survey|Gali|Mohalla)\\s*[#\\-\\/]?\\s*[A-Za-z0-9\\/\\-]{1,15}[,\\s]+[^\\n<]{20,120}\\d{6}',

    // ── INDIAN: Building/Tower/Complex + PIN ─────────────────────
    // "Silicon Tower, MG Road, Bangalore - 560001"
    '(?:Tower|Building|Bldg|Chambers|House|Arcade|Complex|Center|Centre|Mall|Plaza|Park|Hub|Point|Residency|Heights|Annexe)\\b[^\\n<]{10,80}\\d{6}',

    // ── INDIAN: Street/Road/Nagar/Colony/Marg + PIN ──────────────
    // "12, MG Road, Connaught Place, New Delhi - 110001"
    '[A-Z0-9][^\\n<]{10,70}(?:Road|Rd\\.?|Street|St\\.?|Marg|Avenue|Ave\\.?|Lane|Ln\\.?|Nagar|Colony|Vihar|Enclave|Extension|Sector|Block|Phase|Cross|Main|Layout|Garden|Ring\\s*Road)[^\\n<]{5,60}\\d{6}',

    // ── INDIAN: Near/Opposite/Behind landmark + PIN ──────────────
    '(?:Near|Opp(?:osite)?|Behind|Beside|Adj(?:acent)?\\s*to|Next\\s*to)[^\\n<]{10,100}\\d{6}',

    // ── INDIAN: State name + PIN (broadest Indian catch) ─────────
    '[A-Za-z0-9\\s,.\\/\\-]{15,100}(?:Maharashtra|Gujarat|Rajasthan|Karnataka|Tamil\\s*Nadu|Uttar\\s*Pradesh|Madhya\\s*Pradesh|West\\s*Bengal|Andhra\\s*Pradesh|Telangana|Kerala|Punjab|Haryana|Bihar|Odisha|Assam|Jharkhand|Uttarakhand|Himachal\\s*Pradesh|Chhattisgarh|Goa|Delhi|NCR|Chandigarh|Jammu|Ladakh)[^\\n<]{0,40}\\d{6}',

    // ── INDIAN: City name + PIN ──────────────────────────────────
    '(?:Mumbai|Delhi|Bangalore|Bengaluru|Chennai|Kolkata|Hyderabad|Pune|Ahmedabad|Surat|Jaipur|Lucknow|Nagpur|Indore|Bhopal|Kochi|Gurgaon|Gurugram|Noida|Faridabad|Chandigarh|Agra|Vadodara|Patna|Ranchi|Coimbatore|Visakhapatnam|Thane|Nashik|Aurangabad)[^\\n<]{0,50}\\d{6}',

    // ── USA: Street Number + Street Type + City + State + ZIP ────
    // "123 Main Street, Springfield, IL 62701"
    '\\d{1,6}\\s+[A-Za-z0-9\\s\\.]{5,50}(?:Street|St\\.?|Avenue|Ave\\.?|Road|Rd\\.?|Lane|Ln\\.?|Drive|Dr\\.?|Boulevard|Blvd\\.?|Way|Court|Ct\\.?|Circle|Cir\\.?|Place|Pl\\.?|Highway|Hwy\\.?|Parkway|Pkwy\\.?|Trail|Trl\\.?|Terrace|Ter\\.?)[,\\s]+[A-Za-z\\s]{2,30}[,\\s]+[A-Z]{2}[\\s,]+\\d{5}(?:\\-\\d{4})?',

    // ── UK: Street name + Postcode ───────────────────────────────
    // "10 Downing Street, London, SW1A 2AA"
    '[A-Za-z0-9\\s,\\.]{10,60}(?:Street|Road|Lane|Avenue|Drive|Close|Way|Place|Gardens?|Crescent|Terrace|Court|Square)[,\\s]+[A-Za-z\\s]{3,30}[,\\s]+[A-Z]{1,2}\\d{1,2}[A-Z]?\\s?\\d[A-Z]{2}',

    // ── GENERIC: Any 6-digit PIN with surrounding context ────────
    '[A-Za-z][A-Za-z0-9\\s,.\\/\\-]{20,150}\\b\\d{6}\\b',

    // ── GENERIC: Any 5-digit ZIP with surrounding context ────────
    '[A-Za-z][A-Za-z0-9\\s,.\\/\\-]{15,100},\\s*[A-Z]{2}\\s+\\d{5}(?:\\-\\d{4})?',
];

// ════════════════════════════════════════════════════════════════
// 📱 SOCIAL MEDIA PATTERNS
// Each platform: primary URL + protocol-relative + common variants
// False-positive filters handled separately in extractor
// ════════════════════════════════════════════════════════════════
export const socialMediaPatterns = {
    facebook: [
        // Pages, groups, profiles — excludes /sharer, /dialog, /login etc.
        '(?:https?:)?//(?:www\\.)?(?:facebook\\.com|fb\\.com|fb\\.me)/(?!(?:sharer|share|dialog|login|signup|oauth|ads|watch|events/\\d|photo|video|pages/create|gaming|groups/[^/]+/(?:about|members|photos|videos))[/?#]?)([a-zA-Z0-9][a-zA-Z0-9./_\\-]{1,100})',
    ],
    instagram: [
        // Main profiles only (not /p/ posts or /explore)
        '(?:https?:)?//(?:www\\.)?(?:instagram\\.com|instagr\\.am)/(?!(?:p|explore|reels|stories|accounts|_u|tv|reel|ar|direct|a)[/?#])([a-zA-Z0-9._][a-zA-Z0-9._]{1,29})/?',
    ],
    twitter: [
        // twitter.com and x.com — profile pages
        '(?:https?:)?//(?:www\\.)?(?:twitter\\.com|x\\.com)/(?!(?:intent|share|search|hashtag|i|compose|home|notifications|messages|settings|explore)[/?#])([a-zA-Z0-9_]{1,50})(?:[/?#].*)?',
    ],
    linkedin: [
        // Company, person, school, showcase
        '(?:https?:)?//(?:www\\.)?linkedin\\.com/(?:company|in|school|showcase|pub)/([a-zA-Z0-9_\\-\\.]{3,100})/?',
    ],
    youtube: [
        // Channel, handle, user, custom URL
        '(?:https?:)?//(?:www\\.)?youtube\\.com/(?:channel/[UC][a-zA-Z0-9_\\-]{20,25}|c/[a-zA-Z0-9_\\-]+|user/[a-zA-Z0-9_\\-]+|@[a-zA-Z0-9_\\.\\-]+)',
        // YouTube short links (video — kept for completeness but filtered later)
        '(?:https?:)?//youtu\\.be/[a-zA-Z0-9_\\-]{11}',
    ],
    telegram: [
        // Main channel/group links
        '(?:https?:)?//(?:www\\.)?(?:t\\.me|telegram\\.me|telegram\\.dog)/(?!share|joinchat|proxy|socks|addtheme|addstickers)[a-zA-Z0-9_]{5,32}',
        // Group invite links
        '(?:https?:)?//t\\.me/\\+([a-zA-Z0-9_\\-]+)',
        '(?:https?:)?//t\\.me/joinchat/([a-zA-Z0-9_\\-]+)',
    ],
    pinterest: [
        '(?:https?:)?//(?:www\\.)?(?:pinterest\\.com|pin\\.it)/(?!pin|search|explore|today|ideas)[a-zA-Z0-9_\\-]+/?',
    ],
    tiktok: [
        '(?:https?:)?//(?:www\\.)?tiktok\\.com/@([a-zA-Z0-9._\\-]+)',
    ],
    threads: [
        '(?:https?:)?//(?:www\\.)?threads\\.net/@([a-zA-Z0-9._\\-]+)',
    ],
    snapchat: [
        '(?:https?:)?//(?:www\\.)?snapchat\\.com/add/([a-zA-Z0-9._\\-]+)',
    ],
    koo: [
        // Indian platform
        '(?:https?:)?//(?:www\\.)?kooapp\\.com/profile/([a-zA-Z0-9._\\-]+)',
    ],
    shareChat: [
        // Indian platform
        '(?:https?:)?//(?:www\\.)?sharechat\\.com/(?:profile|channel)/([a-zA-Z0-9._\\-]+)',
    ],
};

// ════════════════════════════════════════════════════════════════
// 💬 WHATSAPP PATTERNS
// Covers: wa.me, api.whatsapp.com, wa.link, text mentions
// ════════════════════════════════════════════════════════════════
export const whatsappPatterns = [

    // wa.me/91XXXXXXXXXX (most common)
    'https?://wa\\.me/(\\+?[0-9]{10,15})(?:\\?[^\\s"\'<>]*)?',

    // api.whatsapp.com/send?phone=91XXXXXXXXXX
    'https?://api\\.whatsapp\\.com/send/?\\?phone=([0-9+]{10,15})(?:&[^\\s"\'<>]*)?',

    // wa.link/xxxxx (short link — no number extraction but capture URL)
    'https?://wa\\.link/([a-zA-Z0-9]+)',

    // WhatsApp click-to-chat with message
    'https?://wa\\.me/(\\d{10,15})\\?text=[^\\s"\'<>]*',

    // "WhatsApp: +91 98765 43210" in plain text
    '(?:whatsapp|whats\\s*app|wa(?:\\s*no|\\s*number|\\.?\\s*:))\\s*[:\\-]?\\s*([+\\d][\\d\\s\\-\\.]{9,18})',

    // Number right after a WhatsApp icon SVG/image in HTML
    '(?:wa|whatsapp)["\'][^>]{0,100}>[^<]*([+\\d][\\d\\s\\-]{9,14})',
];