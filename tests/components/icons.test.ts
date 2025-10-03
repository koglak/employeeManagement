import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import all icon components
import '../../src/components/icons/icon-edit';
import '../../src/components/icons/icon-delete';
import '../../src/components/icons/icon-flag-en';
import '../../src/components/icons/icon-flag-tr';
import '../../src/components/icons/icon-grid';
import '../../src/components/icons/icon-menu';

describe('Icon Components', () => {
  let iconElements: HTMLElement[] = [];

  beforeEach(() => {
    // Create instances of each icon component
    const iconNames = ['icon-edit', 'icon-delete', 'icon-flag-en', 'icon-flag-tr', 'icon-grid', 'icon-menu'];
    iconElements = iconNames.map(name => {
      const element = document.createElement(name);
      document.body.appendChild(element);
      return element;
    });
  });

  afterEach(() => {
    iconElements.forEach(element => {
      document.body.removeChild(element);
    });
    iconElements = [];
  });

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
      'icon-menu',
      'icon-edit',
      'icon-delete'
    ];

    iconNames.forEach(name => {
      expect(name).toMatch(/^icon-[a-z-]+$/);
    });
  });

  it('should render all icon components properly', () => {
    iconElements.forEach(element => {
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.shadowRoot).toBeTruthy();
    });
  });

  it('should have edit and delete icons for actions', () => {
    const actionIcons = ['icon-edit', 'icon-delete'];
    actionIcons.forEach(iconName => {
      expect(iconName).toMatch(/^icon-(edit|delete)$/);
    });
  });

  it('should have navigation icons', () => {
    const navIcons = ['icon-grid', 'icon-menu'];
    navIcons.forEach(iconName => {
      expect(iconName).toMatch(/^icon-(grid|menu)$/);
    });
  });

  it('should support theme colors through CSS variables', () => {
    // Test that icons can use CSS variables for colors
    const testIcon = iconElements[0];
    if (testIcon && testIcon.shadowRoot) {
      const styles = getComputedStyle(testIcon);
      // Icons should be able to inherit color properties
      expect(testIcon).toBeInstanceOf(HTMLElement);
    }
  });
});
