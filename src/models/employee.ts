// src/models/employee.ts
export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    employmentDate: string; // ISO: "2022-09-23"
    birthDate: string;      // ISO
    phone: string;
    email: string;
    department: string;
    position: string;
}

export type EmployeeCreateData = Omit<Employee, 'id'>;
export type EmployeeUpdateData = Partial<Omit<Employee, 'id'>>;

// Validation helpers
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.includes('..');
}

export function isValidDate(dateString: string): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

export function isValidPhone(phone: string): boolean {
    // Basit telefon validasyonu - Türkiye formatları
    return /^(\+90|0)?\s*\d{3}\s*\d{3}\s*\d{2}\s*\d{2}$/.test(phone.replace(/[\s-]/g, ''));
}

export function isAtLeast18YearsOld(birthDate: string): boolean {
    if (!birthDate || !isValidDate(birthDate)) return false;
    
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // If birthday hasn't occurred this year yet, subtract 1 from age
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        return age - 1 >= 18;
    }
    
    return age >= 18;
}

export function isValidEmployee(data: any): data is EmployeeCreateData {
    return (
        typeof data.firstName === 'string' && data.firstName.trim().length > 0 &&
        typeof data.lastName === 'string' && data.lastName.trim().length > 0 &&
        typeof data.email === 'string' && isValidEmail(data.email) &&
        typeof data.department === 'string' && data.department.trim().length > 0 &&
        typeof data.position === 'string' && data.position.trim().length > 0 &&
        typeof data.employmentDate === 'string' && isValidDate(data.employmentDate) &&
        typeof data.birthDate === 'string' && isValidDate(data.birthDate) && isAtLeast18YearsOld(data.birthDate) &&
        typeof data.phone === 'string' && isValidPhone(data.phone)
    );
}
