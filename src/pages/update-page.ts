// src/pages/update-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { i18n, I18nController } from '../i18n/i18n';
import { Router, RouterController } from '../router/router';
import { employeeStore } from '../stores/employee-store';
import type { Employee, EmployeeUpdateData } from '../models/employee';
import { isValidEmail, isValidPhone, isValidDate } from '../models/employee';

@customElement('update-page')
export class UpdatePage extends LitElement {
    private i18nController = new I18nController(this);
    private routerController = new RouterController(this);
    private router = Router.getInstance();

    @state()
    private employee: Employee | null = null;

    @state()
    private formData: EmployeeUpdateData = {};

    @state()
    private errors: Partial<Record<keyof Employee, string>> = {};

    @state()
    private loading = true;

    static styles = css`
    :host {
      display: block;
      padding: 20px 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .title {
      font-size: var(--font-size-3xl, 28px);
      font-weight: 700;
      color: var(--color-text);
      margin: 0;
    }

    .back-btn {
      background: none;
      border: 1px solid #e0e0e0;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--color-text);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .back-btn:hover {
      background: #f5f5f5;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--color-text-secondary);
    }

    .not-found {
      text-align: center;
      padding: 40px;
      color: var(--color-text-secondary);
    }

    .form-container {
      max-width: 600px;
      background: var(--color-surface);
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 32px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      font-weight: 600;
      color: var(--color-text);
      font-size: var(--font-size-sm, 14px);
    }

    .form-input, .form-select {
      padding: var(--space-3, 12px) var(--space-4, 16px);
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: var(--font-size-base, 16px);
      background: var(--color-surface);
      color: var(--color-text);
      transition: border-color 0.2s ease;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .form-input.error, .form-select.error {
      border-color: #ff4444;
    }

    .error-message {
      color: #ff4444;
      font-size: var(--font-size-xs, 12px);
      margin-top: var(--space-1, 4px);
    }

    .form-actions {
      display: flex;
      gap: var(--space-3, 12px);
      justify-content: flex-end;
    }

    .btn {
      padding: var(--space-3, 12px) var(--space-6, 24px);
      border: none;
      border-radius: 8px;
      font-size: var(--font-size-base, 16px);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--color-primary);
      color: white;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: var(--color-text);
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn-danger {
      background: #ff4444;
      color: white;
    }

    .btn-danger:hover {
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .form-container {
        padding: 20px;
      }
    }
  `;

    connectedCallback() {
        super.connectedCallback();
        this.loadEmployee();
    }

    private async loadEmployee() {
        const path = this.routerController.getCurrentPath();
        const employeeId = path.split('/update/')[1];

        if (employeeId) {
            this.employee = employeeStore.getById(employeeId);
            if (this.employee) {
                this.formData = { ...this.employee };
            }
        }

        this.loading = false;
    }

    private handleInputChange(field: keyof Employee, value: string) {
        this.formData = { ...this.formData, [field]: value };

        // Clear error when user starts typing
        if (this.errors[field]) {
            this.errors = { ...this.errors, [field]: undefined };
        }
    }

    private validateForm(): boolean {
        const newErrors: Partial<Record<keyof Employee, string>> = {};

        if (this.formData.firstName !== undefined && !this.formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (this.formData.lastName !== undefined && !this.formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (this.formData.email !== undefined) {
            if (!this.formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!isValidEmail(this.formData.email)) {
                newErrors.email = 'Invalid email format';
            }
        }

        if (this.formData.phone !== undefined) {
            if (!this.formData.phone.trim()) {
                newErrors.phone = 'Phone is required';
            } else if (!isValidPhone(this.formData.phone)) {
                newErrors.phone = 'Invalid phone format';
            }
        }

        if (this.formData.department !== undefined && !this.formData.department.trim()) {
            newErrors.department = 'Department is required';
        }

        if (this.formData.position !== undefined && !this.formData.position.trim()) {
            newErrors.position = 'Position is required';
        }

        if (this.formData.employmentDate !== undefined) {
            if (!this.formData.employmentDate.trim()) {
                newErrors.employmentDate = 'Employment date is required';
            } else if (!isValidDate(this.formData.employmentDate)) {
                newErrors.employmentDate = 'Invalid date format';
            }
        }

        if (this.formData.birthDate !== undefined) {
            if (!this.formData.birthDate.trim()) {
                newErrors.birthDate = 'Birth date is required';
            } else if (!isValidDate(this.formData.birthDate)) {
                newErrors.birthDate = 'Invalid date format';
            }
        }

        this.errors = newErrors;
        return Object.keys(newErrors).length === 0;
    }

    private handleSubmit(e: Event) {
        e.preventDefault();

        if (this.employee && this.validateForm()) {
            try {
                employeeStore.update(this.employee.id, this.formData);
                this.router.navigate('/');
            } catch (error) {
                console.error('Failed to update employee:', error);
            }
        }
    }

    private handleDelete() {
        if (this.employee && confirm('Are you sure you want to delete this employee?')) {
            try {
                employeeStore.delete(this.employee.id);
                this.router.navigate('/');
            } catch (error) {
                console.error('Failed to delete employee:', error);
            }
        }
    }

    private handleCancel() {
        this.router.navigate('/');
    }

    render() {
        if (this.loading) {
            return html`<div class="loading">Loading...</div>`;
        }

        if (!this.employee) {
            return html`
        <div class="not-found">
          <h2>Employee not found</h2>
          <button class="btn btn-primary" @click=${this.handleCancel}>
            Go back to home
          </button>
        </div>
      `;
        }

        return html`
      <div class="header">
        <h1 class="title">${i18n.t('update')}</h1>
        <button class="back-btn" @click=${this.handleCancel}>
          ← ${i18n.t('home')}
        </button>
      </div>

      <div class="form-container">
        <form @submit=${this.handleSubmit}>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">First Name *</label>
              <input 
                type="text" 
                class="form-input ${this.errors.firstName ? 'error' : ''}"
                .value=${this.formData.firstName || ''}
                @input=${(e: Event) => this.handleInputChange('firstName', (e.target as HTMLInputElement).value)}
              />
              ${this.errors.firstName ? html`<div class="error-message">${this.errors.firstName}</div>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label">Last Name *</label>
              <input 
                type="text" 
                class="form-input ${this.errors.lastName ? 'error' : ''}"
                .value=${this.formData.lastName || ''}
                @input=${(e: Event) => this.handleInputChange('lastName', (e.target as HTMLInputElement).value)}
              />
              ${this.errors.lastName ? html`<div class="error-message">${this.errors.lastName}</div>` : ''}
            </div>

            <div class="form-group full-width">
              <label class="form-label">Email *</label>
              <input 
                type="email" 
                class="form-input ${this.errors.email ? 'error' : ''}"
                .value=${this.formData.email || ''}
                @input=${(e: Event) => this.handleInputChange('email', (e.target as HTMLInputElement).value)}
              />
              ${this.errors.email ? html`<div class="error-message">${this.errors.email}</div>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label">Phone *</label>
              <input 
                type="tel" 
                class="form-input ${this.errors.phone ? 'error' : ''}"
                .value=${this.formData.phone || ''}
                @input=${(e: Event) => this.handleInputChange('phone', (e.target as HTMLInputElement).value)}
              />
              ${this.errors.phone ? html`<div class="error-message">${this.errors.phone}</div>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label">Department *</label>
              <select 
                class="form-select ${this.errors.department ? 'error' : ''}"
                .value=${this.formData.department || ''}
                @change=${(e: Event) => this.handleInputChange('department', (e.target as HTMLSelectElement).value)}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="IT">IT</option>
                <option value="Customer Service">Customer Service</option>
              </select>
              ${this.errors.department ? html`<div class="error-message">${this.errors.department}</div>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label">Position *</label>
              <input 
                type="text" 
                class="form-input ${this.errors.position ? 'error' : ''}"
                .value=${this.formData.position || ''}
                @input=${(e: Event) => this.handleInputChange('position', (e.target as HTMLInputElement).value)}
              />
              ${this.errors.position ? html`<div class="error-message">${this.errors.position}</div>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label">Employment Date *</label>
              <input 
                type="date" 
                class="form-input ${this.errors.employmentDate ? 'error' : ''}"
                .value=${this.formData.employmentDate || ''}
                @input=${(e: Event) => this.handleInputChange('employmentDate', (e.target as HTMLInputElement).value)}
              />
              ${this.errors.employmentDate ? html`<div class="error-message">${this.errors.employmentDate}</div>` : ''}
            </div>

            <div class="form-group">
              <label class="form-label">Birth Date *</label>
              <input 
                type="date" 
                class="form-input ${this.errors.birthDate ? 'error' : ''}"
                .value=${this.formData.birthDate || ''}
                @input=${(e: Event) => this.handleInputChange('birthDate', (e.target as HTMLInputElement).value)}
              />
              ${this.errors.birthDate ? html`<div class="error-message">${this.errors.birthDate}</div>` : ''}
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-danger" @click=${this.handleDelete}>
              Delete
            </button>
            <button type="button" class="btn btn-secondary" @click=${this.handleCancel}>
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Update Employee
            </button>
          </div>
        </form>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'update-page': UpdatePage;
    }
}
