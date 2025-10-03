// src/stores/employee-store.ts
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { Employee, EmployeeCreateData, EmployeeUpdateData } from '../models/employee';
import { DEPARTMENTS, POSITIONS } from '../components/constants/constants';

class EmployeeStore {
    private _employees: Employee[] = [];
    private listeners = new Set<() => void>();

    constructor() {
        this.loadFromStorage();
        this.seedData();
    }

    // Getters
    get employees() { return [...this._employees]; }
    get count() { return this._employees.length; }

    // Generate unique string ID
    private generateId(): string {
        return `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // CRUD Operations
    add(data: EmployeeCreateData): Employee {
        const employee: Employee = {
            ...data,
            id: this.generateId()
        };

        this._employees.push(employee);
        this.saveToStorage();
        this.emit();
        return employee;
    }

    update(id: string, data: EmployeeUpdateData): Employee | null {
        const index = this._employees.findIndex(emp => emp.id === id);
        if (index === -1) return null;

        this._employees[index] = { ...this._employees[index], ...data };
        this.saveToStorage();
        this.emit();
        return this._employees[index];
    }

    delete(id: string): boolean {
        const index = this._employees.findIndex(emp => emp.id === id);
        if (index === -1) return false;

        this._employees.splice(index, 1);
        this.saveToStorage();
        this.emit();
        return true;
    }

    getById(id: string): Employee | null {
        return this._employees.find(emp => emp.id === id) || null;
    }

    // Check if employee already exists by email
    findByEmail(email: string): Employee | null {
        return this._employees.find(emp => emp.email.toLowerCase() === email.toLowerCase()) || null;
    }

    getAllEmployees(): Promise<Employee[]> {
        return Promise.resolve([...this._employees]);
    }

    // Search & Filter
    search(query: string): Employee[] {
        const lowerQuery = query.toLowerCase();
        return this._employees.filter(emp =>
            emp.firstName.toLowerCase().includes(lowerQuery) ||
            emp.lastName.toLowerCase().includes(lowerQuery) ||
            emp.email.toLowerCase().includes(lowerQuery) ||
            emp.department.toLowerCase().includes(lowerQuery) ||
            emp.position.toLowerCase().includes(lowerQuery)
        );
    }

    filterByDepartment(department: string): Employee[] {
        return this._employees.filter(emp => emp.department === department);
    }

    getDepartments(): string[] {
        const departments = new Set(this._employees.map(emp => emp.department));
        return Array.from(departments).sort();
    }

    // Storage
    private saveToStorage() {
        try {
            localStorage.setItem('employees', JSON.stringify(this._employees));
        } catch (error) {
            console.warn('Failed to save employees to localStorage:', error);
        }
    }

    private loadFromStorage() {
        try {
            const stored = localStorage.getItem('employees');

            if (stored) {
                this._employees = JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Failed to load employees from localStorage:', error);
        }
    }

    // Sample data
    private seedData() {
        if (this._employees.length === 0) {
            const firstNames = [
                'Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Hüseyin', 'Hasan', 'İbrahim', 'İsmail', 'Osman', 'Murat',
                'Ayşe', 'Fatma', 'Emine', 'Hatice', 'Zeynep', 'Şerife', 'Meryem', 'Hanife', 'Rabia', 'Elif',
                'Can', 'Cem', 'Deniz', 'Ege', 'Kaan', 'Kerem', 'Onur', 'Özgür', 'Serkan', 'Tolga',
                'Aslı', 'Burcu', 'Cansu', 'Derya', 'Ebru', 'Fulya', 'Gizem', 'Hale', 'İpek', 'Jale',
                'John', 'Michael', 'David', 'James', 'Robert', 'William', 'Christopher', 'Matthew', 'Anthony', 'Mark',
                'Jennifer', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth',
                'Emre', 'Burak', 'Volkan', 'Barış', 'Caner', 'Gökhan', 'Erhan', 'Furkan', 'Hakan', 'Levent',
                'Merve', 'Pınar', 'Seda', 'Tuğba', 'Yasemin', 'Özlem', 'Sibel', 'Serpil', 'Serap', 'Sevgi'
            ];

            const lastNames = [
                'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir',
                'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek',
                'Erdoğan', 'Polat', 'Akkaya', 'Tunç', 'Güneş', 'Acar', 'Başak', 'Korkmaz', 'Bulut', 'Taş',
                'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                'Güler', 'Çakır', 'Özer', 'Duran', 'Ünal', 'Toprak', 'Karataş', 'Bozkurt', 'Efe', 'Mutlu'
            ];

            const sampleEmployees: EmployeeCreateData[] = [];

            for (let i = 0; i < 250; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
                const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];

                // Random dates
                const employmentYear = 2018 + Math.floor(Math.random() * 7); // 2018-2024
                const employmentMonth = 1 + Math.floor(Math.random() * 12);
                const employmentDay = 1 + Math.floor(Math.random() * 28);

                const birthYear = 1970 + Math.floor(Math.random() * 35); // 1970-2004
                const birthMonth = 1 + Math.floor(Math.random() * 12);
                const birthDay = 1 + Math.floor(Math.random() * 28);

                // Random phone number
                const phoneNumber = `+90 5${Math.floor(Math.random() * 6) + 3}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10}${Math.floor(Math.random() * 90) + 10}`;

                // Email (handle Turkish characters)
                const emailFirstName = firstName.toLowerCase()
                    .replace('ğ', 'g').replace('ü', 'u').replace('ş', 's')
                    .replace('ı', 'i').replace('ö', 'o').replace('ç', 'c');
                const emailLastName = lastName.toLowerCase()
                    .replace('ğ', 'g').replace('ü', 'u').replace('ş', 's')
                    .replace('ı', 'i').replace('ö', 'o').replace('ç', 'c');
                const email = `${emailFirstName}.${emailLastName}@ing.com`;

                sampleEmployees.push({
                    firstName,
                    lastName,
                    email,
                    department,
                    position,
                    employmentDate: `${employmentYear}-${employmentMonth.toString().padStart(2, '0')}-${employmentDay.toString().padStart(2, '0')}`,
                    birthDate: `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`,
                    phone: phoneNumber
                });
            }

            sampleEmployees.forEach(emp => this.add(emp));
        }
    }

    // Reactive pattern (same as i18n)
    subscribe(cb: () => void) {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb);
    }

    private emit() {
        for (const cb of this.listeners) cb();
    }

    // Clear all data (for testing)
    clear() {
        this._employees = [];
        this.saveToStorage();
        this.emit();
    }
}

// Singleton instance
export const employeeStore = new EmployeeStore();

// Reactive controller for Lit components
export class EmployeeController implements ReactiveController {
    private host: ReactiveControllerHost;
    private unsub?: () => void;

    constructor(host: ReactiveControllerHost) {
        this.host = host;
        host.addController(this);
    }

    hostConnected() {
        this.unsub = employeeStore.subscribe(() => this.host.requestUpdate());
    }

    hostDisconnected() {
        this.unsub?.();
    }
}
