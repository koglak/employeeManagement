import { describe, it, expect } from 'vitest';
import { formatPhone } from '../../src/utils/phone';

describe('Phone Utility Functions', () => {
    describe('formatPhone', () => {
        it('should format Turkish phone numbers with country code', () => {
            expect(formatPhone('905551234567')).toBe('(+90) 555 123 45 67');
            expect(formatPhone('905321234567')).toBe('(+90) 532 123 45 67');
            expect(formatPhone('905001234567')).toBe('(+90) 500 123 45 67');
        });

        it('should handle phone numbers with existing formatting', () => {
            expect(formatPhone('90 555 123 45 67')).toBe('(+90) 555 123 45 67');
            expect(formatPhone('90-555-123-45-67')).toBe('(+90) 555 123 45 67');
            expect(formatPhone('90.555.123.45.67')).toBe('(+90) 555 123 45 67');
        });

        it('should handle phone numbers with + prefix', () => {
            expect(formatPhone('+905551234567')).toBe('(+90) 555 123 45 67');
            expect(formatPhone('+90 555 123 45 67')).toBe('(+90) 555 123 45 67');
        });

        it('should handle already formatted numbers', () => {
            expect(formatPhone('(+90) 555 123 45 67')).toBe('(+90) 555 123 45 67');
            expect(formatPhone('(+90) 532 123 45 67')).toBe('(+90) 532 123 45 67');
        });

        it('should handle incomplete phone numbers', () => {
            // Function only formats numbers with 12+ digits starting with 90
            expect(formatPhone('90555123')).toBe('90555123'); // Too short, returned as-is
            expect(formatPhone('9055512345')).toBe('9055512345'); // Still too short
            expect(formatPhone('905551234567890')).toBe('(+90) 555 123 45 67'); // Long enough, gets formatted
        }); it('should return original value for non-Turkish numbers', () => {
            expect(formatPhone('15551234567')).toBe('15551234567');
            expect(formatPhone('44555123456')).toBe('44555123456');
            expect(formatPhone('05551234567')).toBe('05551234567');
        });

        it('should handle numbers starting with 0', () => {
            expect(formatPhone('05551234567')).toBe('05551234567');
            expect(formatPhone('05321234567')).toBe('05321234567');
        });

        it('should handle edge cases', () => {
            expect(formatPhone('')).toBe('');
            expect(formatPhone('90')).toBe('90'); // Too short, returned as-is
            expect(formatPhone('abc')).toBe('abc'); // No digits, returned as-is
            expect(formatPhone('90abc555def123ghi45jkl67')).toBe('(+90) 555 123 45 67');
        }); it('should preserve spaces in formatted output', () => {
            const formatted = formatPhone('905551234567');
            expect(formatted).toMatch(/^\(\+90\) \d{3} \d{3} \d{2} \d{2}$/);
        });

        it('should handle various separators in input', () => {
            expect(formatPhone('90(555)123-45-67')).toBe('(+90) 555 123 45 67');
            expect(formatPhone('90 555-123.45 67')).toBe('(+90) 555 123 45 67');
            expect(formatPhone('90/555/123/45/67')).toBe('(+90) 555 123 45 67');
        });

        it('should handle minimum valid Turkish number length', () => {
            expect(formatPhone('905551234567')).toBe('(+90) 555 123 45 67');
            expect(formatPhone('9055512345')).toBe('9055512345'); // Too short for formatting
        }); it('should trim extra spaces from output', () => {
            const formatted = formatPhone('905551234567');
            expect(formatted).not.toMatch(/\s+$/);
            expect(formatted).toBe('(+90) 555 123 45 67');
        });
    });
});
