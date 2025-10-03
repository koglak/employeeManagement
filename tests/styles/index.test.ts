import { describe, it, expect } from 'vitest';
import { css } from 'lit';
import {
    theme,
    tableStyles,
    gridStyles,
    paginationStyles,
    navStyles,
    formStyles,
    languageStyles,
    homeStyles,
    popupStyles,
    infoPopupStyles
} from '../../src/styles/index';

describe('Styles Index', () => {
    describe('Exports', () => {
        it('should export theme', () => {
            expect(theme).toBeDefined();
            expect(typeof theme).toBe('object');
        });

        it('should export tableStyles', () => {
            expect(tableStyles).toBeDefined();
            expect(typeof tableStyles).toBe('object');
        });

        it('should export gridStyles', () => {
            expect(gridStyles).toBeDefined();
            expect(typeof gridStyles).toBe('object');
        });

        it('should export paginationStyles', () => {
            expect(paginationStyles).toBeDefined();
            expect(typeof paginationStyles).toBe('object');
        });

        it('should export navStyles', () => {
            expect(navStyles).toBeDefined();
            expect(typeof navStyles).toBe('object');
        });

        it('should export formStyles', () => {
            expect(formStyles).toBeDefined();
            expect(typeof formStyles).toBe('object');
        });

        it('should export languageStyles', () => {
            expect(languageStyles).toBeDefined();
            expect(typeof languageStyles).toBe('object');
        });

        it('should export homeStyles', () => {
            expect(homeStyles).toBeDefined();
            expect(typeof homeStyles).toBe('object');
        });

        it('should export popupStyles', () => {
            expect(popupStyles).toBeDefined();
            expect(typeof popupStyles).toBe('object');
        });

        it('should export infoPopupStyles', () => {
            expect(infoPopupStyles).toBeDefined();
            expect(typeof infoPopupStyles).toBe('object');
        });
    });

    describe('Style Objects', () => {
        it('should export valid CSS template literals', () => {
            const styles = [
                theme,
                tableStyles,
                gridStyles,
                paginationStyles,
                navStyles,
                formStyles,
                languageStyles,
                homeStyles,
                popupStyles,
                infoPopupStyles
            ];

            styles.forEach((style, index) => {
                expect(style).toBeDefined();
                expect(style.cssText).toBeDefined();
                expect(typeof style.cssText).toBe('string');
                expect(style.cssText.length).toBeGreaterThan(0);
            });
        });

        it('should have valid CSS structure', () => {
            const styles = [
                theme,
                tableStyles,
                gridStyles,
                paginationStyles,
                navStyles,
                formStyles,
                languageStyles,
                homeStyles,
                popupStyles,
                infoPopupStyles
            ];

            styles.forEach((style) => {
                expect(style.cssText).toBeDefined();
                expect(typeof style.cssText).toBe('string');
                expect(style.cssText.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Integration', () => {
        it('should be usable with lit css function', () => {
            expect(() => {
                css`${theme}`;
            }).not.toThrow();

            expect(() => {
                css`${tableStyles}`;
            }).not.toThrow();

            expect(() => {
                css`${formStyles}`;
            }).not.toThrow();
        });

        it('should allow combining multiple styles', () => {
            expect(() => {
                css`
          ${theme}
          ${formStyles}
          ${tableStyles}
        `;
            }).not.toThrow();
        });

        it('should allow creating style arrays', () => {
            expect(() => {
                const combinedStyles = [theme, formStyles, tableStyles];
                expect(combinedStyles).toHaveLength(3);
            }).not.toThrow();
        });
    });
});
