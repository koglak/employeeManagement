// src/components/employee/employee-form.ts
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { formStyles } from '../../styles/form.css.js';
import { i18n, I18nController } from '../../i18n/i18n.js';
import type { Employee, EmployeeCreateData, EmployeeUpdateData } from '../../models/employee.js';
import { isValidEmail, isValidDate, isValidPhone } from '../../models/employee.js';
import { DEPARTMENTS, POSITIONS } from '../../constants/constants.js';
import { live } from 'lit/directives/live.js';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  employmentDate: string;
  department: string;
  position: string;
}
interface FormErrors {
  firstName?: string; lastName?: string; email?: string; phone?: string;
  birthDate?: string; employmentDate?: string; department?: string; position?: string;
}

@customElement('employee-form')
export class EmployeeForm extends LitElement {
  // i18n reactivity
  private _i18nCtl = new I18nController(this);

  static styles = [formStyles];

  @property({ type: Object }) employee?: Employee;
  @property({ type: Boolean }) loading = false;

  @state() private formData: FormData = {
    firstName: '', lastName: '', email: '', phone: '',
    birthDate: '', employmentDate: '', department: '', position: ''
  };
  @state() private errors: FormErrors = {};
  @state() private touched: Record<keyof FormData, boolean> = {
    firstName: false, lastName: false, email: false, phone: false,
    birthDate: false, employmentDate: false, department: false, position: false
  };

  connectedCallback() {
    super.connectedCallback();
    this.updateFormData();
  }

  updated(changed: Map<string | number | symbol, unknown>) {
    if (changed.has('employee')) this.updateFormData();
  }

  private updateFormData() {
    if (this.employee) {
      // normalize department/position to known options
      const dept = DEPARTMENTS.includes(this.employee.department as any) ? this.employee.department : '';
      const pos = POSITIONS.includes(this.employee.position as any) ? this.employee.position : '';
      this.formData = {
        firstName: this.employee.firstName ?? '',
        lastName: this.employee.lastName ?? '',
        email: this.employee.email ?? '',
        phone: this.employee.phone ?? '',
        birthDate: this.employee.birthDate ?? '',
        employmentDate: this.employee.employmentDate ?? '',
        department: dept,
        position: pos,
      };
    } else {
      this.formData = {
        firstName: '', lastName: '', email: '', phone: '',
        birthDate: '', employmentDate: '', department: '', position: ''
      };
    }
    this.errors = {};
    this.touched = {
      firstName: false, lastName: false, email: false, phone: false,
      birthDate: false, employmentDate: false, department: false, position: false
    };
  }

  private validateField(field: keyof FormData, value: string): string | undefined {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? undefined : `${field === 'firstName' ? 'First' : 'Last'} name is required`;
      case 'email':
        if (!value.trim()) return 'Email is required';
        return isValidEmail(value) ? undefined : 'Please enter a valid email address';
      case 'phone':
        if (!value.trim()) return 'Phone is required';
        return isValidPhone(value) ? undefined : 'Please enter a valid phone number';
      case 'birthDate':
      case 'employmentDate':
        if (!value.trim()) return `${field === 'birthDate' ? 'Birth' : 'Employment'} date is required`;
        return isValidDate(value) ? undefined : 'Please enter a valid date';
      case 'department':
        return value.trim() ? undefined : 'Department is required';
      case 'position':
        return value.trim() ? undefined : 'Position is required';
      default:
        return undefined;
    }
  }

  private validateForm(): boolean {
    const errs: FormErrors = {};
    (Object.keys(this.formData) as (keyof FormData)[]).forEach(k => {
      const e = this.validateField(k, this.formData[k]);
      if (e) errs[k] = e;
    });
    this.errors = errs;
    return Object.keys(errs).length === 0;
  }

  private handleInputChange(field: keyof FormData, value: string) {
    this.formData = { ...this.formData, [field]: value };
    this.touched = { ...this.touched, [field]: true };
    const err = this.validateField(field, value);
    if (!err && this.errors[field]) this.errors = { ...this.errors, [field]: undefined };
  }

  private handleSubmit(e: Event) {
    e.preventDefault();
    // mark all touched
    this.touched = (Object.keys(this.formData) as (keyof FormData)[])
      .reduce((acc, k) => (acc[k] = true, acc), {} as Record<keyof FormData, boolean>);

    if (!this.validateForm()) return;

    const detail = this.employee
      ? { type: 'update', data: this.formData as EmployeeUpdateData, id: this.employee.id }
      : { type: 'create', data: this.formData as EmployeeCreateData };

    this.dispatchEvent(new CustomEvent('employee-submit', { detail, bubbles: true }));
  }

  private handleCancel() {
    this.dispatchEvent(new CustomEvent('employee-cancel', { bubbles: true }));
  }

  render() {
    const today = new Date().toISOString().split('T')[0];

    return html`
      <form class="form-card" @submit=${this.handleSubmit}>
        <div class="form-grid">
          <!-- first name -->
          <div class="form-group">
            <label class="form-label" for="firstName">${i18n.t('firstName')}</label>
            <input id="firstName" type="text"
              class="form-input ${this.errors.firstName && this.touched.firstName ? 'error' : ''}"
              .value=${this.formData.firstName}
              @input=${(e: Event) => this.handleInputChange('firstName', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading} required>
            ${this.errors.firstName && this.touched.firstName ? html`<span class="error-message">${this.errors.firstName}</span>` : null}
          </div>

          <!-- last name -->
          <div class="form-group">
            <label class="form-label" for="lastName">${i18n.t('lastName')}</label>
            <input id="lastName" type="text"
              class="form-input ${this.errors.lastName && this.touched.lastName ? 'error' : ''}"
              .value=${this.formData.lastName}
              @input=${(e: Event) => this.handleInputChange('lastName', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading} required>
            ${this.errors.lastName && this.touched.lastName ? html`<span class="error-message">${this.errors.lastName}</span>` : null}
          </div>

          <!-- employment date -->
          <div class="form-group">
            <label class="form-label" for="employmentDate">${i18n.t('employmentDate')}</label>
            <input id="employmentDate" type="date" max=${today}
              class="form-input custom-calendar ${this.errors.employmentDate && this.touched.employmentDate ? 'error' : ''}"
              .value=${this.formData.employmentDate}
              @input=${(e: Event) => this.handleInputChange('employmentDate', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading} required>
            ${this.errors.employmentDate && this.touched.employmentDate ? html`<span class="error-message">${this.errors.employmentDate}</span>` : null}
          </div>

          <!-- birth date -->
          <div class="form-group">
            <label class="form-label" for="birthDate">${i18n.t('birthDate')}</label>
            <input id="birthDate" type="date" max=${today}
              class="form-input custom-calendar ${this.errors.birthDate && this.touched.birthDate ? 'error' : ''}"
              .value=${this.formData.birthDate}
              @input=${(e: Event) => this.handleInputChange('birthDate', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading} required>
            ${this.errors.birthDate && this.touched.birthDate ? html`<span class="error-message">${this.errors.birthDate}</span>` : null}
          </div>

          <!-- phone -->
          <div class="form-group">
            <label class="form-label" for="phone">${i18n.t('phone')}</label>
            <input id="phone" type="tel" placeholder="+90 555 11 11 11"
              class="form-input ${this.errors.phone && this.touched.phone ? 'error' : ''}"
              .value=${this.formData.phone}
              @input=${(e: Event) => this.handleInputChange('phone', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading} required>
            ${this.errors.phone && this.touched.phone ? html`<span class="error-message">${this.errors.phone}</span>` : null}
          </div>

          <!-- email -->
          <div class="form-group">
            <label class="form-label" for="email">${i18n.t('email')}</label>
            <input id="email" type="email"
              class="form-input ${this.errors.email && this.touched.email ? 'error' : ''}"
              .value=${this.formData.email}
              @input=${(e: Event) => this.handleInputChange('email', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading} required>
            ${this.errors.email && this.touched.email ? html`<span class="error-message">${this.errors.email}</span>` : null}
          </div>

          <!-- department -->
          <div class="form-group">
            <label class="form-label" for="department">${i18n.t('department')}</label>
            <select id="department"
              class="form-select ${this.errors.department && this.touched.department ? 'error' : ''}"
              .value=${live(this.formData.department ?? '')}
              @change=${(e: Event) => this.handleInputChange('department', (e.target as HTMLSelectElement).value)}
              ?disabled=${this.loading} required>
              <option value="">${i18n.t('selectDepartment')}</option>
              ${DEPARTMENTS.map(d => html`<option value=${d}>${d}</option>`)}
            </select>
            ${this.errors.department && this.touched.department ? html`<span class="error-message">${this.errors.department}</span>` : null}
          </div>

          <!-- position -->
          <div class="form-group">
            <label class="form-label" for="position">${i18n.t('position')}</label>
            <select id="position"
              class="form-select ${this.errors.position && this.touched.position ? 'error' : ''}"
              .value=${live(this.formData.position ?? '')}
              @change=${(e: Event) => this.handleInputChange('position', (e.target as HTMLSelectElement).value)}
              ?disabled=${this.loading} required>
              <option value="">${i18n.t('selectPosition')}</option>
              ${POSITIONS.map(p => html`<option value=${p}>${p}</option>`)}
            </select>
            ${this.errors.position && this.touched.position ? html`<span class="error-message">${this.errors.position}</span>` : null}
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" ?disabled=${this.loading}>
            ${this.loading ? html`
              <span class="loading"><span class="spinner"></span>${i18n.t('saving')}</span>
            ` : i18n.t('save')}
          </button>
          <button type="button" class="btn btn-secondary" @click=${this.handleCancel} ?disabled=${this.loading}>
            ${i18n.t('cancel')}
          </button>
        </div>
      </form>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'employee-form': EmployeeForm } }
