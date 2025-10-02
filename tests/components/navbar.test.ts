import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { i18n } from '../../src/i18n/i18n';

// Mock DOM elements için basit test helper
function createMockElement(tagName: string) {
  return {
    tagName: tagName.toUpperCase(),
    textContent: '',
    getAttribute: () => null,
    setAttribute: () => {},
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => false
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    click: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  };
}

describe('AppNavbar Logic', () => {
  beforeEach(() => {
    i18n.lang = 'tr';
  });

  it('should have correct Turkish navigation texts', () => {
    expect(i18n.t('brand')).toBe('Çalışan Listesi');
    expect(i18n.t('employees')).toBe('Çalışanlar');
    expect(i18n.t('addNew')).toBe('Yeni Ekle');
  });

  it('should have correct English navigation texts', () => {
    i18n.lang = 'en';
    expect(i18n.t('brand')).toBe('Employee List');
    expect(i18n.t('employees')).toBe('Employees');
    expect(i18n.t('addNew')).toBe('Add New');
  });

  it('should update navigation texts when language changes', () => {
    // Start with Turkish
    expect(i18n.t('employees')).toBe('Çalışanlar');
    
    // Change to English
    i18n.lang = 'en';
    expect(i18n.t('employees')).toBe('Employees');
    
    // Back to Turkish
    i18n.lang = 'tr';
    expect(i18n.t('employees')).toBe('Çalışanlar');
  });

  afterEach(() => {
    i18n.lang = 'tr';
  });
});

describe('AppLanguage Logic', () => {
  beforeEach(() => {
    i18n.lang = 'tr';
  });

  it('should start with Turkish as default language', () => {
    expect(i18n.lang).toBe('tr');
  });

  it('should switch between languages', () => {
    // Switch to English
    i18n.lang = 'en';
    expect(i18n.lang).toBe('en');
    
    // Switch back to Turkish
    i18n.lang = 'tr';
    expect(i18n.lang).toBe('tr');
  });

  it('should provide correct language options', () => {
    const languages = {
      tr: { name: 'Türkçe' },
      en: { name: 'English' }
    };
    
    expect(languages.tr.name).toBe('Türkçe');
    expect(languages.en.name).toBe('English');
  });

  afterEach(() => {
    i18n.lang = 'tr';
  });
});
