import { extractPhones, extractEmails, extractAddresses } from '../src/services/extractor.js';

describe('Extractor Service', () => {
    const sampleText = `
        Contact us at 99999-88888 or +1-555-010-999.
        Email us at support@webextract.com or admin@site.in.
        Visit our office: 123 Tech Lane, Suite 400, San Francisco, CA 94105.
    `;

    test('should extract phone numbers', () => {
        const phones = extractPhones(sampleText);
        expect(phones).toContain('99999 88888');
        expect(phones.length).toBeGreaterThan(0);
    });

    test('should extract emails', () => {
        const emails = extractEmails(sampleText);
        expect(emails).toContain('support@webextract.com');
        expect(emails).toContain('admin@site.in');
    });

    test('should extract addresses', () => {
        const addresses = extractAddresses(sampleText);
        expect(addresses.some(addr => addr.includes('123 Tech Lane'))).toBe(true);
    });
});
