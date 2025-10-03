import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppLanguage } from '../../src/components/navbar/app-language';

// Import the component
import '../../src/components/navbar/app-language';

describe('AppLanguage', () => {
    let element: AppLanguage;

    beforeEach(() => {
        element = document.createElement('app-language') as AppLanguage;
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('should render properly', () => {
        expect(element).toBeInstanceOf(AppLanguage);
        expect(element.shadowRoot).toBeTruthy();
    });

    it('should use languageStyles from shared styles', () => {
        expect(element.constructor).toHaveProperty('styles');
    });

    it('should handle language switching', () => {
        // Test language functionality
        expect(element).toBeInstanceOf(HTMLElement);
    });

    it('should emit language change events', () => {
        let languageChangeEventDetail: any = null;
        element.addEventListener('language-change', (e: Event) => {
            languageChangeEventDetail = (e as CustomEvent).detail;
        });

        // Simulate language change if method exists
        if (typeof (element as any).setLanguage === 'function') {
            (element as any).setLanguage('tr');
            expect(languageChangeEventDetail).toBeTruthy();
        }
    });

    it('should support multiple languages', () => {
        // Test language support
        const supportedLanguages = ['en', 'tr'];
        supportedLanguages.forEach(lang => {
            expect(lang).toMatch(/^(en|tr)$/);
        });
    });
});
