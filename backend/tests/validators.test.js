import { validateUrl, isValidEmail, isValidPhone } from '../src/utils/validators.js';

describe('Validators', () => {
    describe('validateUrl', () => {
        test('should validate correct URLs', () => {
            expect(validateUrl('https://example.com')).toBe(true);
            expect(validateUrl('http://test.com')).toBe(true);
        });

        test('should reject invalid URLs', () => {
            expect(validateUrl('not-a-url')).toBe(false);
            expect(validateUrl('ftp://example.com')).toBe(false);
        });
    });

    describe('isValidEmail', () => {
        test('should validate correct emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
        });

        test('should reject invalid emails', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
        });
    });

    describe('isValidPhone', () => {
        test('should validate correct phones', () => {
            expect(isValidPhone('9999999999')).toBe(true);
            expect(isValidPhone('+91 9999999999')).toBe(true);
        });

        test('should reject invalid phones', () => {
            expect(isValidPhone('123')).toBe(false);
        });
    });
});
