import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ViewSelector } from '../../src/components/employee/view-selector';

// Import the component
import '../../src/components/employee/view-selector';

describe('ViewSelector', () => {
    let element: ViewSelector;

    beforeEach(() => {
        element = document.createElement('view-selector') as ViewSelector;
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('should render properly', () => {
        expect(element).toBeInstanceOf(ViewSelector);
        expect(element.shadowRoot).toBeTruthy();
    });

    it('should have currentView property', () => {
        element.currentView = 'table';
        expect(element.currentView).toBe('table');
    });

    it('should initialize with table view by default', () => {
        expect(element.currentView).toBe('table');
    });

    it('should emit view-change event when view changes', () => {
        let viewChangeEventDetail: any = null;
        element.addEventListener('view-change', (e: Event) => {
            viewChangeEventDetail = (e as CustomEvent).detail;
        });

        // Call the private change method via reflection
        (element as any).change('grid');

        expect(viewChangeEventDetail).toBeTruthy();
        expect(viewChangeEventDetail.view).toBe('grid');
    });

    it('should switch between table and grid views', () => {
        element.currentView = 'table';
        expect(element.currentView).toBe('table');

        element.currentView = 'grid';
        expect(element.currentView).toBe('grid');
    });

    it('should update view when property changes', async () => {
        element.currentView = 'grid';
        await element.updateComplete;
        expect(element.currentView).toBe('grid');
    });
});
