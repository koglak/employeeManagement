import { describe, it, expect } from 'vitest';
import type { Employee, EmployeeCreateData, EmployeeUpdateData } from '../../src/models/employee';
import { isValidEmail, isValidDate, isValidPhone, isValidEmployee } from '../../src/models/employee';

describe('Employee Model', () => {
    const validEmployee: Employee = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+90 555 123 45 67',
        department: 'Engineering',
        position: 'Senior Developer',
        employmentDate: '2020-01-01',
        birthDate: '1990-05-15'
    };

    const validEmployeeCreateData: EmployeeCreateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '0532 123 45 67',
        department: 'Design',
        position: 'UI Designer',
        employmentDate: '2021-03-15',
        birthDate: '1992-08-20'
    };

    describe('Employee Interface', () => {
        it('should have all required properties', () => {
            expect(validEmployee).toHaveProperty('id');
            expect(validEmployee).toHaveProperty('firstName');
            expect(validEmployee).toHaveProperty('lastName');
            expect(validEmployee).toHaveProperty('email');
            expect(validEmployee).toHaveProperty('phone');
            expect(validEmployee).toHaveProperty('department');
            expect(validEmployee).toHaveProperty('position');
            expect(validEmployee).toHaveProperty('employmentDate');
            expect(validEmployee).toHaveProperty('birthDate');
        });

        it('should have correct data types', () => {
            expect(typeof validEmployee.id).toBe('string');
            expect(typeof validEmployee.firstName).toBe('string');
            expect(typeof validEmployee.lastName).toBe('string');
            expect(typeof validEmployee.email).toBe('string');
            expect(typeof validEmployee.phone).toBe('string');
            expect(typeof validEmployee.department).toBe('string');
            expect(typeof validEmployee.position).toBe('string');
            expect(typeof validEmployee.employmentDate).toBe('string');
            expect(typeof validEmployee.birthDate).toBe('string');
        });
    });

    describe('EmployeeCreateData Type', () => {
        it('should not have id property', () => {
            expect(validEmployeeCreateData).not.toHaveProperty('id');
        });

        it('should have all other required properties', () => {
            expect(validEmployeeCreateData).toHaveProperty('firstName');
            expect(validEmployeeCreateData).toHaveProperty('lastName');
            expect(validEmployeeCreateData).toHaveProperty('email');
            expect(validEmployeeCreateData).toHaveProperty('phone');
            expect(validEmployeeCreateData).toHaveProperty('department');
            expect(validEmployeeCreateData).toHaveProperty('position');
            expect(validEmployeeCreateData).toHaveProperty('employmentDate');
            expect(validEmployeeCreateData).toHaveProperty('birthDate');
        });
    });

    describe('Email Validation', () => {
        it('should validate correct email addresses', () => {
            expect(isValidEmail('user@domain.com')).toBe(true);
            expect(isValidEmail('test.email@example.org')).toBe(true);
            expect(isValidEmail('john.doe+tag@company.co.uk')).toBe(true);
        });

        it('should reject invalid email addresses', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('user@')).toBe(false);
            expect(isValidEmail('@domain.com')).toBe(false);
            expect(isValidEmail('user..double@domain.com')).toBe(false);
            expect(isValidEmail('user@domain')).toBe(false);
            expect(isValidEmail('')).toBe(false);
        });
    });

    describe('Date Validation', () => {
        it('should validate correct ISO date strings', () => {
            expect(isValidDate('2020-01-01')).toBe(true);
            expect(isValidDate('1990-12-31')).toBe(true);
            expect(isValidDate('2023-06-15')).toBe(true);
        });

        it('should reject invalid date strings', () => {
            expect(isValidDate('2020-13-01')).toBe(false);
            expect(isValidDate('2020-01-32')).toBe(false);
            expect(isValidDate('invalid-date')).toBe(false);
            expect(isValidDate('01/01/2020')).toBe(false);
            expect(isValidDate('2020/01/01')).toBe(false);
            expect(isValidDate('')).toBe(false);
        });
    });

    describe('Phone Validation', () => {
        it('should validate Turkish phone number formats', () => {
            expect(isValidPhone('+90 555 123 45 67')).toBe(true);
            expect(isValidPhone('0532 123 45 67')).toBe(true);
            expect(isValidPhone('+905551234567')).toBe(true);
            expect(isValidPhone('05321234567')).toBe(true);
            expect(isValidPhone('532 123 45 67')).toBe(true);
        });

        it('should reject invalid phone numbers', () => {
            expect(isValidPhone('123')).toBe(false);
            expect(isValidPhone('+1 555 123 4567')).toBe(false);
            expect(isValidPhone('invalid-phone')).toBe(false);
            expect(isValidPhone('')).toBe(false);
            expect(isValidPhone('0123')).toBe(false);
        });
    });

    describe('Employee Validation', () => {
        it('should validate complete valid employee data', () => {
            expect(isValidEmployee(validEmployeeCreateData)).toBe(true);
        });

        it('should reject employee data with missing fields', () => {
            const incompleteData = { ...validEmployeeCreateData };
            delete (incompleteData as any).firstName;
            expect(isValidEmployee(incompleteData)).toBe(false);
        });

        it('should reject employee data with invalid email', () => {
            const invalidData = { ...validEmployeeCreateData, email: 'invalid-email' };
            expect(isValidEmployee(invalidData)).toBe(false);
        });

        it('should reject employee data with invalid date', () => {
            const invalidData = { ...validEmployeeCreateData, employmentDate: 'invalid-date' };
            expect(isValidEmployee(invalidData)).toBe(false);
        });

        it('should reject employee data with invalid phone', () => {
            const invalidData = { ...validEmployeeCreateData, phone: 'invalid-phone' };
            expect(isValidEmployee(invalidData)).toBe(false);
        });

        it('should reject employee data with empty strings', () => {
            const invalidData = { ...validEmployeeCreateData, firstName: '' };
            expect(isValidEmployee(invalidData)).toBe(false);
        });
    });
});
