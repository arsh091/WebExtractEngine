// ================================================================
// advancedScanner.js — Deep Website Analysis
// ================================================================
import dns from 'dns';
import axios from 'axios';
import { promisify } from 'util';
import https from 'https';
import http from 'http';
import geoip from 'geoip-lite';
import { exec } from 'child_process';

const dnsResolve4 = promisify(dns.resolve4);
const dnsResolve6 = promisify(dns.resolve6);
const dnsResolveMx = promisify(dns.resolveMx);
const dnsResolveTxt = promisify(dns.resolveTxt);
const dnsResolveNs = promisify(dns.resolveNs);
const execPromise = promisify(exec);

export const deepWebsiteAnalysis = async (url) => {
    console.log(`\n🔍 ══════════ DEEP WEBSITE ANALYSIS: ${url} ══════════`);

    const result = {
        url,
        timestamp: new Date().toISOString(),
        websiteIP: null,
        serverLocation: null,
        serverInfo: null,
        sslDetails: null,
        dnsRecords: null,
        performance: null,
        openPorts: null,
        technologies: null,
        firewall: null,
        robots: null,
    };

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        // ── 1. DNS Resolution (Get Website IP) ──────────────────
        console.log(`  🌐 Resolving DNS for ${hostname}...`);
        try {
            const ipv4 = await dnsResolve4(hostname);
            const primaryIP = ipv4[0];

            result.websiteIP = {
                ipv4: ipv4,
                primaryIP: primaryIP,
                totalIPs: ipv4.length,
            };

            // Try IPv6 too
            try {
                const ipv6 = await dnsResolve6(hostname);
                result.websiteIP.ipv6 = ipv6;
            } catch (ipv6Err) {
                result.websiteIP.ipv6 = null;
            }

            console.log(`  ✅ Website IP: ${primaryIP}`);
            console.log(`  📊 Total IPs: ${ipv4.length} (IPv4)`);

            // ── 2. Geolocate Website Server ─────────────────────
            const geo = geoip.lookup(primaryIP);
            if (geo) {
                result.serverLocation = {
                    ip: primaryIP,
                    country: geo.country,
                    countryName: getCountryName(geo.country),
                    region: geo.region,
                    city: geo.city,
                    timezone: geo.timezone,
                    coordinates: {
                        latitude: geo.ll[0],
                        longitude: geo.ll[1],
                    },
                };
                console.log(`  📍 Server Location: ${geo.city}, ${getCountryName(geo.country)}`);
            }

        } catch (dnsErr) {
            console.log(`  ❌ DNS Resolution failed: ${dnsErr.message}`);
        }

        // ── 3. Server Information (Headers Analysis) ────────────
        console.log(`  🖥️  Analyzing server headers...`);
        const serverInfo = await getServerInfo(url);
        result.serverInfo = serverInfo;
        console.log(`  ✅ Web Server: ${serverInfo.serverType || 'Unknown'}`);

        // ── 4. Deep SSL/TLS Analysis ────────────────────────────
        if (url.startsWith('https://')) {
            console.log(`  🔐 Analyzing SSL/TLS details...`);
            const sslDetails = await getSSLDetails(hostname);
            result.sslDetails = sslDetails;
            console.log(`  ✅ TLS Version: ${sslDetails.tlsVersion}`);
            console.log(`  ✅ Cipher Suite: ${sslDetails.cipherSuite}`);
        }

        // ── 5. DNS Records ──────────────────────────────────────
        console.log(`  📋 Fetching DNS records...`);
        const dnsRecords = await getDNSRecords(hostname);
        result.dnsRecords = dnsRecords;
        console.log(`  ✅ MX Records: ${dnsRecords.mx?.length || 0}`);
        console.log(`  ✅ TXT Records: ${dnsRecords.txt?.length || 0}`);

        // ── 6. Performance Analysis ─────────────────────────────
        console.log(`  ⚡ Measuring server response time...`);
        const performance = await measurePerformance(url);
        result.performance = performance;
        console.log(`  ✅ Response Time: ${performance.responseTime}ms`);

        // ── 7. Technology Detection ─────────────────────────────
        console.log(`  🔧 Detecting technologies...`);
        const technologies = detectTechnologies(serverInfo.rawHeaders, serverInfo.html);
        result.technologies = technologies;
        console.log(`  ✅ Technologies: ${technologies.backend.join(', ') || 'Unknown'}`);

        // ── 8. Firewall/WAF Detection ───────────────────────────
        console.log(`  🛡️  Checking for firewall/WAF...`);
        const firewall = detectFirewall(serverInfo.rawHeaders);
        result.firewall = firewall;
        if (firewall.detected) {
            console.log(`  ✅ Firewall/WAF: ${firewall.type}`);
        }

        // ── 9. Port Scanning (Common Ports) ─────────────────────
        if (result.websiteIP?.primaryIP) {
            console.log(`  🔌 Scanning common ports...`);
            const openPorts = await scanCommonPorts(result.websiteIP.primaryIP);
            result.openPorts = openPorts;
            console.log(`  ✅ Open Ports: ${openPorts.open.join(', ') || 'None detected'}`);
        }

        // ── 10. Fetch Robots.txt ────────────────────────────────
        console.log(`  🤖 Fetching robots.txt permissions...`);
        try {
            const robotsRes = await axios.get(`${urlObj.origin}/robots.txt`, { timeout: 5000 });
            result.robots = robotsRes.data;
            console.log(`  ✅ Robots.txt fetched (${result.robots.length} chars)`);
        } catch (err) {
            result.robots = 'robots.txt not found or inaccessible';
            console.log(`  ⚠️ Robots.txt not found`);
        }

    } catch (error) {
        console.error(`  ❌ Analysis failed: ${error.message}`);
        result.error = error.message;
    }

    console.log('══════════════════════════════════════════════════\n');
    return result;
};

// ── Get Server Information from Headers ─────────────────────────
async function getServerInfo(url) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const protocol = urlObj.protocol === 'https:' ? https : http;

        protocol.get(url, { timeout: 10000 }, (res) => {
            let html = '';
            res.on('data', chunk => html += chunk);
            res.on('end', () => {
                resolve({
                    serverType: res.headers['server'] || 'Unknown',
                    poweredBy: res.headers['x-powered-by'] || null,
                    contentType: res.headers['content-type'] || null,
                    statusCode: res.statusCode,
                    rawHeaders: res.headers,
                    html: html.substring(0, 50000), // First 50KB for analysis
                });
            });
        }).on('error', () => {
            resolve({
                serverType: 'Unknown',
                poweredBy: null,
                contentType: null,
                statusCode: null,
                rawHeaders: {},
                html: '',
            });
        });
    });
}

// ── Deep SSL/TLS Details ────────────────────────────────────────
async function getSSLDetails(hostname) {
    return new Promise((resolve) => {
        const options = {
            host: hostname,
            port: 443,
            method: 'GET',
            rejectUnauthorized: false,
        };

        const req = https.request(options, (res) => {
            const socket = res.socket;
            const cipher = socket.getCipher();
            const protocol = socket.getProtocol();
            const cert = socket.getPeerCertificate();

            resolve({
                tlsVersion: protocol || 'Unknown',
                cipherSuite: cipher?.name || 'Unknown',
                cipherBits: cipher?.bits || null,
                certificateChain: cert?.issuerCertificate ? 'Yes' : 'No',
                certificateSubject: cert?.subject?.CN || null,
                certificateIssuer: cert?.issuer?.CN || null,
                validFrom: cert?.valid_from || null,
                validTo: cert?.valid_to || null,
            });
        });

        req.on('error', () => {
            resolve({
                tlsVersion: 'Unknown',
                cipherSuite: 'Unknown',
                cipherBits: null,
                certificateChain: 'Unknown',
            });
        });

        req.end();
    });
}

// ── Get DNS Records ─────────────────────────────────────────────
async function getDNSRecords(hostname) {
    const records = {
        mx: null,
        txt: null,
        ns: null,
    };

    try {
        records.mx = await dnsResolveMx(hostname);
        console.log(`    • MX: ${records.mx.length} records`);
    } catch (err) {
        records.mx = [];
    }

    try {
        records.txt = await dnsResolveTxt(hostname);
        console.log(`    • TXT: ${records.txt.length} records`);
    } catch (err) {
        records.txt = [];
    }

    try {
        records.ns = await dnsResolveNs(hostname);
        console.log(`    • NS: ${records.ns.length} nameservers`);
    } catch (err) {
        records.ns = [];
    }

    return records;
}

// ── Measure Server Performance ──────────────────────────────────
async function measurePerformance(url) {
    const startTime = Date.now();

    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const protocol = urlObj.protocol === 'https:' ? https : http;

        const req = protocol.get(url, { timeout: 10000 }, (res) => {
            const responseTime = Date.now() - startTime;
            let size = 0;

            res.on('data', chunk => size += chunk.length);
            res.on('end', () => {
                resolve({
                    responseTime: responseTime,
                    statusCode: res.statusCode,
                    contentSize: size,
                    transferSpeed: (size / (responseTime / 1000) / 1024).toFixed(2) + ' KB/s',
                });
            });
        });

        req.on('error', () => {
            resolve({
                responseTime: null,
                statusCode: null,
                contentSize: null,
                transferSpeed: null,
            });
        });

        req.end();
    });
}

// ── Detect Technologies ─────────────────────────────────────────
function detectTechnologies(headers, html) {
    const tech = {
        backend: [],
        frontend: [],
        cdn: [],
        analytics: [],
        cms: [],
    };

    // Backend detection
    if (headers.server) {
        if (headers.server.toLowerCase().includes('nginx')) tech.backend.push('Nginx');
        if (headers.server.toLowerCase().includes('apache')) tech.backend.push('Apache');
        if (headers.server.toLowerCase().includes('cloudflare')) tech.cdn.push('Cloudflare');
    }

    if (headers['x-powered-by']) {
        const powered = headers['x-powered-by'].toLowerCase();
        if (powered.includes('php')) tech.backend.push('PHP');
        if (powered.includes('express')) tech.backend.push('Express.js');
        if (powered.includes('asp.net')) tech.backend.push('ASP.NET');
    }

    // Frontend detection from HTML
    if (html) {
        if (html.includes('react')) tech.frontend.push('React');
        if (html.includes('vue')) tech.frontend.push('Vue.js');
        if (html.includes('angular')) tech.frontend.push('Angular');
        if (html.includes('jquery')) tech.frontend.push('jQuery');

        // CMS detection
        if (html.includes('wp-content') || html.includes('wordpress')) tech.cms.push('WordPress');
        if (html.includes('joomla')) tech.cms.push('Joomla');
        if (html.includes('drupal')) tech.cms.push('Drupal');

        // Analytics
        if (html.includes('google-analytics') || html.includes('gtag')) tech.analytics.push('Google Analytics');
        if (html.includes('hotjar')) tech.analytics.push('Hotjar');
    }

    // CDN detection
    if (headers['cf-ray']) tech.cdn.push('Cloudflare');
    if (headers['x-amz-cf-id']) tech.cdn.push('AWS CloudFront');
    if (headers['x-cache']?.includes('HIT')) tech.cdn.push('CDN (Generic)');

    return tech;
}

// ── Detect Firewall/WAF ─────────────────────────────────────────
function detectFirewall(headers) {
    const firewall = {
        detected: false,
        type: 'None',
        indicators: [],
    };

    // Check headers for WAF signatures
    if (headers['cf-ray']) {
        firewall.detected = true;
        firewall.type = 'Cloudflare WAF';
        firewall.indicators.push('cf-ray header');
    }

    if (headers['x-sucuri-id']) {
        firewall.detected = true;
        firewall.type = 'Sucuri WAF';
        firewall.indicators.push('x-sucuri-id header');
    }

    if (headers['server']?.toLowerCase().includes('cloudflare')) {
        firewall.detected = true;
        firewall.type = 'Cloudflare';
        firewall.indicators.push('server header');
    }

    if (headers['x-amz-cf-id']) {
        firewall.detected = true;
        firewall.type = 'AWS WAF';
        firewall.indicators.push('x-amz-cf-id header');
    }

    return firewall;
}

// ── Scan Common Ports ───────────────────────────────────────────
async function scanCommonPorts(ip) {
    const commonPorts = [21, 22, 25, 53, 80, 443, 3306, 8080, 8443];
    const result = {
        ip: ip,
        scanned: commonPorts,
        open: [],
        closed: [],
        filtered: [],
    };

    // Quick TCP connection check for each port
    // We use dynamic import for 'net' to stay consistent with modern patterns
    const { Socket } = await import('net');

    const scanPromises = commonPorts.map(port => checkPort(ip, port, Socket));
    const results = await Promise.all(scanPromises);

    results.forEach((status, idx) => {
        const port = commonPorts[idx];
        if (status === 'open') result.open.push(port);
        else if (status === 'closed') result.closed.push(port);
        else result.filtered.push(port);
    });

    return result;
}

// ── Check Single Port ───────────────────────────────────────────
function checkPort(host, port, Socket) {
    return new Promise((resolve) => {
        const socket = new Socket();
        const timeout = 2000;

        socket.setTimeout(timeout);

        socket.on('connect', () => {
            socket.destroy();
            resolve('open');
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve('filtered');
        });

        socket.on('error', () => {
            resolve('closed');
        });

        socket.connect(port, host);
    });
}

// ── Country Name Helper ─────────────────────────────────────────
function getCountryName(code) {
    const countries = {
        'IN': 'India', 'US': 'United States', 'GB': 'United Kingdom',
        'CA': 'Canada', 'AU': 'Australia', 'DE': 'Germany', 'FR': 'France',
        'JP': 'Japan', 'CN': 'China', 'BR': 'Brazil', 'AE': 'UAE', 'SG': 'Singapore',
        'NL': 'Netherlands', 'IE': 'Ireland', 'CH': 'Switzerland',
    };
    return countries[code] || code;
}
