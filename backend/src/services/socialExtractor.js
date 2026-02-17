import { socialMediaPatterns, whatsappPatterns } from '../utils/patterns.js';

export const extractSocialMedia = (content, html) => {
    console.log('\n📱 ========== SOCIAL MEDIA EXTRACTION ==========');

    const social = {
        facebook: null,
        instagram: null,
        twitter: null,
        linkedin: null,
        youtube: null,
        telegram: null,
        pinterest: null,
        tiktok: null,
        whatsapp: []
    };

    // Extract each platform
    Object.keys(socialMediaPatterns).forEach(platform => {
        const patterns = socialMediaPatterns[platform];

        for (const pattern of patterns) {
            const regex = new RegExp(pattern, 'gi');
            const matches = content.match(regex);

            if (matches && matches.length > 0) {
                // Take first valid match, clean it
                const match = matches[0].trim().replace(/\/$/, ''); // Remove trailing slash
                if (!social[platform] && isValidSocialLink(match, platform)) {
                    social[platform] = match;
                    console.log(`  ✅ ${platform}: ${match}`);
                    break;
                }
            }
        }
    });

    // Extract WhatsApp separately (can have multiple)
    const whatsappNumbers = extractWhatsApp(content);
    social.whatsapp = whatsappNumbers;

    console.log(`✅ Social platforms found: ${Object.values(social).filter(v => v && v !== null && (!Array.isArray(v) || v.length > 0)).length}`);
    console.log(`✅ WhatsApp numbers: ${social.whatsapp.length}`);
    console.log('================================================\n');

    return social;
};

function extractWhatsApp(content) {
    const numbers = new Set();

    whatsappPatterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        let match;

        while ((match = regex.exec(content)) !== null) {
            // Extract phone number from wa.me URL or text
            const number = match[1] || match[0];
            const cleaned = number.replace(/[^0-9+]/g, '');

            if (cleaned.length >= 10) {
                // Format as wa.me link
                const phone = cleaned.replace('+', '');
                numbers.add({
                    number: '+' + phone,
                    waLink: `https://wa.me/${phone}`
                });
            }
        }
    });

    return Array.from(numbers);
}

function isValidSocialLink(url, platform) {
    // Filter out false positives
    const invalidPatterns = [
        'share', 'sharer', 'intent', 'dialog',
        'login', 'signup', 'oauth', 'auth'
    ];

    return !invalidPatterns.some(pattern =>
        url.toLowerCase().includes(pattern)
    );
}
