// ================================================================
// ipIntelligence.js — IP Tracking & Risk Analysis
// ================================================================
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export const analyzeIP = (req) => {
    console.log('\n🌐 ══════════ IP INTELLIGENCE ══════════');

    // Get IP address (handle proxies/load balancers)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip;

    const cleanIP = ip.replace('::ffff:', '').replace('::1', '127.0.0.1');

    // Geolocate IP
    const geo = geoip.lookup(cleanIP);

    // Parse User-Agent
    const parser = new UAParser(req.headers['user-agent']);
    const ua = parser.getResult();

    // Detect VPN/Proxy
    const isVPN = detectVPN(cleanIP, req.headers);

    // Calculate risk score
    const riskScore = calculateRiskScore(cleanIP, geo, ua, isVPN);

    const result = {
        ip: cleanIP,
        location: geo ? {
            country: geo.country,
            countryName: getCountryName(geo.country),
            region: geo.region,
            city: geo.city,
            timezone: geo.timezone,
            coordinates: {
                latitude: geo.ll[0],
                longitude: geo.ll[1],
            },
        } : null,
        isp: 'Unknown ISP', // Free version doesn't provide ISP
        device: {
            browser: ua.browser.name || 'Unknown',
            browserVersion: ua.browser.version || 'N/A',
            os: ua.os.name || 'Unknown',
            osVersion: ua.os.version || 'N/A',
            device: ua.device.type || 'desktop',
        },
        security: {
            isVPN: isVPN,
            isProxy: isVPN,
            isTor: false, // Would need Tor exit node list
            riskScore: riskScore,
            riskLevel: riskScore > 70 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW',
        },
        timestamp: new Date().toISOString(),
    };

    console.log(`  📍 Location: ${result.location?.city || 'Unknown'}, ${result.location?.countryName || 'Unknown'}`);
    console.log(`  💻 Device: ${result.device.browser} on ${result.device.os}`);
    console.log(`  🛡️  Risk: ${result.security.riskLevel} (${result.security.riskScore}/100)`);
    console.log('════════════════════════════════════════════════\n');

    return result;
};

function detectVPN(ip, headers) {
    // Basic VPN detection heuristics
    // Private IP ranges = likely behind VPN/proxy
    if (ip.startsWith('10.') ||
        ip.startsWith('172.16.') ||
        ip.startsWith('192.168.') ||
        ip === '127.0.0.1' ||
        ip === 'localhost') {
        return true;
    }

    return false;
}

function calculateRiskScore(ip, geo, ua, isVPN) {
    let score = 0;

    // No geolocation data = suspicious
    if (!geo) score += 30;

    // VPN/Proxy detected
    if (isVPN) score += 25;

    // No User-Agent or suspicious UA
    if (!ua.browser.name || ua.browser.name === 'Unknown') score += 20;

    // Headless browser (common in bots)
    if (ua.browser.name?.toLowerCase().includes('headless')) score += 25;

    // Localhost/Private IP
    if (ip === '127.0.0.1' || ip.startsWith('192.168.')) score += 15;

    return Math.min(100, score);
}

function getCountryName(code) {
    const countries = {
        'IN': 'India', 'US': 'United States', 'GB': 'United Kingdom',
        'CA': 'Canada', 'AU': 'Australia', 'DE': 'Germany', 'FR': 'France',
        'JP': 'Japan', 'CN': 'China', 'BR': 'Brazil', 'RU': 'Russia',
        'AE': 'UAE', 'SG': 'Singapore', 'NL': 'Netherlands',
    };
    return countries[code] || code;
}
