import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { employeeStore, EmployeeController } from '../../src/stores/employee-store';
import type { Employee, EmployeeCreateData, EmployeeUpdateData } from '../../src/models/employee';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Employee Store', () => {
    const mockEmployeeData: EmployeeCreateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+90 555 123 45 67',
        department: 'Engineering',
        position: 'Senior Developer',
        employmentDate: '2020-01-01',
        birthDate: '1990-05-15'
    };

    beforeEach(() => {
        // Clear the store and reset mocks
        vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
        localStorageMock.setItem.mockImplementation(() => { }); // Don't throw by default
        employeeStore.clear();
    }); afterEach(() => {
        employeeStore.clear();
    });

    describe('Basic Operations', () => {
        it('should initialize with empty employees list', () => {
            expect(employeeStore.employees).toEqual([]);
            expect(employeeStore.count).toBe(0);
        });

        it('should add a new employee', () => {
            const employee = employeeStore.add(mockEmployeeData);

            expect(employee).toHaveProperty('id');
            expect(employee.firstName).toBe(mockEmployeeData.firstName);
            expect(employee.lastName).toBe(mockEmployeeData.lastName);
            expect(employeeStore.count).toBe(1);
        });

        it('should generate unique IDs for employees', () => {
            const emp1 = employeeStore.add(mockEmployeeData);
            const emp2 = employeeStore.add(mockEmployeeData);

            expect(emp1.id).not.toBe(emp2.id);
            expect(emp1.id).toMatch(/^emp_\d+_[a-z0-9]+$/);
        });

        it('should get employee by ID', () => {
            const employee = employeeStore.add(mockEmployeeData);
            const retrieved = employeeStore.getById(employee.id);

            expect(retrieved).toEqual(employee);
        });

        it('should return null for non-existent employee ID', () => {
            const result = employeeStore.getById('non-existent-id');
            expect(result).toBeNull();
        });

        it('should update an existing employee', () => {
            const employee = employeeStore.add(mockEmployeeData);
            const updateData: EmployeeUpdateData = {
                firstName: 'Jane',
                position: 'Tech Lead'
            };

            const updated = employeeStore.update(employee.id, updateData);

            expect(updated).not.toBeNull();
            expect(updated?.firstName).toBe('Jane');
            expect(updated?.position).toBe('Tech Lead');
            expect(updated?.lastName).toBe(mockEmployeeData.lastName); // unchanged
        });

        it('should return null when updating non-existent employee', () => {
            const result = employeeStore.update('non-existent-id', { firstName: 'Jane' });
            expect(result).toBeNull();
        });

        it('should delete an employee', () => {
            const employee = employeeStore.add(mockEmployeeData);
            expect(employeeStore.count).toBe(1);

            const deleted = employeeStore.delete(employee.id);

            expect(deleted).toBe(true);
            expect(employeeStore.count).toBe(0);
            expect(employeeStore.getById(employee.id)).toBeNull();
        });

        it('should return false when deleting non-existent employee', () => {
            const result = employeeStore.delete('non-existent-id');
            expect(result).toBe(false);
        });
    });

    describe('Search and Filter Operations', () => {
        beforeEach(() => {
            employeeStore.add(mockEmployeeData);
            employeeStore.add({
                ...mockEmployeeData,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@company.com',
                department: 'Design',
                position: 'UI Designer'
            });
            employeeStore.add({
                ...mockEmployeeData,
                firstName: 'Bob',
                lastName: 'Wilson',
                email: 'bob.wilson@company.com',
                department: 'Engineering',
                position: 'Backend Developer'
            });
        });

        it('should search employees by first name', () => {
            const results = employeeStore.search('John');
            expect(results).toHaveLength(1);
            expect(results[0].firstName).toBe('John');
        });

        it('should search employees by last name', () => {
            const results = employeeStore.search('Smith');
            expect(results).toHaveLength(1);
            expect(results[0].lastName).toBe('Smith');
        });

        it('should search employees by email', () => {
            const results = employeeStore.search('jane.smith');
            expect(results).toHaveLength(1);
            expect(results[0].email).toContain('jane.smith');
        });

        it('should search employees by department', () => {
            const results = employeeStore.search('Engineering');
            expect(results).toHaveLength(2);
        });

        it('should search employees by position', () => {
            const results = employeeStore.search('Designer');
            expect(results).toHaveLength(1);
            expect(results[0].position).toBe('UI Designer');
        });

        it('should return empty array for no matches', () => {
            const results = employeeStore.search('NonExistent');
            expect(results).toHaveLength(0);
        });

        it('should filter employees by department', () => {
            const engineeringEmployees = employeeStore.filterByDepartment('Engineering');
            expect(engineeringEmployees).toHaveLength(2);

            const designEmployees = employeeStore.filterByDepartment('Design');
            expect(designEmployees).toHaveLength(1);
        });

        it('should get list of departments', () => {
            const departments = employeeStore.getDepartments();
            expect(departments).toContain('Engineering');
            expect(departments).toContain('Design');
            expect(departments).toHaveLength(2);
            expect(departments).toEqual(departments.sort()); // should be sorted
        });
    });

    describe('Async Operations', () => {
        it('should return all employees as promise', async () => {
            employeeStore.add(mockEmployeeData);
            const employees = await employeeStore.getAllEmployees();

            expect(employees).toHaveLength(1);
            expect(employees[0].firstName).toBe(mockEmployeeData.firstName);
        });
    });

    describe('Local Storage Integration', () => {
        it('should save to localStorage when adding employee', () => {
            employeeStore.add(mockEmployeeData);

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'employees',
                expect.stringContaining(mockEmployeeData.firstName)
            );
        });

        it('should save to localStorage when updating employee', () => {
            const employee = employeeStore.add(mockEmployeeData);
            vi.clearAllMocks(); // Clear the add call

            employeeStore.update(employee.id, { firstName: 'Jane' });

            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('should save to localStorage when deleting employee', () => {
            const employee = employeeStore.add(mockEmployeeData);
            vi.clearAllMocks(); // Clear the add call

            employeeStore.delete(employee.id);

            expect(localStorageMock.setItem).toHaveBeenCalled();
        });

        it('should handle localStorage errors gracefully', () => {
            localStorageMock.setItem.mockImplementation(() => {
                throw new Error('Storage quota exceeded');
            });

            // Should not throw an error
            expect(() => employeeStore.add(mockEmployeeData)).not.toThrow();
        });
    });

    describe('Reactive Pattern', () => {
        it('should notify subscribers on changes', () => {
            const callback = vi.fn();
            const unsubscribe = employeeStore.subscribe(callback);

            employeeStore.add(mockEmployeeData);
            expect(callback).toHaveBeenCalledTimes(1);

            employeeStore.update(employeeStore.employees[0].id, { firstName: 'Jane' });
            expect(callback).toHaveBeenCalledTimes(2);

            employeeStore.delete(employeeStore.employees[0].id);
            expect(callback).toHaveBeenCalledTimes(3);

            unsubscribe();
        });

        it('should allow unsubscribing from notifications', () => {
            const callback = vi.fn();
            const unsubscribe = employeeStore.subscribe(callback);

            employeeStore.add(mockEmployeeData);
            expect(callback).toHaveBeenCalledTimes(1);

            unsubscribe();

            employeeStore.add(mockEmployeeData);
            expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
        });
    });

    describe('EmployeeController', () => {
        it('should create controller with host', () => {
            const mockHost = {
                addController: vi.fn(),
                removeController: vi.fn(),
                requestUpdate: vi.fn(),
                updateComplete: Promise.resolve(true)
            };

            const controller = new EmployeeController(mockHost);
            expect(mockHost.addController).toHaveBeenCalledWith(controller);
        });

        it('should subscribe to store on host connected', () => {
            const mockHost = {
                addController: vi.fn(),
                removeController: vi.fn(),
                requestUpdate: vi.fn(),
                updateComplete: Promise.resolve(true)
            };

            const controller = new EmployeeController(mockHost);
            controller.hostConnected();

            // Trigger a store change
            employeeStore.add(mockEmployeeData);

            expect(mockHost.requestUpdate).toHaveBeenCalled();
        });

        it('should unsubscribe on host disconnected', () => {
            const mockHost = {
                addController: vi.fn(),
                removeController: vi.fn(),
                requestUpdate: vi.fn(),
                updateComplete: Promise.resolve(true)
            };

            const controller = new EmployeeController(mockHost);
            controller.hostConnected();
            controller.hostDisconnected();

            // Trigger a store change
            employeeStore.add(mockEmployeeData);

            // Should not be called after disconnect
            expect(mockHost.requestUpdate).toHaveBeenCalledTimes(0);
        });
    });

    describe('Data Validation', () => {
        it('should preserve data integrity', () => {
            const employee = employeeStore.add(mockEmployeeData);
            const retrieved = employeeStore.getById(employee.id);

            expect(retrieved).toEqual(employee);
            expect(retrieved?.id).toBeTruthy();
            expect(retrieved?.firstName).toBe(mockEmployeeData.firstName);
        });

        it('should return immutable employee arrays', () => {
            employeeStore.add(mockEmployeeData);
            const employees1 = employeeStore.employees;
            const employees2 = employeeStore.employees;

            expect(employees1).not.toBe(employees2); // Different array instances
            expect(employees1).toEqual(employees2); // Same content
        });
    });
});
