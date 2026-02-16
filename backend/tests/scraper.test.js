import { jest } from '@jest/globals';

// Mock axios
jest.unstable_mockModule('axios', () => ({
    default: {
        get: jest.fn()
    }
}));

const { scrapeWebsite } = await import('../src/services/scraper.js');

describe('Scraper Service (Mocks)', () => {
    test('should scrape website content via axios', async () => {
        const axios = (await import('axios')).default;
        // Return more than 500 characters to avoid Puppeteer fallback
        const largeContent = '<html><body><h1>Test Page</h1>' + '<p>Long content to avoid puppeteer fallback. </p>'.repeat(20) + '<p>Contact: 555-0199</p></body></html>';

        axios.get.mockResolvedValue({
            data: largeContent
        });

        const result = await scrapeWebsite('https://test.com');
        expect(result).toContain('Test Page');
        expect(result).toContain('555-0199');
        expect(axios.get).toHaveBeenCalled();
    });
});
