import * as cheerio from 'cheerio';

export const extractCompanyInfo = (html, url) => {
    console.log('\n🏢 ========== COMPANY INFO EXTRACTION ==========');
    const $ = cheerio.load(html);

    const info = {
        title: '',
        name: '',
        description: '',
        logo: '',
        favicon: '',
        language: '',
        themeColor: '',
        keywords: '',
        ogImage: ''
    };

    // === TITLE ===
    info.title = $('title').first().text().trim() ||
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') || '';

    // === COMPANY NAME ===
    // Try multiple sources
    info.name =
        $('meta[property="og:site_name"]').attr('content') ||
        $('[class*="logo"] img').attr('alt') ||
        $('[id*="logo"] img').attr('alt') ||
        $('header .logo, header [class*="brand"], header [class*="company"]').first().text().trim() ||
        extractNameFromTitle(info.title) || '';

    // === DESCRIPTION ===
    info.description =
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content') || '';

    // === LOGO ===
    const logoSrc =
        $('header img[class*="logo"], [class*="logo"] img, [id*="logo"] img').first().attr('src') ||
        $('meta[property="og:image"]').attr('content') ||
        '';

    if (logoSrc) {
        // Make absolute URL
        if (logoSrc.startsWith('http')) {
            info.logo = logoSrc;
        } else if (logoSrc.startsWith('//')) {
            info.logo = 'https:' + logoSrc;
        } else {
            const baseUrl = new URL(url);
            info.logo = baseUrl.origin + (logoSrc.startsWith('/') ? '' : '/') + logoSrc;
        }
    }

    // === FAVICON ===
    const faviconHref =
        $('link[rel="icon"]').attr('href') ||
        $('link[rel="shortcut icon"]').attr('href') ||
        $('link[rel="apple-touch-icon"]').attr('href') ||
        '/favicon.ico';

    if (faviconHref) {
        const baseUrl = new URL(url);
        info.favicon = faviconHref.startsWith('http')
            ? faviconHref
            : baseUrl.origin + (faviconHref.startsWith('/') ? '' : '/') + faviconHref;
    }

    // === LANGUAGE ===
    info.language = $('html').attr('lang') || '';

    // === THEME COLOR ===
    info.themeColor = $('meta[name="theme-color"]').attr('content') || '';

    // === KEYWORDS ===
    info.keywords = $('meta[name="keywords"]').attr('content') || '';

    // === OG IMAGE ===
    info.ogImage = $('meta[property="og:image"]').attr('content') || '';

    console.log('✅ Company Name:', info.name);
    console.log('✅ Title:', info.title);
    console.log('✅ Has Logo:', !!info.logo);
    console.log('===============================================\n');

    return info;
};

function extractNameFromTitle(title) {
    if (!title) return '';
    // Common patterns: "Company Name | Page Title" or "Page Title - Company Name"
    const parts = title.split(/[|\-–—]/);
    if (parts.length > 1) {
        // Usually company name is shorter part
        return parts.reduce((a, b) => a.trim().length < b.trim().length ? a : b).trim();
    }
    return title.split(' ').slice(0, 3).join(' '); // First 3 words
}
