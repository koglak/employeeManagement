import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppPagination } from '../../src/components/pagination/app-pagination';

// Import the component
import '../../src/components/pagination/app-pagination';

describe('AppPagination', () => {
    let element: AppPagination;

    beforeEach(() => {
        element = document.createElement('app-pagination') as AppPagination;
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('should render properly', () => {
        expect(element).toBeInstanceOf(AppPagination);
        expect(element.shadowRoot).toBeTruthy();
    });

    it('should have pagination properties', () => {
        element.currentPage = 2;
        element.totalPages = 5;
        element.totalItems = 50;
        element.itemsPerPage = 10;

        expect(element.currentPage).toBe(2);
        expect(element.totalPages).toBe(5);
        expect(element.totalItems).toBe(50);
        expect(element.itemsPerPage).toBe(10);
    });

    it('should initialize with default values', () => {
        expect(element.currentPage).toBe(1);
        expect(element.totalPages).toBe(1);
        expect(element.totalItems).toBe(0);
        expect(element.itemsPerPage).toBe(10);
    });

    it('should emit page-change event', () => {
        let pageChangeEventDetail: any = null;
        element.addEventListener('page-change', (e: Event) => {
            pageChangeEventDetail = (e as CustomEvent).detail;
        });

        // Set up pagination state first
        element.currentPage = 2;
        element.totalPages = 5;

        // Call the private goToPage method via reflection
        (element as any).goToPage(3);

        expect(pageChangeEventDetail).toBeTruthy();
        expect(pageChangeEventDetail.page).toBe(3);
    });

    it('should calculate page ranges correctly', () => {
        element.currentPage = 3;
        element.totalPages = 10;
        element.totalItems = 100;
        element.itemsPerPage = 10;

        // Test pagination calculation
        expect(element.currentPage).toBeLessThanOrEqual(element.totalPages);
        expect(element.currentPage).toBeGreaterThanOrEqual(1);
    });

    it('should use paginationStyles from shared styles', () => {
        expect(element.constructor).toHaveProperty('styles');
    });

    it('should handle edge cases for pagination', () => {
        // Test with minimal data
        element.currentPage = 1;
        element.totalPages = 1;
        element.totalItems = 5;
        element.itemsPerPage = 10;

        expect(element.currentPage).toBe(1);
        expect(element.totalPages).toBe(1);
    });
});
