import { deepWebsiteAnalysis } from './src/services/advancedScanner.js';

async function testAdvanced() {
    const url = 'https://google.com';
    try {
        const result = await deepWebsiteAnalysis(url);
        console.log('Result Keys:', Object.keys(result));
        console.log('IP:', result.websiteIP?.primaryIP);
        console.log('Location:', result.serverLocation?.countryName);
        console.log('Ports:', result.openPorts?.open);
    } catch (e) {
        console.error('Test Failed:', e);
    }
}

testAdvanced();
