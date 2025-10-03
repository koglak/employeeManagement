import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UpdatePage } from '../../src/pages/update-page';
import { employeeStore } from '../../src/stores/employee-store';
import { Router } from '../../src/router/router';
import type { Employee, EmployeeUpdateData } from '../../src/models/employee';

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
      navigate: vi.fn(),
      getCurrentPath: vi.fn()
    }))
  },
  RouterController: vi.fn().mockImplementation((host) => ({
    hostConnected: vi.fn(),
    hostDisconnected: vi.fn(),
    getCurrentPath: vi.fn(() => '/update/1')
  }))
}));

// Mock the employee store
vi.mock('../../src/stores/employee-store', () => ({
  employeeStore: {
    getById: vi.fn(),
    update: vi.fn(),
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

describe('UpdatePage', () => {
  let element: UpdatePage;
  let mockEmployee: Employee;
  let mockUpdateData: EmployeeUpdateData;

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock employee data
    mockEmployee = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      phone: '+1234567890',
      employmentDate: '2023-01-15',
      birthDate: '1990-05-10'
    };

    mockUpdateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com'
    };

    // Mock the employee store to return the mock employee
    (employeeStore.getById as any).mockReturnValue(mockEmployee);

    // Create element manually for testing
    element = new UpdatePage();
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
      expect(element).toBeInstanceOf(UpdatePage);
    });

    it('should initialize with default state', () => {
      expect((element as any).loading).toBe(false);
      expect((element as any).pageLoading).toBe(false); // Set to false after loadEmployee
      expect((element as any).errorMessage).toBe('');
    });

    it('should load employee on connected', () => {
      expect(employeeStore.getById).toHaveBeenCalledWith('1');
      expect((element as any).employee).toEqual(mockEmployee);
    });

    it('should connect router controller on connected', () => {
      const routerController = (element as any).routerController;
      expect(routerController.hostConnected).toHaveBeenCalled();
    });
  });

  describe('Employee Loading', () => {
    it('should load employee successfully with valid ID', async () => {
      expect((element as any).employee).toEqual(mockEmployee);
      expect((element as any).pageLoading).toBe(false);
    });

    it('should handle employee not found', async () => {
      const mockRouter = { navigate: vi.fn() };
      (Router.getInstance as any).mockReturnValue(mockRouter);
      (employeeStore.getById as any).mockReturnValue(null);

      const newElement = new UpdatePage();
      document.body.appendChild(newElement);
      newElement.connectedCallback();
      await newElement.updateComplete;

      expect(mockRouter.navigate).toHaveBeenCalledWith('/');
      newElement.remove();
    });

    it('should handle invalid route path', async () => {
      const mockRouter = { navigate: vi.fn() };
      (Router.getInstance as any).mockReturnValue(mockRouter);
      
      // Create a new element with different RouterController mock
      const newElement = new UpdatePage();
      
      // Mock the routerController to return invalid path
      (newElement as any).routerController = {
        hostConnected: vi.fn(),
        hostDisconnected: vi.fn(),
        getCurrentPath: vi.fn(() => '/invalid-path')
      };
      
      document.body.appendChild(newElement);
      newElement.connectedCallback();
      await newElement.updateComplete;

      expect(mockRouter.navigate).toHaveBeenCalledWith('/');
      newElement.remove();
    });

    it('should show loading state initially', () => {
      const newElement = new UpdatePage();
      expect((newElement as any).pageLoading).toBe(true);
      newElement.remove();
    });
  });

  describe('Employee Update', () => {
    it('should handle employee submit event', async () => {
      const mockRouter = { navigate: vi.fn() };
      (Router.getInstance as any).mockReturnValue(mockRouter);
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockReturnValue({ ...mockEmployee, ...mockUpdateData });

      const event = new CustomEvent('employee-submit', {
        detail: {
          type: 'update',
          id: '1',
          data: mockUpdateData
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

      expect(employeeStore.update).toHaveBeenCalledWith('1', mockUpdateData);
      expect(mockRouter.navigate).toHaveBeenCalledWith('/');
    });

    it('should show loading state during update', async () => {
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockReturnValue({ ...mockEmployee, ...mockUpdateData });

      // Mock setTimeout to not resolve immediately
      let resolveTimeout: () => void;
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        resolveTimeout = fn;
        return 1 as any;
      });

      const updatePromise = (element as any).updateEmployee('1', mockUpdateData);
      
      // Should be loading
      expect((element as any).loading).toBe(true);

      // Resolve the timeout
      resolveTimeout!();
      await updatePromise;
      
      // Should not be loading anymore
      expect((element as any).loading).toBe(false);
    });

    it('should handle duplicate email error when updating', async () => {
      const existingEmployee = { id: '2', email: 'jane.smith@example.com' };
      (employeeStore.findByEmail as any).mockReturnValue(existingEmployee);

      // Mock the info popup
      const mockInfoPopup = { show: vi.fn() };
      vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

      await (element as any).updateEmployee('1', mockUpdateData);

      expect(employeeStore.findByEmail).toHaveBeenCalledWith('jane.smith@example.com');
      expect(employeeStore.update).not.toHaveBeenCalled();
      expect(mockInfoPopup.show).toHaveBeenCalledWith({
        title: 'duplicateEmployee',
        message: 'employeeExistsMessage: jane.smith@example.com',
        type: 'warning'
      });
    });

    it('should allow email update if it belongs to same employee', async () => {
      const mockRouter = { navigate: vi.fn() };
      (Router.getInstance as any).mockReturnValue(mockRouter);
      
      // Mock findByEmail to return the same employee (same ID)
      (employeeStore.findByEmail as any).mockReturnValue(mockEmployee);
      (employeeStore.update as any).mockReturnValue({ ...mockEmployee, ...mockUpdateData });

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).updateEmployee('1', mockUpdateData);

      expect(employeeStore.update).toHaveBeenCalledWith('1', mockUpdateData);
      expect(mockRouter.navigate).toHaveBeenCalledWith('/');
    });

    it('should handle update failure when employee not found', async () => {
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockReturnValue(null);

      // Mock the info popup
      const mockInfoPopup = { show: vi.fn() };
      vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).updateEmployee('1', mockUpdateData);

      expect((element as any).loading).toBe(false);
      expect((element as any).errorMessage).toBe('Failed to update employee: Employee not found');
      expect(mockInfoPopup.show).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Failed to update employee: Employee not found',
        type: 'error'
      });
    });

    it('should handle update errors', async () => {
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockImplementation(() => {
        throw new Error('Update failed');
      });

      // Mock the info popup
      const mockInfoPopup = { show: vi.fn() };
      vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).updateEmployee('1', mockUpdateData);

      expect((element as any).loading).toBe(false);
      expect((element as any).errorMessage).toBe('Failed to update employee. Please try again.');
      expect(mockInfoPopup.show).toHaveBeenCalledWith({
        title: 'Error',
        message: 'Failed to update employee. Please try again.',
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

    it('should navigate to home on successful update', async () => {
      const mockRouter = { navigate: vi.fn() };
      (Router.getInstance as any).mockReturnValue(mockRouter);
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockReturnValue({ ...mockEmployee, ...mockUpdateData });

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).updateEmployee('1', mockUpdateData);

      expect(mockRouter.navigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Component Lifecycle', () => {
    it('should disconnect router controller on disconnected', () => {
      const routerController = (element as any).routerController;
      
      element.disconnectedCallback();
      
      expect(routerController.hostDisconnected).toHaveBeenCalled();
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
    it('should reset error message when updating employee', async () => {
      (element as any).errorMessage = 'Previous error';
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockReturnValue({ ...mockEmployee, ...mockUpdateData });

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).updateEmployee('1', mockUpdateData);

      expect((element as any).errorMessage).toBe('');
    });

    it('should reset loading state after update completes', async () => {
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockReturnValue({ ...mockEmployee, ...mockUpdateData });

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).updateEmployee('1', mockUpdateData);

      expect((element as any).loading).toBe(false);
    });

    it('should reset loading state after update fails', async () => {
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockImplementation(() => {
        throw new Error('Update failed');
      });

      // Mock the info popup
      const mockInfoPopup = { show: vi.fn() };
      vi.spyOn(element.shadowRoot!, 'querySelector').mockReturnValue(mockInfoPopup as any);

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).updateEmployee('1', mockUpdateData);

      expect((element as any).loading).toBe(false);
    });
  });

  describe('Rendering', () => {
    it('should render loading state when pageLoading is true', async () => {
      (element as any).pageLoading = true;
      await element.updateComplete;

      expect(element.shadowRoot?.textContent).toContain('Loading...');
    });

    it('should render error state when employee is null', async () => {
      (element as any).employee = null;
      (element as any).pageLoading = false;
      await element.updateComplete;

      expect(element.shadowRoot?.textContent).toContain('Employee not found');
    });

    it('should render update form when employee is loaded', async () => {
      (element as any).employee = mockEmployee;
      (element as any).pageLoading = false;
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('employee-form')).toBeTruthy();
      expect(element.shadowRoot?.querySelector('info-popup')).toBeTruthy();
    });
  });

  describe('Event Handling', () => {
    it('should only handle update type events in handleEmployeeSubmit', async () => {
      const event = new CustomEvent('employee-submit', {
        detail: {
          type: 'create', // Not 'update'
          id: '1',
          data: mockUpdateData
        }
      });

      await (element as any).handleEmployeeSubmit(event);

      expect(employeeStore.update).not.toHaveBeenCalled();
    });

    it('should not update without ID in handleEmployeeSubmit', async () => {
      const event = new CustomEvent('employee-submit', {
        detail: {
          type: 'update',
          data: mockUpdateData
          // Missing id
        }
      });

      await (element as any).handleEmployeeSubmit(event);

      expect(employeeStore.update).not.toHaveBeenCalled();
    });

    it('should handle employee-submit event with update type and ID', async () => {
      const mockRouter = { navigate: vi.fn() };
      (Router.getInstance as any).mockReturnValue(mockRouter);
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockReturnValue({ ...mockEmployee, ...mockUpdateData });

      const event = new CustomEvent('employee-submit', {
        detail: {
          type: 'update',
          id: '1',
          data: mockUpdateData
        }
      });

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).handleEmployeeSubmit(event);

      expect(employeeStore.update).toHaveBeenCalledWith('1', mockUpdateData);
    });
  });

  describe('Email Validation', () => {
    it('should allow update when email is not changed', async () => {
      const mockRouter = { navigate: vi.fn() };
      (Router.getInstance as any).mockReturnValue(mockRouter);
      
      const updateDataWithSameEmail = { ...mockUpdateData, email: mockEmployee.email };
      (employeeStore.update as any).mockReturnValue({ ...mockEmployee, ...updateDataWithSameEmail });

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).updateEmployee('1', updateDataWithSameEmail);

      // Should not check for duplicate email since email didn't change
      expect(employeeStore.findByEmail).not.toHaveBeenCalled();
      expect(employeeStore.update).toHaveBeenCalledWith('1', updateDataWithSameEmail);
      expect(mockRouter.navigate).toHaveBeenCalledWith('/');
    });

    it('should check for duplicate email when email is changed', async () => {
      (employeeStore.findByEmail as any).mockReturnValue(null);
      (employeeStore.update as any).mockReturnValue({ ...mockEmployee, ...mockUpdateData });

      // Mock setTimeout to resolve immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
        fn();
        return 1 as any;
      });

      await (element as any).updateEmployee('1', mockUpdateData);

      expect(employeeStore.findByEmail).toHaveBeenCalledWith(mockUpdateData.email);
    });
  });
});
