const axios = require('axios');

async function testSecurityScanner() {
    console.log('--- STARTING SECURITY SCAN TEST ---');
    const targetUrl = 'https://google.com';
    const apiUrl = 'http://localhost:5000/api/security/scan';

    try {
        console.log(`Scanning target: ${targetUrl}`);
        const response = await axios.post(apiUrl, {
            url: targetUrl
        });

        console.log('\n✅ SCAN SUCCESSFUL!');
        console.log('--------------------');
        console.log(`Target: ${response.data.data.url}`);
        console.log(`Security Score: ${response.data.data.securityScore}`);
        console.log(`Security Grade: ${response.data.data.grade}`);
        console.log('\nSSL Status:');
        console.log(`- Valid: ${response.data.data.ssl.valid}`);
        console.log(`- Days Remaining: ${response.data.data.ssl.daysRemaining}`);

        console.log('\nVulnerabilities Found:', response.data.data.vulnerabilities.length);
        if (response.data.data.vulnerabilities.length > 0) {
            console.log('Top Vulnerability:', response.data.data.vulnerabilities[0].type);
        }
        console.log('--------------------');
    } catch (error) {
        console.error('\n❌ SCAN FAILED!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testSecurityScanner();
