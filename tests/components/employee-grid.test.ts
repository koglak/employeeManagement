import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EmployeeGrid } from '../../src/components/employee/employee-grid';
import type { Employee } from '../../src/models/employee';

// Import the component
import '../../src/components/employee/employee-grid';

describe('EmployeeGrid', () => {
    let element: EmployeeGrid;
    const mockEmployees: Employee[] = [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            phone: '+1234567890',
            department: 'Engineering',
            position: 'Senior Developer',
            employmentDate: '2020-01-01',
            birthDate: '1990-05-15'
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@company.com',
            phone: '+1234567891',
            department: 'Design',
            position: 'UI Designer',
            employmentDate: '2021-03-15',
            birthDate: '1992-08-20'
        }
    ];

    beforeEach(() => {
        element = document.createElement('employee-grid') as EmployeeGrid;
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('should render properly', () => {
        expect(element).toBeInstanceOf(EmployeeGrid);
        expect(element.shadowRoot).toBeTruthy();
    });

    it('should have employees property', () => {
        element.employees = mockEmployees;
        expect(element.employees).toEqual(mockEmployees);
    });

    it('should initialize with empty employees array', () => {
        expect(element.employees).toEqual([]);
    });

    it('should update when employees property changes', async () => {
        element.employees = mockEmployees;
        await element.updateComplete;
        expect(element.employees.length).toBe(2);
    });

    it('should emit edit event when edit method called', () => {
        let editEventDetail: any = null;
        element.addEventListener('edit-employee', (e: Event) => {
            editEventDetail = (e as CustomEvent).detail;
        });

        // Call the private edit method via reflection
        (element as any).edit(mockEmployees[0]);

        expect(editEventDetail).toBeTruthy();
        expect(editEventDetail.employee.id).toBe('1');
    });

    it('should emit delete event when del method called', () => {
        let deleteEventDetail: any = null;
        element.addEventListener('delete-employee', (e: Event) => {
            deleteEventDetail = (e as CustomEvent).detail;
        });

        // Call the private del method via reflection
        (element as any).del(mockEmployees[0]);

        expect(deleteEventDetail).toBeTruthy();
        expect(deleteEventDetail.employee.id).toBe('1');
    });

    it('should use gridStyles from shared styles', () => {
        expect(element.constructor).toHaveProperty('styles');
    });
});
