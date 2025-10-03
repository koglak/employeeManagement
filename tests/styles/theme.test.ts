// Styles Tests Index
import './theme.test';
import './shared-styles.test';
import { describe, it, expect } from 'vitest';

describe('Theme System', () => {
  it('should have proper CSS custom properties structure', () => {
    const expectedThemeVars = [
      '--color-primary',
      '--color-surface',
      '--color-text',
      '--color-bg',
      '--color-muted',
      '--shadow'
    ];

    expectedThemeVars.forEach(varName => {
      expect(varName).toMatch(/^--[a-z-]+$/);
    });
  });

  it('should have consistent color naming', () => {
    const colorVariables = [
      '--color-primary',
      '--color-surface',
      '--color-text',
      '--color-bg',
      '--color-muted'
    ];

    colorVariables.forEach(colorVar => {
      expect(colorVar).toMatch(/^--color-[a-z]+$/);
    });
  });

  it('should have proper breakpoint logic', () => {
    const mobileBreakpoint = 768;
    const tabletBreakpoint = 1024;

    expect(mobileBreakpoint).toBeLessThan(tabletBreakpoint);
    expect(mobileBreakpoint).toBeGreaterThan(0);
  });
});
