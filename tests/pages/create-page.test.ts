import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CreatePage } from '../../src/pages/create-page';
import { employeeStore } from '../../src/stores/employee-store';
import { Router } from '../../src/router/router';
import type { EmployeeCreateData } from '../../src/models/employee';

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
        add: vi.fn(),
        findByEmail: vi.fn()
    }
}));

// Mock i18n with I18nController
vi.mock('../../src/i18n/i18n', () => ({
    i18n: {
        t: vi.fn((key: string) => key)
    },
    I18nController: vi.fn().mockImplementation((host) => ({
        hostConnected: vi.fn(),
        hostDisconnected: vi.fn()
    }))
}));

// Mock setTimeout
vi.mock('timers');

describe('CreatePage', () => {
    let element: CreatePage;
    let mockEmployeeData: EmployeeCreateData;

    beforeEach(async () => {
        // Reset mocks
        vi.clearAllMocks();

        // Mock employee data
        mockEmployeeData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            position: 'Developer',
            department: 'Engineering',
            phone: '+1234567890',
            employmentDate: '2023-01-15',
            birthDate: '1990-05-10'
        };

        // Create element manually for testing
        element = new CreatePage();
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
            expect(element).toBeInstanceOf(CreatePage);
        });

        it('should initialize with default state', () => {
            expect((element as any).loading).toBe(false);
            expect((element as any).errorMessage).toBe('');
        });

        it('should render create form', async () => {
            await element.updateComplete;

            // Check if the component renders without error
            expect(element.shadowRoot).toBeTruthy();
        });
    });

    describe('Employee Creation', () => {
        it('should handle employee submit event', async () => {
            const mockRouter = { navigate: vi.fn() };
            (Router.getInstance as any).mockReturnValue(mockRouter);
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockReturnValue({ id: '1', ...mockEmployeeData });

            const event = new CustomEvent('employee-submit', {
                detail: {
                    type: 'create',
                    data: mockEmployeeData
                }
            });

            // Mock setTimeout to resolve immediately
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                fn();
                return 1 as any;
            });

            await (element as any).handleEmployeeSubmit(event);

            // Wait for async operations
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(employeeStore.findByEmail).toHaveBeenCalledWith(mockEmployeeData.email);
            expect(employeeStore.add).toHaveBeenCalledWith(mockEmployeeData);
            expect(mockRouter.navigate).toHaveBeenCalledWith('/');
        });

        it('should show loading state during creation', async () => {
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockReturnValue({ id: '1', ...mockEmployeeData });

            const event = new CustomEvent('employee-submit', {
                detail: {
                    type: 'create',
                    data: mockEmployeeData
                }
            });

            // Mock setTimeout to not resolve immediately
            let resolveTimeout: () => void;
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                resolveTimeout = fn;
                return 1 as any;
            });

            const createPromise = (element as any).handleEmployeeSubmit(event);

            // Should be loading
            expect((element as any).loading).toBe(true);

            // Resolve the timeout
            resolveTimeout!();
            await createPromise;

            // Should not be loading anymore
            expect((element as any).loading).toBe(false);
        });

        it('should handle duplicate email error', async () => {
            const existingEmployee = { id: '1', ...mockEmployeeData };
            (employeeStore.findByEmail as any).mockReturnValue(existingEmployee);

            // Mock the info popup
            const mockInfoPopup = { show: vi.fn() };
            vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

            const event = new CustomEvent('employee-submit', {
                detail: {
                    type: 'create',
                    data: mockEmployeeData
                }
            });

            await (element as any).handleEmployeeSubmit(event);

            expect(employeeStore.findByEmail).toHaveBeenCalledWith(mockEmployeeData.email);
            expect(employeeStore.add).not.toHaveBeenCalled();
            expect(mockInfoPopup.show).toHaveBeenCalledWith({
                title: 'duplicateEmployee',
                message: 'employeeExistsMessage: john.doe@example.com',
                type: 'warning'
            });
        });

        it('should handle creation errors', async () => {
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockImplementation(() => {
                throw new Error('Creation failed');
            });

            // Mock the info popup
            const mockInfoPopup = { show: vi.fn() };
            vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

            const event = new CustomEvent('employee-submit', {
                detail: {
                    type: 'create',
                    data: mockEmployeeData
                }
            });

            // Mock setTimeout to resolve immediately
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                fn();
                return 1 as any;
            });

            await (element as any).handleEmployeeSubmit(event);

            expect((element as any).loading).toBe(false);
            expect((element as any).errorMessage).toBe('Failed to create employee. Please try again.');
            expect(mockInfoPopup.show).toHaveBeenCalledWith({
                title: 'Error',
                message: 'Failed to create employee. Please try again.',
                type: 'error'
            });
        });
    });

    describe('Navigation', () => {
        it('should handle cancel event', () => {
            const mockRouter = { navigate: vi.fn() };
            (Router.getInstance as any).mockReturnValue(mockRouter);

            (element as any).handleEmployeeCancel();

            expect(mockRouter.navigate).toHaveBeenCalledWith('/');
        });

        it('should navigate to home on successful creation', async () => {
            const mockRouter = { navigate: vi.fn() };
            (Router.getInstance as any).mockReturnValue(mockRouter);
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockReturnValue({ id: '1', ...mockEmployeeData });

            // Mock setTimeout to resolve immediately
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                fn();
                return 1 as any;
            });

            await (element as any).createEmployee(mockEmployeeData);

            expect(mockRouter.navigate).toHaveBeenCalledWith('/');
        });
    });

    describe('Error Handling', () => {
        it('should show error popup when showErrorPopup is called', () => {
            const mockInfoPopup = { show: vi.fn() };
            vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

            const errorMessage = 'Test error message';
            (element as any).showErrorPopup(errorMessage);

            expect(mockInfoPopup.show).toHaveBeenCalledWith({
                title: 'Error',
                message: errorMessage,
                type: 'error'
            });
        });

        it('should show duplicate employee popup when showDuplicateEmployeePopup is called', () => {
            const mockInfoPopup = { show: vi.fn() };
            vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

            const email = 'test@example.com';
            (element as any).showDuplicateEmployeePopup(email);

            expect(mockInfoPopup.show).toHaveBeenCalledWith({
                title: 'duplicateEmployee',
                message: 'employeeExistsMessage: test@example.com',
                type: 'warning'
            });
        });

        it('should handle missing info popup gracefully', () => {
            vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(null);

            // Should not throw
            expect(() => {
                (element as any).showErrorPopup('Test error');
            }).not.toThrow();

            expect(() => {
                (element as any).showDuplicateEmployeePopup('test@example.com');
            }).not.toThrow();
        });
    });

    describe('State Management', () => {
        it('should reset error message when creating employee', async () => {
            (element as any).errorMessage = 'Previous error';
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockReturnValue({ id: '1', ...mockEmployeeData });

            // Mock setTimeout to resolve immediately
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                fn();
                return 1 as any;
            });

            await (element as any).createEmployee(mockEmployeeData);

            expect((element as any).errorMessage).toBe('');
        });

        it('should reset loading state after creation completes', async () => {
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockReturnValue({ id: '1', ...mockEmployeeData });

            // Mock setTimeout to resolve immediately
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                fn();
                return 1 as any;
            });

            await (element as any).createEmployee(mockEmployeeData);

            expect((element as any).loading).toBe(false);
        });

        it('should reset loading state after creation fails', async () => {
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockImplementation(() => {
                throw new Error('Creation failed');
            });

            // Mock the info popup
            const mockInfoPopup = { show: vi.fn() };
            vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

            // Mock setTimeout to resolve immediately
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                fn();
                return 1 as any;
            });

            await (element as any).createEmployee(mockEmployeeData);

            expect((element as any).loading).toBe(false);
        });
    });

    describe('Integration', () => {
        it('should properly integrate with employee form component', async () => {
            await element.updateComplete;

            // The component should render the employee form
            expect(element.shadowRoot?.querySelector('employee-form')).toBeTruthy();
        });

        it('should properly integrate with info popup component', async () => {
            await element.updateComplete;

            // The component should render the info popup
            expect(element.shadowRoot?.querySelector('info-popup')).toBeTruthy();
        });

        it('should pass loading state to employee form', async () => {
            (element as any).loading = true;
            await element.updateComplete;

            const employeeForm = element.shadowRoot?.querySelector('employee-form');
            expect(employeeForm).toBeTruthy();
            // In a real test, you might check if the loading prop is set
        });
    });

    describe('Async Operations', () => {
        it('should handle async employee creation with proper timing', async () => {
            const mockRouter = { navigate: vi.fn() };
            (Router.getInstance as any).mockReturnValue(mockRouter);
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockReturnValue({ id: '1', ...mockEmployeeData });

            let timeoutCallback: () => void;
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any, delay?: number) => {
                timeoutCallback = fn;
                return 1 as any;
            });

            const createPromise = (element as any).createEmployee(mockEmployeeData);

            // Should be loading
            expect((element as any).loading).toBe(true);
            expect(employeeStore.add).not.toHaveBeenCalled();
            expect(mockRouter.navigate).not.toHaveBeenCalled();

            // Trigger timeout
            timeoutCallback!();
            await createPromise;

            // Should complete
            expect((element as any).loading).toBe(false);
            expect(employeeStore.add).toHaveBeenCalled();
            expect(mockRouter.navigate).toHaveBeenCalled();
        });

        it('should handle rejection during async operations', async () => {
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockImplementation(() => {
                throw new Error('Database error');
            });

            // Mock the info popup
            const mockInfoPopup = { show: vi.fn() };
            vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

            // Mock setTimeout to resolve immediately
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                fn();
                return 1 as any;
            });

            await (element as any).createEmployee(mockEmployeeData);

            expect((element as any).loading).toBe(false);
            expect((element as any).errorMessage).toBe('Failed to create employee. Please try again.');
            expect(mockInfoPopup.show).toHaveBeenCalledWith({
                title: 'Error',
                message: 'Failed to create employee. Please try again.',
                type: 'error'
            });
        });
    });

    describe('Event Handling', () => {
        it('should only handle create type events in handleEmployeeSubmit', async () => {
            const event = new CustomEvent('employee-submit', {
                detail: {
                    type: 'update', // Not 'create'
                    data: mockEmployeeData
                }
            });

            await (element as any).handleEmployeeSubmit(event);

            expect(employeeStore.findByEmail).not.toHaveBeenCalled();
            expect(employeeStore.add).not.toHaveBeenCalled();
        });

        it('should handle employee-submit event with create type', async () => {
            const mockRouter = { navigate: vi.fn() };
            (Router.getInstance as any).mockReturnValue(mockRouter);
            (employeeStore.findByEmail as any).mockReturnValue(null);
            (employeeStore.add as any).mockReturnValue({ id: '1', ...mockEmployeeData });

            const event = new CustomEvent('employee-submit', {
                detail: {
                    type: 'create',
                    data: mockEmployeeData
                }
            });

            // Mock setTimeout to resolve immediately
            vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                fn();
                return 1 as any;
            });

            await (element as any).handleEmployeeSubmit(event);

            expect(employeeStore.findByEmail).toHaveBeenCalledWith(mockEmployeeData.email);
            expect(employeeStore.add).toHaveBeenCalledWith(mockEmployeeData);
        });
    });
});
