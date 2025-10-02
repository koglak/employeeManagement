import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { i18n } from '../../src/i18n/i18n';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
    value: {
        lang: 'tr'
    },
    writable: true
});

describe('I18nStore', () => {
    beforeEach(() => {
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
        i18n.lang = 'tr';
    });

    it('should have Turkish as default language', () => {
        expect(i18n.lang).toBe('tr');
    });

    it('should change language', () => {
        i18n.lang = 'en';
        expect(i18n.lang).toBe('en');

        i18n.lang = 'tr';
        expect(i18n.lang).toBe('tr');
    });

    it('should translate Turkish keys correctly', () => {
        i18n.lang = 'tr';
        expect(i18n.t('brand')).toBe('Çalışan Listesi');
        expect(i18n.t('employees')).toBe('Çalışanlar');
        expect(i18n.t('addNew')).toBe('Yeni Ekle');
        expect(i18n.t('table')).toBe('Tablo');
        expect(i18n.t('grid')).toBe('Izgara');
        expect(i18n.t('search')).toBe('Ara…');
    });

    it('should translate English keys correctly', () => {
        i18n.lang = 'en';
        expect(i18n.t('brand')).toBe('Employee List');
        expect(i18n.t('employees')).toBe('Employees');
        expect(i18n.t('addNew')).toBe('Add New');
        expect(i18n.t('table')).toBe('Table');
        expect(i18n.t('grid')).toBe('Grid');
        expect(i18n.t('search')).toBe('Search…');
    });

    it('should notify subscribers when language changes', () => {
        return new Promise<void>((resolve) => {
            let callCount = 0;

            const unsubscribe = i18n.subscribe(() => {
                callCount++;
                if (callCount === 1) {
                    expect(i18n.lang).toBe('en');
                    i18n.lang = 'tr';
                } else if (callCount === 2) {
                    expect(i18n.lang).toBe('tr');
                    unsubscribe();
                    resolve();
                }
            });

            i18n.lang = 'en';
        });
    });

    it('should not notify subscribers when setting same language', () => {
        let callCount = 0;

        const unsubscribe = i18n.subscribe(() => {
            callCount++;
        });

        // Set same language multiple times
        i18n.lang = 'tr';
        i18n.lang = 'tr';
        i18n.lang = 'tr';

        expect(callCount).toBe(0);
        unsubscribe();
    });

    it('should save language to localStorage when changed', () => {
        i18n.lang = 'en';
        expect(localStorageMock.setItem).toHaveBeenCalledWith('app-language', 'en');

        i18n.lang = 'tr';
        expect(localStorageMock.setItem).toHaveBeenCalledWith('app-language', 'tr');
    });

    it('should update HTML lang attribute when language changes', () => {
        const mockDocumentElement = { lang: 'tr' };
        Object.defineProperty(document, 'documentElement', {
            value: mockDocumentElement,
            writable: true
        });

        i18n.lang = 'en';
        expect(mockDocumentElement.lang).toBe('en');

        i18n.lang = 'tr';
        expect(mockDocumentElement.lang).toBe('tr');
    });

    afterEach(() => {
        i18n.lang = 'tr';
    });
});
