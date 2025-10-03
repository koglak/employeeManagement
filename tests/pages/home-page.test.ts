import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HomePage } from '../../src/pages/home-page';
import { employeeStore } from '../../src/stores/employee-store';
import { Router } from '../../src/router/router';
import type { Employee } from '../../src/models/employee';

// Mock custom elements to avoid registration errors
global.customElements = {
    define: vi.fn(),
    get: vi.fn(),
    upgrade: vi.fn(),
    whenDefined: vi.fn(() => Promise.resolve()),
} as any;

// Mock the router
vi.mock('../../src/router/router', () => ({
    Router: {
        getInstance: vi.fn(() => ({
            navigate: vi.fn()
        }))
    }
}));

// Mock the employee store
vi.mock('../../src/stores/employee-store', () => ({
    employeeStore: {
        getAllEmployees: vi.fn(),
        delete: vi.fn()
    }
}));

// Mock i18n
vi.mock('../../src/i18n/i18n', () => ({
    i18n: {
        t: vi.fn((key: string) => key)
    },
    I18nController: vi.fn().mockImplementation(() => ({
        hostConnected: vi.fn(),
        hostDisconnected: vi.fn()
    }))
}));

describe('HomePage', () => {
    let element: HomePage;
    let mockEmployees: Employee[];

    beforeEach(async () => {
        // Reset mocks
        vi.clearAllMocks();

        // Mock employee data
        mockEmployees = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                position: 'Developer',
                department: 'Engineering',
                phone: '+1234567890',
                employmentDate: '2023-01-15',
                birthDate: '1990-05-10'
            },
            {
                id: '2',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                position: 'Designer',
                department: 'Design',
                phone: '+1234567891',
                employmentDate: '2023-02-20',
                birthDate: '1992-08-15'
            }
        ];

        (employeeStore.getAllEmployees as any).mockResolvedValue(mockEmployees);

        // Create element manually for testing
        element = new HomePage();
        document.body.appendChild(element);

        // Trigger connectedCallback manually
        element.connectedCallback();
        await element.updateComplete;
    });

    afterEach(() => {
        element?.remove();
    });

    describe('Component Initialization', () => {
        it('should be defined', () => {
            expect(element).toBeDefined();
            expect(element).toBeInstanceOf(HomePage);
        });

        it('should load employees on connected', async () => {
            expect(employeeStore.getAllEmployees).toHaveBeenCalled();
        });

        it('should initialize with default state', () => {
            expect((element as any).view).toBe('table');
            expect((element as any).currentPage).toBe(1);
            expect((element as any).searchTerm).toBe('');
            expect((element as any).showDeleteConfirm).toBe(false);
            expect((element as any).employeeToDelete).toBeNull();
        });
    });

    describe('Employee Loading', () => {
        it('should display employees after loading', async () => {
            await element.updateComplete;
            expect((element as any).employees).toEqual(mockEmployees);
        });

        it('should handle empty employee list', async () => {
            (employeeStore.getAllEmployees as any).mockResolvedValue([]);

            const newElement = new HomePage();
            document.body.appendChild(newElement);
            newElement.connectedCallback();
            await newElement.updateComplete;

            expect((newElement as any).employees).toEqual([]);
            newElement.remove();
        });
    });

    describe('View Mode Toggle', () => {
        it('should start with table view', () => {
            expect((element as any).view).toBe('table');
        });

        it('should toggle to grid view', async () => {
            const event = new CustomEvent('view-change', {
                detail: { view: 'grid' }
            });

            (element as any).handleViewChangeEvent(event);
            await element.updateComplete;

            expect((element as any).view).toBe('grid');
        });

        it('should use different page sizes for different views', () => {
            (element as any).view = 'table';
            expect((element as any).currentPageSize).toBe(10);

            (element as any).view = 'grid';
            expect((element as any).currentPageSize).toBe(4);
        });
    });

    describe('Search Functionality', () => {
        it('should filter employees by search term', () => {
            (element as any).searchTerm = 'john';
            const filtered = (element as any).filteredEmployees;

            expect(filtered.length).toBe(1);
            expect(filtered[0].firstName.toLowerCase()).toContain('john');
        });

        it('should return all employees when search is empty', () => {
            (element as any).searchTerm = '';
            const filtered = (element as any).filteredEmployees;

            expect(filtered.length).toBe(mockEmployees.length);
        });

        it('should be case insensitive', () => {
            (element as any).searchTerm = 'JANE';
            const filtered = (element as any).filteredEmployees;

            expect(filtered.length).toBe(1);
            expect(filtered[0].firstName.toLowerCase()).toBe('jane');
        });
    });

    describe('Employee Actions', () => {
        it('should handle edit employee action', async () => {
            const mockRouter = { navigate: vi.fn() };
            (Router.getInstance as any).mockReturnValue(mockRouter);

            const event = new CustomEvent('edit-employee', {
                detail: { employee: mockEmployees[0] }
            });

            (element as any).handleEditEmployee(event);

            expect(mockRouter.navigate).toHaveBeenCalledWith('/update/1');
        });

        it('should show delete confirmation', async () => {
            const event = new CustomEvent('delete-employee', {
                detail: { employee: mockEmployees[0] }
            });

            (element as any).handleDeleteEmployee(event);
            await element.updateComplete;

            expect((element as any).showDeleteConfirm).toBe(true);
            expect((element as any).employeeToDelete).toBe(mockEmployees[0]);
        });
    });

    describe('Delete Confirmation', () => {
        it('should confirm delete and remove employee', async () => {
            (element as any).showDeleteConfirm = true;
            (element as any).employeeToDelete = mockEmployees[0];

            (employeeStore.delete as any).mockResolvedValue(true);

            await (element as any).confirmDelete();

            expect(employeeStore.delete).toHaveBeenCalledWith('1');
            expect((element as any).showDeleteConfirm).toBe(false);
            expect((element as any).employeeToDelete).toBeNull();
        });

        it('should cancel delete', async () => {
            (element as any).showDeleteConfirm = true;
            (element as any).employeeToDelete = mockEmployees[0];

            (element as any).hideDeleteConfirm();

            expect(employeeStore.delete).not.toHaveBeenCalled();
            expect((element as any).showDeleteConfirm).toBe(false);
            expect((element as any).employeeToDelete).toBeNull();
        });
    });
});
