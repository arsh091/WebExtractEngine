import {
    phonePatterns,
    emailPattern,
    addressPatterns
} from '../utils/patterns.js';

export const extractPhones = (text) => {
    const phones = [];

    phonePatterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'g');
        const matches = text.match(regex);
        if (matches) {
            phones.push(...matches);
        }
    });

    return cleanPhoneNumbers(phones);
};

export const extractEmails = (text) => {
    const matches = text.match(new RegExp(emailPattern, 'gi'));
    return matches ? cleanEmails(matches) : [];
};

export const extractAddresses = (text) => {
    const addresses = [];

    addressPatterns.forEach(pattern => {
        const matches = text.match(new RegExp(pattern, 'gi'));
        if (matches) {
            addresses.push(...matches);
        }
    });

    return cleanAddresses(addresses);
};

// Helper functions
const cleanPhoneNumbers = (phones) => {
    return phones
        .map(phone => phone.trim())
        // Normalize separators: replace hyphens, dots, and multiple spaces with a single space
        .map(phone => phone.replace(/[.\-]/g, ' '))
        .map(phone => phone.replace(/\s+/g, ' '))
        .filter(phone => phone.length >= 10)
        .filter((phone, index, self) => self.indexOf(phone) === index);
};

const cleanEmails = (emails) => {
    return emails
        .map(email => email.toLowerCase().trim())
        // Restore real @ if it was obscured like "name [at] domain.com"
        .map(email => email.replace(/\s*[\(\{\[@]+at[\)\}\]@]+\s*/gi, '@'))
        .map(email => email.replace(/\s+/, '@')) // Handle "name domain.com" if captured
        .filter(email => email.includes('@'))
        .filter(email => !email.includes('example.com'))
        .filter((email, index, self) => self.indexOf(email) === index);
};

const cleanAddresses = (addresses) => {
    return addresses
        .map(addr => addr.trim())
        .map(addr => addr.replace(/\s+/g, ' '))
        .map(addr => addr.replace(/^(Address|Location|Locality|Office):?\s*/i, ''))
        .filter(addr => addr.length > 20)
        .filter((addr, index, self) => self.indexOf(addr) === index);
};
