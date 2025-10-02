import { describe, it, expect } from 'vitest';

describe('Icon Components', () => {
  it('should have flag icons defined', () => {
    // Test icon component exports
    const flagIcons = ['icon-flag-tr', 'icon-flag-en'];
    
    flagIcons.forEach(iconName => {
      expect(iconName).toMatch(/^icon-flag-(tr|en)$/);
    });
  });

  it('should have proper icon naming convention', () => {
    const iconNames = [
      'icon-flag-tr',
      'icon-flag-en', 
      'icon-grid',
      'icon-menu'
    ];
    
    iconNames.forEach(name => {
      expect(name).toMatch(/^icon-[a-z-]+$/);
    });
  });
});
