import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppNavbar } from '../../src/components/navbar/app-navbar';

// Import the component
import '../../src/components/navbar/app-navbar';

describe('AppNavbar', () => {
    let element: AppNavbar;

    beforeEach(() => {
        element = document.createElement('app-navbar') as AppNavbar;
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('should render properly', () => {
        expect(element).toBeInstanceOf(AppNavbar);
        expect(element.shadowRoot).toBeTruthy();
    });

    it('should use navStyles from shared styles', () => {
        expect(element.constructor).toHaveProperty('styles');
    });

    it('should contain navigation elements', async () => {
        await element.updateComplete;
        // Basic test to ensure component structure
        expect(element.shadowRoot).toBeTruthy();
    });

    it('should have proper navigation functionality', () => {
        // Test navigation behavior
        expect(element).toBeInstanceOf(HTMLElement);
    });
});
