import sslChecker from 'ssl-checker';
import axios from 'axios';

/**
 * Security Scanner Service
 * analyzes websites for SSL/TLS configuration and Security Headers.
 */
export const scanWebsite = async (url) => {
    console.log(`[SecurityScanner] Initializing scan for: ${url}`);

    try {
        const targetUrl = new URL(url);
        const hostname = targetUrl.hostname;
        const protocol = targetUrl.protocol;

        // 1. SSL/TLS Certificate Check
        let sslData = { valid: false, grade: 'F' };
        if (protocol === 'https:') {
            try {
                const ssl = await sslChecker(hostname);
                sslData = {
                    valid: ssl.valid,
                    validFrom: ssl.validFrom,
                    validTo: ssl.validTo,
                    daysRemaining: ssl.daysRemaining,
                    grade: ssl.valid ? (ssl.daysRemaining > 30 ? 'A+' : 'B') : 'F'
                };
            } catch (sslErr) {
                console.error(`[SecurityScanner] SSL Check failed for ${hostname}:`, sslErr.message);
                sslData = { valid: false, error: 'Could not retrieve SSL certificate', grade: 'F' };
            }
        } else {
            sslData = { valid: false, error: 'Insecure protocol (HTTP)', grade: 'F' };
        }

        // 2. Fetch Headers
        let headers = {};
        try {
            const response = await axios.get(url, {
                timeout: 10000,
                headers: { 'User-Agent': 'Mozilla/5.0 (WebExtract-Security-Scanner/1.0)' },
                validateStatus: () => true // Allow any status code
            });
            headers = response.headers;
        } catch (headErr) {
            console.error(`[SecurityScanner] Header fetch failed:`, headErr.message);
            // We continue with empty headers to show they are missing
        }

        // 3. Header Audit Configuration
        const headersToAudit = {
            'strict-transport-security': { severity: 'HIGH', description: 'Enforces HTTPS connections to the server.' },
            'content-security-policy': { severity: 'HIGH', description: 'Prevents Cross-Site Scripting (XSS) and other code injection attacks.' },
            'x-frame-options': { severity: 'HIGH', description: 'Protects against Clickjacking by controlling if the site can be framed.' },
            'x-content-type-options': { severity: 'MEDIUM', description: 'Prevents the browser from MIME-sniffing the response.' },
            'x-xss-protection': { severity: 'MEDIUM', description: 'Enables the browser\'s built-in XSS filter.' },
            'referrer-policy': { severity: 'MEDIUM', description: 'Controls how much referrer information is passed to other sites.' },
            'permissions-policy': { severity: 'MEDIUM', description: 'Controls which browser features the site is allowed to use.' },
            'cross-origin-embedder-policy': { severity: 'LOW', description: 'Controls cross-origin resource embedding.' },
            'cross-origin-opener-policy': { severity: 'LOW', description: 'Controls cross-origin window opening.' },
            'cross-origin-resource-policy': { severity: 'LOW', description: 'Controls cross-origin resource sharing.' },
            'expect-ct': { severity: 'LOW', description: 'Certificate Transparency enforcement.' },
            'content-type': { severity: 'LOW', description: 'Checks for proper charset definition.' }
        };

        const auditResults = {};
        const vulnerabilities = [];
        let headerScore = 0;

        // Perform Header Audit
        Object.keys(headersToAudit).forEach(header => {
            const lowerHeader = header.toLowerCase();
            const value = headers[lowerHeader];
            const present = !!value;
            const config = headersToAudit[header];

            auditResults[header] = {
                present,
                value: value || null,
                severity: config.severity
            };

            if (present) {
                headerScore += 5;
            } else {
                vulnerabilities.push({
                    severity: config.severity,
                    type: `Missing ${header.toUpperCase()}`,
                    description: config.description,
                    remediation: `Add the '${header}' header to your server configuration.`
                });
            }
        });

        // Specific checks for exposure
        if (headers['server']) {
            vulnerabilities.push({
                severity: 'LOW',
                type: 'Server Version Exposed',
                description: 'The server header reveals information about the infrastructure.',
                remediation: 'Disable the Server header or obscure its contents.'
            });
        }
        if (headers['x-powered-by']) {
            vulnerabilities.push({
                severity: 'LOW',
                type: 'X-Powered-By Exposed',
                description: 'Reveals the technology stack used by the backend.',
                remediation: 'Remove the X-Powered-By header from server responses.'
            });
        }

        // 4. Score Calculation
        let securityScore = 0;
        if (sslData.valid) securityScore += 25;

        // Add header score (max 12 headers * 5 = 60, but user said 100 max, so let's normalize)
        // Adjusting: 12 headers * 6.25 = 75. 75 + 25 = 100.
        const normalizedHeaderScore = (headerScore / (Object.keys(headersToAudit).length * 5)) * 75;
        securityScore += normalizedHeaderScore;

        // Round score
        securityScore = Math.min(100, Math.round(securityScore));

        // 5. Final Grade Calculation
        let grade = 'F';
        if (securityScore >= 95) grade = 'A+';
        else if (securityScore >= 90) grade = 'A';
        else if (securityScore >= 80) grade = 'B';
        else if (securityScore >= 70) grade = 'C';
        else if (securityScore >= 60) grade = 'D';
        else grade = 'F';

        // Critical vulnerability for missing SSL
        if (!sslData.valid) {
            vulnerabilities.unshift({
                severity: 'CRITICAL',
                type: 'Missing or Invalid SSL/TLS',
                description: 'The website does not use encrypted connections or has a broken certificate.',
                remediation: 'Install a valid SSL certificate and enforce HTTPS.'
            });
        }

        const scanResponse = {
            url: url,
            hostname: hostname,
            ssl: sslData,
            headers: auditResults,
            vulnerabilities: vulnerabilities,
            securityScore: securityScore,
            grade: grade,
            timestamp: new Date().toISOString()
        };

        console.log(`[SecurityScanner] Scan completed for ${hostname}. Score: ${securityScore}, Grade: ${grade}`);
        return scanResponse;

    } catch (err) {
        console.error(`[SecurityScanner] Critical failure during scan:`, err);
        throw new Error(`Security scan failed: ${err.message}`);
    }
};
