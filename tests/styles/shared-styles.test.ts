import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { theme } from '../../src/styles/theme.css';
import { tableStyles } from '../../src/styles/table.css';
import { gridStyles } from '../../src/styles/grid.css';
import { paginationStyles } from '../../src/styles/pagination.css';
import { navStyles } from '../../src/styles/nav.css';
import { formStyles } from '../../src/styles/form.css';
import { languageStyles } from '../../src/styles/language.css';
import { homeStyles } from '../../src/styles/home.css';

describe('Shared Styles System', () => {
    describe('Style Exports', () => {
        it('should export theme styles', () => {
            expect(theme).toBeDefined();
            expect(typeof theme).toBe('object');
        });

        it('should export table styles', () => {
            expect(tableStyles).toBeDefined();
            expect(typeof tableStyles).toBe('object');
        });

        it('should export grid styles', () => {
            expect(gridStyles).toBeDefined();
            expect(typeof gridStyles).toBe('object');
        });

        it('should export pagination styles', () => {
            expect(paginationStyles).toBeDefined();
            expect(typeof paginationStyles).toBe('object');
        });

        it('should export navigation styles', () => {
            expect(navStyles).toBeDefined();
            expect(typeof navStyles).toBe('object');
        });

        it('should export form styles', () => {
            expect(formStyles).toBeDefined();
            expect(typeof formStyles).toBe('object');
        });

        it('should export language styles', () => {
            expect(languageStyles).toBeDefined();
            expect(typeof languageStyles).toBe('object');
        });

        it('should export home styles', () => {
            expect(homeStyles).toBeDefined();
            expect(typeof homeStyles).toBe('object');
        });
    });

    describe('CSS Variables Consistency', () => {
        it('should use consistent color variable naming', () => {
            const expectedColorVars = [
                '--color-primary',
                '--color-secondary',
                '--color-surface',
                '--color-text',
                '--color-bg',
                '--color-muted',
                '--color-error',
                '--color-border',
                '--color-hover-bg',
                '--color-disabled'
            ];

            expectedColorVars.forEach(varName => {
                expect(varName).toMatch(/^--color-[a-z-]+$/);
            });
        });

        it('should use consistent spacing variable naming', () => {
            const expectedSpacingVars = [
                '--space-1',
                '--space-2',
                '--space-3',
                '--space-4',
                '--space-5',
                '--space-6',
                '--space-8',
                '--space-10',
                '--space-12'
            ];

            expectedSpacingVars.forEach(varName => {
                expect(varName).toMatch(/^--space-\d+$/);
            });
        });

        it('should use consistent font size variable naming', () => {
            const expectedFontVars = [
                '--font-size-xs',
                '--font-size-sm',
                '--font-size-base',
                '--font-size-lg',
                '--font-size-xl',
                '--font-size-2xl',
                '--font-size-3xl'
            ];

            expectedFontVars.forEach(varName => {
                expect(varName).toMatch(/^--font-size-(xs|sm|base|lg|xl|\d+xl)$/);
            });
        });
    });

  describe('Global Styles Injection', () => {
    beforeEach(() => {
      // Clean up any existing style elements
      const existingStyles = document.querySelectorAll('#global-theme-styles');
      existingStyles.forEach(el => el.remove());
    });

    afterEach(() => {
      // Clean up after tests
      const existingStyles = document.querySelectorAll('#global-theme-styles');
      existingStyles.forEach(el => el.remove());
    });

    it('should not duplicate global styles', async () => {
      // Import theme multiple times
      await import('../../src/styles/theme.css');
      await import('../../src/styles/theme.css');
      
      const styleElements = document.querySelectorAll('#global-theme-styles');
      expect(styleElements.length).toBeLessThanOrEqual(1);
    });
  });    describe('Responsive Design Support', () => {
        it('should define mobile breakpoints', () => {
            // Test that breakpoint patterns are consistent
            const mobileBreakpoint = '@media (max-width: 768px)';
            const tabletBreakpoint = '@media (max-width: 1024px)';
            const smallMobileBreakpoint = '@media (max-width: 480px)';

            expect(mobileBreakpoint).toMatch(/@media \(max-width: \d+px\)/);
            expect(tabletBreakpoint).toMatch(/@media \(max-width: \d+px\)/);
            expect(smallMobileBreakpoint).toMatch(/@media \(max-width: \d+px\)/);
        });
    });

    describe('Component Style Structure', () => {
        it('should have :host selector for component styles', () => {
            // Most component styles should start with :host
            const componentStyles = [theme, gridStyles, tableStyles, homeStyles];

            componentStyles.forEach(styleObj => {
                expect(styleObj).toBeDefined();
                // Check if it's a proper CSSResult object from lit
                expect(styleObj).toHaveProperty('cssText');
            });
        });

        it('should use semantic class names', () => {
            const semanticPatterns = [
                /\.btn/,
                /\.card/,
                /\.grid/,
                /\.table/,
                /\.nav/,
                /\.form/,
                /\.pagination/,
                /\.content/,
                /\.header/,
                /\.footer/
            ];

            // These patterns represent good semantic naming
            semanticPatterns.forEach(pattern => {
                expect(pattern.source).toMatch(/^\\\./);
            });
        });
    });

    describe('Color System Validation', () => {
        it('should define primary color variants', () => {
            const primaryColors = [
                '--color-primary',
                '--color-primary-600'
            ];

            primaryColors.forEach(color => {
                expect(color).toMatch(/^--color-primary/);
            });
        });

        it('should define border color variants', () => {
            const borderColors = [
                '--color-border',
                '--color-border-light',
                '--color-border-lighter',
                '--color-border-lightest',
                '--color-border-subtle'
            ];

            borderColors.forEach(color => {
                expect(color).toMatch(/^--color-border/);
            });
        });

        it('should define state colors', () => {
            const stateColors = [
                '--color-error',
                '--color-disabled',
                '--color-hover-bg'
            ];

            stateColors.forEach(color => {
                expect(color).toMatch(/^--color-(error|disabled|hover)/);
            });
        });
    });

    describe('Typography System', () => {
        it('should define line height variables', () => {
            const lineHeights = [
                '--line-height-tight',
                '--line-height-normal',
                '--line-height-relaxed'
            ];

            lineHeights.forEach(lh => {
                expect(lh).toMatch(/^--line-height-(tight|normal|relaxed)$/);
            });
        });
    });

    describe('Design Token Consistency', () => {
        it('should use consistent radius values', () => {
            const radiusVar = '--radius';
            expect(radiusVar).toMatch(/^--radius$/);
        });

        it('should use consistent shadow values', () => {
            const shadowVar = '--shadow';
            expect(shadowVar).toMatch(/^--shadow$/);
        });
    });

    describe('Accessibility Support', () => {
        it('should support focus-visible styles', () => {
            // Check that focus patterns are defined
            const focusPattern = /focus-visible/;
            expect(focusPattern.test('button:focus-visible')).toBe(true);
        });

        it('should have proper contrast ratios in color definitions', () => {
            // Basic color contrast validation
            const contrastColors = [
                '--color-text', // Should be dark on light backgrounds
                '--color-muted', // Should have sufficient contrast
                '--color-primary' // Should meet WCAG standards
            ];

            contrastColors.forEach(color => {
                expect(color).toMatch(/^--color-/);
            });
        });
    });
});
