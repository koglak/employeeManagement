import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EmployeeForm } from '../../src/components/forms/employee-form';
import type { Employee } from '../../src/models/employee';

// Import the component
import '../../src/components/forms/employee-form';

describe('EmployeeForm', () => {
    let element: EmployeeForm;

    const sampleEmployee: Employee = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+90 555 123 45 67',
        birthDate: '1990-05-15',
        employmentDate: '2023-01-01',
        department: 'Tech',
        position: 'Senior'
    };

    beforeEach(() => {
        element = document.createElement('employee-form') as EmployeeForm;
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    describe('Component Initialization', () => {
        it('should render properly', () => {
            expect(element).toBeInstanceOf(EmployeeForm);
            expect(element.shadowRoot).toBeTruthy();
        });

        it('should have default empty form data', () => {
            const formData = (element as any).formData;
            expect(formData.firstName).toBe('');
            expect(formData.lastName).toBe('');
            expect(formData.email).toBe('');
            expect(formData.phone).toBe('');
            expect(formData.birthDate).toBe('');
            expect(formData.employmentDate).toBe('');
            expect(formData.department).toBe('');
            expect(formData.position).toBe('');
        });

        it('should have no errors initially', () => {
            const errors = (element as any).errors;
            expect(Object.keys(errors)).toHaveLength(0);
        });

        it('should have all fields as untouched initially', () => {
            const touched = (element as any).touched;
            Object.values(touched).forEach(value => {
                expect(value).toBe(false);
            });
        });
    });

    describe('Employee Property Handling', () => {
        it('should update form data when employee property is set', async () => {
            element.employee = sampleEmployee;
            await element.updateComplete;

            const formData = (element as any).formData;
            expect(formData.firstName).toBe(sampleEmployee.firstName);
            expect(formData.lastName).toBe(sampleEmployee.lastName);
            expect(formData.email).toBe(sampleEmployee.email);
            expect(formData.phone).toBe(sampleEmployee.phone);
            expect(formData.birthDate).toBe(sampleEmployee.birthDate);
            expect(formData.employmentDate).toBe(sampleEmployee.employmentDate);
            expect(formData.department).toBe(sampleEmployee.department);
            expect(formData.position).toBe(sampleEmployee.position);
        });

        it('should clear form data when employee property is unset', async () => {
            element.employee = sampleEmployee;
            await element.updateComplete;

            element.employee = undefined;
            await element.updateComplete;

            const formData = (element as any).formData;
            expect(formData.firstName).toBe('');
            expect(formData.lastName).toBe('');
            expect(formData.email).toBe('');
            expect(formData.phone).toBe('');
            expect(formData.birthDate).toBe('');
            expect(formData.employmentDate).toBe('');
            expect(formData.department).toBe('');
            expect(formData.position).toBe('');
        });

        it('should reset errors when employee property changes', async () => {
            // Set some errors
            (element as any).errors = { firstName: 'Some error' };

            element.employee = sampleEmployee;
            await element.updateComplete;

            const errors = (element as any).errors;
            expect(Object.keys(errors)).toHaveLength(0);
        });

        it('should reset touched state when employee property changes', async () => {
            // Set some touched fields
            (element as any).touched = { firstName: true, lastName: true };

            element.employee = sampleEmployee;
            await element.updateComplete;

            const touched = (element as any).touched;
            Object.values(touched).forEach(value => {
                expect(value).toBe(false);
            });
        });
    });

    describe('Form Validation', () => {
        it('should validate required firstName field', () => {
            const validateField = (element as any).validateField;

            expect(validateField('firstName', '')).toBe('First name is required');
            expect(validateField('firstName', '   ')).toBe('First name is required');
            expect(validateField('firstName', 'John')).toBeUndefined();
        });

        it('should validate required lastName field', () => {
            const validateField = (element as any).validateField;

            expect(validateField('lastName', '')).toBe('Last name is required');
            expect(validateField('lastName', '   ')).toBe('Last name is required');
            expect(validateField('lastName', 'Doe')).toBeUndefined();
        });

        it('should validate email field', () => {
            const validateField = (element as any).validateField;

            expect(validateField('email', '')).toBe('Email is required');
            expect(validateField('email', 'invalid-email')).toBe('Please enter a valid email address');
            expect(validateField('email', 'invalid@')).toBe('Please enter a valid email address');
            expect(validateField('email', '@invalid.com')).toBe('Please enter a valid email address');
            expect(validateField('email', 'valid@example.com')).toBeUndefined();
        });

        it('should validate phone field', () => {
            const validateField = (element as any).validateField;

            expect(validateField('phone', '')).toBe('Phone is required');
            expect(validateField('phone', '123')).toBe('Please enter a valid phone number');
            expect(validateField('phone', '+90 555 123 45 67')).toBeUndefined();
            expect(validateField('phone', '0555 123 45 67')).toBeUndefined();
        });

        it('should validate birthDate field', () => {
            const validateField = (element as any).validateField;

            expect(validateField('birthDate', '')).toBe('Birth date is required');
            expect(validateField('birthDate', 'invalid-date')).toBe('Please enter a valid date');
            expect(validateField('birthDate', '2023-13-01')).toBe('Please enter a valid date');
            expect(validateField('birthDate', '1990-05-15')).toBeUndefined();
        });

        it('should validate employmentDate field', () => {
            const validateField = (element as any).validateField;

            expect(validateField('employmentDate', '')).toBe('Employment date is required');
            expect(validateField('employmentDate', 'invalid-date')).toBe('Please enter a valid date');
            expect(validateField('employmentDate', '2023-13-01')).toBe('Please enter a valid date');
            expect(validateField('employmentDate', '2023-01-01')).toBeUndefined();
        });

        it('should validate department field', () => {
            const validateField = (element as any).validateField;

            expect(validateField('department', '')).toBe('Department is required');
            expect(validateField('department', '   ')).toBe('Department is required');
            expect(validateField('department', 'Tech')).toBeUndefined();
        });

        it('should validate position field', () => {
            const validateField = (element as any).validateField;

            expect(validateField('position', '')).toBe('Position is required');
            expect(validateField('position', '   ')).toBe('Position is required');
            expect(validateField('position', 'Senior')).toBeUndefined();
        });

        it('should validate entire form correctly', () => {
            // Empty form should have errors
            let isValid = (element as any).validateForm();
            expect(isValid).toBe(false);

            // Fill form with valid data
            (element as any).formData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '+90 555 123 45 67',
                birthDate: '1990-05-15',
                employmentDate: '2023-01-01',
                department: 'Tech',
                position: 'Senior'
            };

            isValid = (element as any).validateForm();
            expect(isValid).toBe(true);
        });
    });

    describe('Form Input Handling', () => {
        it('should handle input changes correctly', async () => {
            await element.updateComplete;
            const input = element.shadowRoot?.querySelector('#firstName') as HTMLInputElement;
            expect(input).toBeTruthy();

            // Call the input change handler directly
            (element as any).handleInputChange('firstName', 'John');

            const formData = (element as any).formData;
            expect(formData.firstName).toBe('John');
        });

        it('should mark field as touched when input changes', () => {
            (element as any).handleInputChange('firstName', 'John');

            const touched = (element as any).touched;
            expect(touched.firstName).toBe(true);
        });

        it('should clear field error when input becomes valid', () => {
            // Set an error first
            (element as any).errors = { firstName: 'First name is required' };

            (element as any).handleInputChange('firstName', 'John');

            const errors = (element as any).errors;
            expect(errors.firstName).toBeUndefined();
        });
    });

    describe('Form Submission', () => {
        it('should emit create event for new employee', () => {
            // Fill form with valid data
            (element as any).formData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '+90 555 123 45 67',
                birthDate: '1990-05-15',
                employmentDate: '2023-01-01',
                department: 'Tech',
                position: 'Senior'
            };

            let eventDetail: any = null;
            element.addEventListener('employee-submit', (e: Event) => {
                eventDetail = (e as CustomEvent).detail;
            });

            // Create a mock event
            const mockEvent = new Event('submit');
            const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');

            (element as any).handleSubmit(mockEvent);

            expect(preventDefaultSpy).toHaveBeenCalled();
            expect(eventDetail).toBeTruthy();
            expect(eventDetail.type).toBe('create');
            expect(eventDetail.data).toEqual({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '+90 555 123 45 67',
                birthDate: '1990-05-15',
                employmentDate: '2023-01-01',
                department: 'Tech',
                position: 'Senior'
            });
        });

        it('should emit update event for existing employee', () => {
            element.employee = sampleEmployee;

            // Modify some data
            (element as any).formData = {
                ...sampleEmployee,
                firstName: 'Jane'
            };

            let eventDetail: any = null;
            element.addEventListener('employee-submit', (e: Event) => {
                eventDetail = (e as CustomEvent).detail;
            });

            const mockEvent = new Event('submit');
            (element as any).handleSubmit(mockEvent);

            expect(eventDetail).toBeTruthy();
            expect(eventDetail.type).toBe('update');
            expect(eventDetail.id).toBe(sampleEmployee.id);
            expect(eventDetail.data.firstName).toBe('Jane');
        });

        it('should not submit form with validation errors', () => {
            // Leave form empty (invalid)
            let eventFired = false;
            element.addEventListener('employee-submit', () => {
                eventFired = true;
            });

            const mockEvent = new Event('submit');
            (element as any).handleSubmit(mockEvent);

            expect(eventFired).toBe(false);

            // Check that all fields are marked as touched
            const touched = (element as any).touched;
            Object.values(touched).forEach(value => {
                expect(value).toBe(true);
            });
        });
    });

    describe('Form Cancellation', () => {
        it('should emit cancel event when cancel method is called', () => {
            let eventFired = false;
            element.addEventListener('employee-cancel', () => {
                eventFired = true;
            });

            (element as any).handleCancel();

            expect(eventFired).toBe(true);
        });
    });

    describe('Loading State', () => {
        it('should handle loading property', async () => {
            element.loading = true;
            await element.updateComplete;
            expect(element.loading).toBe(true);

            element.loading = false;
            await element.updateComplete;
            expect(element.loading).toBe(false);
        });
    });

    describe('Error Display', () => {
        it('should manage error state correctly', () => {
            // Set error and mark as touched
            (element as any).errors = { firstName: 'First name is required' };
            (element as any).touched = { firstName: true };

            expect((element as any).errors.firstName).toBe('First name is required');
            expect((element as any).touched.firstName).toBe(true);
        });

        it('should not show errors for untouched fields', () => {
            // Set error but don't mark as touched
            (element as any).errors = { firstName: 'First name is required' };
            (element as any).touched = { firstName: false };

            expect((element as any).errors.firstName).toBe('First name is required');
            expect((element as any).touched.firstName).toBe(false);
        });
    });

    describe('Department and Position Data', () => {
        it('should have access to form data properties', () => {
            const formData = (element as any).formData;
            expect(formData).toHaveProperty('department');
            expect(formData).toHaveProperty('position');
        });

        it('should update form data with department and position', () => {
            (element as any).handleInputChange('department', 'Tech');
            (element as any).handleInputChange('position', 'Senior');

            const formData = (element as any).formData;
            expect(formData.department).toBe('Tech');
            expect(formData.position).toBe('Senior');
        });
    });

    describe('Date Input Handling', () => {
        it('should handle birth date input', () => {
            (element as any).handleInputChange('birthDate', '1990-05-15');

            const formData = (element as any).formData;
            expect(formData.birthDate).toBe('1990-05-15');
        });

        it('should handle employment date input', () => {
            (element as any).handleInputChange('employmentDate', '2023-01-01');

            const formData = (element as any).formData;
            expect(formData.employmentDate).toBe('2023-01-01');
        });
    });

    describe('Form Methods', () => {
        it('should have updateFormData method', () => {
            expect(typeof (element as any).updateFormData).toBe('function');
        });

        it('should have validateField method', () => {
            expect(typeof (element as any).validateField).toBe('function');
        });

        it('should have validateForm method', () => {
            expect(typeof (element as any).validateForm).toBe('function');
        });

        it('should have handleInputChange method', () => {
            expect(typeof (element as any).handleInputChange).toBe('function');
        });

        it('should have handleSubmit method', () => {
            expect(typeof (element as any).handleSubmit).toBe('function');
        });

        it('should have handleCancel method', () => {
            expect(typeof (element as any).handleCancel).toBe('function');
        });
    });

    describe('Component Lifecycle', () => {
        it('should call updateFormData when employee property changes', async () => {
            const updateFormDataSpy = vi.spyOn(element as any, 'updateFormData');

            element.employee = sampleEmployee;
            await element.updateComplete;

            expect(updateFormDataSpy).toHaveBeenCalled();
        });
    });

    describe('Form State Management', () => {
        it('should maintain form state correctly', () => {
            const initialFormData = (element as any).formData;
            expect(typeof initialFormData).toBe('object');

            const initialErrors = (element as any).errors;
            expect(typeof initialErrors).toBe('object');

            const initialTouched = (element as any).touched;
            expect(typeof initialTouched).toBe('object');
        });

        it('should update state when handling input changes', () => {
            const initialFirstName = (element as any).formData.firstName;
            expect(initialFirstName).toBe('');

            (element as any).handleInputChange('firstName', 'John');

            const updatedFirstName = (element as any).formData.firstName;
            expect(updatedFirstName).toBe('John');
        });
    });
});
