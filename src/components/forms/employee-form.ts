import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { formStyles } from '../../styles/form.css.js';
import { i18n, I18nController } from '../../i18n/i18n.js';
import type { Employee, EmployeeCreateData, EmployeeUpdateData } from '../../models/employee.js';
import { isValidEmail, isValidDate, isValidPhone } from '../../models/employee.js';
import { DEPARTMENTS, POSITIONS } from '../constants/constants.js';

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
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  employmentDate?: string;
  department?: string;
  position?: string;
}

@customElement('employee-form')
export class EmployeeForm extends LitElement {
  private i18nCtl = new I18nController(this);
  static styles = [formStyles, css`
    :host {
      display: block;
    }
  `];

  @property({ type: Object }) employee?: Employee;
  @property({ type: Boolean }) loading = false;

  @state() private formData: FormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    employmentDate: '',
    department: '',
    position: ''
  };

  @state() private errors: FormErrors = {};
  @state() private touched: Record<keyof FormData, boolean> = {
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    birthDate: false,
    employmentDate: false,
    department: false,
    position: false
  };

  connectedCallback() {
    super.connectedCallback();
    this.updateFormData();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('employee')) {
      this.updateFormData();
    }
  }

  private updateFormData() {
    if (this.employee) {
      this.formData = { ...this.employee };
    } else {
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        employmentDate: '',
        department: '',
        position: ''
      };
    }
    this.errors = {};
    this.touched = {
      firstName: false,
      lastName: false,
      email: false,
      phone: false,
      birthDate: false,
      employmentDate: false,
      department: false,
      position: false
    };
  }

  private validateField(field: keyof FormData, value: string): string | undefined {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim().length === 0 ? `${field === 'firstName' ? 'First' : 'Last'} name is required` : undefined;

      case 'email':
        if (value.trim().length === 0) return 'Email is required';
        return !isValidEmail(value) ? 'Please enter a valid email address' : undefined;

      case 'phone':
        if (value.trim().length === 0) return 'Phone is required';
        return !isValidPhone(value) ? 'Please enter a valid phone number' : undefined;

      case 'birthDate':
      case 'employmentDate':
        if (value.trim().length === 0) return `${field === 'birthDate' ? 'Birth' : 'Employment'} date is required`;
        return !isValidDate(value) ? 'Please enter a valid date' : undefined;

      case 'department':
        return value.trim().length === 0 ? 'Department is required' : undefined;

      case 'position':
        return value.trim().length === 0 ? 'Position is required' : undefined;

      default:
        return undefined;
    }
  }

  private validateForm(): boolean {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    Object.keys(this.formData).forEach(key => {
      const field = key as keyof FormData;
      const error = this.validateField(field, this.formData[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    this.errors = newErrors;
    return !hasErrors;
  }

  private handleInputChange(field: keyof FormData, value: string) {
    this.formData = { ...this.formData, [field]: value };
    this.touched = { ...this.touched, [field]: true };

    // Clear error for this field if it becomes valid
    const error = this.validateField(field, value);
    if (!error && this.errors[field]) {
      this.errors = { ...this.errors, [field]: undefined };
    }
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(this.formData).reduce((acc, key) => {
      acc[key as keyof FormData] = true;
      return acc;
    }, {} as Record<keyof FormData, boolean>);
    this.touched = allTouched;

    if (this.validateForm()) {
      const eventData = this.employee
        ? { type: 'update', data: this.formData as EmployeeUpdateData, id: this.employee.id }
        : { type: 'create', data: this.formData as EmployeeCreateData };

      this.dispatchEvent(new CustomEvent('employee-submit', {
        detail: eventData,
        bubbles: true
      }));
    }
  }

  private handleCancel() {
    this.dispatchEvent(new CustomEvent('employee-cancel', {
      bubbles: true
    }));
  }

  render() {
    const isUpdate = !!this.employee;

    return html`
      <form class="form-card" @submit=${this.handleSubmit}>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="firstName">${i18n.t('firstName')}</label>
            <input
              type="text"
              id="firstName"
              class="form-input ${this.errors.firstName && this.touched.firstName ? 'error' : ''}"
              .value=${this.formData.firstName}
              @input=${(e: Event) => this.handleInputChange('firstName', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading}
              required
            >
            ${this.errors.firstName && this.touched.firstName
        ? html`<span class="error-message">${this.errors.firstName}</span>`
        : ''}
          </div>

          <div class="form-group">
            <label class="form-label" for="lastName">${i18n.t('lastName')}</label>
            <input
              type="text"
              id="lastName"
              class="form-input ${this.errors.lastName && this.touched.lastName ? 'error' : ''}"
              .value=${this.formData.lastName}
              @input=${(e: Event) => this.handleInputChange('lastName', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading}
              required
            >
            ${this.errors.lastName && this.touched.lastName
        ? html`<span class="error-message">${this.errors.lastName}</span>`
        : ''}
          </div>

          <div class="form-group">
            <label class="form-label" for="employmentDate">${i18n.t('employmentDate')}</label>
            <input
              type="date"
              id="employmentDate"
              max=${new Date().toISOString().split('T')[0]}
              class="form-input custom-calendar ${this.errors.employmentDate && this.touched.employmentDate ? 'error' : ''}"
              .value=${this.formData.employmentDate}
              @input=${(e: Event) => this.handleInputChange('employmentDate', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading}
              required
            >
            ${this.errors.employmentDate && this.touched.employmentDate
        ? html`<span class="error-message">${this.errors.employmentDate}</span>`
        : ''}
          </div>

          <div class="form-group">
            <label class="form-label" for="birthDate">${i18n.t('birthDate')}</label>
            <input
              type="date"
              id="birthDate"
              class="form-input custom-calendar ${this.errors.birthDate && this.touched.birthDate ? 'error' : ''}"
              .value=${this.formData.birthDate}
              max=${new Date().toISOString().split('T')[0]}
              @input=${(e: Event) => this.handleInputChange('birthDate', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading}
              required
            >
            ${this.errors.birthDate && this.touched.birthDate
        ? html`<span class="error-message">${this.errors.birthDate}</span>`
        : ''}
          </div>

           <div class="form-group">
            <label class="form-label" for="phone">${i18n.t('phone')}</label>
            <input
              type="tel"
              id="phone"
              class="form-input ${this.errors.phone && this.touched.phone ? 'error' : ''}"
              .value=${this.formData.phone}
              @input=${(e: Event) => this.handleInputChange('phone', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading}
              placeholder="+90 555 11 11 11"
              required
            >
            ${this.errors.phone && this.touched.phone
        ? html`<span class="error-message">${this.errors.phone}</span>`
        : ''}
          </div>

          <div class="form-group">
            <label class="form-label" for="email">${i18n.t('email')}</label>
            <input
              type="email"
              id="email"
              class="form-input ${this.errors.email && this.touched.email ? 'error' : ''}"
              .value=${this.formData.email}
              @input=${(e: Event) => this.handleInputChange('email', (e.target as HTMLInputElement).value)}
              ?disabled=${this.loading}
              required
            >
            ${this.errors.email && this.touched.email
        ? html`<span class="error-message">${this.errors.email}</span>`
        : ''}
          </div>

          <div class="form-group">
            <label class="form-label" for="department">${i18n.t('department')}</label>
            <select
              id="department"
              class="form-select ${this.errors.department && this.touched.department ? 'error' : ''}"
              .value=${this.formData.department}
              @change=${(e: Event) => this.handleInputChange('department', (e.target as HTMLSelectElement).value)}
              ?disabled=${this.loading}
              required
            >
              <option value="">${i18n.t('selectDepartment')}</option>
              ${DEPARTMENTS.map(dept => html`
                <option value=${dept} ?selected=${this.formData.department === dept}>
                  ${dept}
                </option>
              `)}
            </select>
            ${this.errors.department && this.touched.department
        ? html`<span class="error-message">${this.errors.department}</span>`
        : ''}
          </div>

          <div class="form-group">
            <label class="form-label" for="position">${i18n.t('position')}</label>
            <select
              id="position"
              class="form-select ${this.errors.position && this.touched.position ? 'error' : ''}"
              .value=${this.formData.position}
              @change=${(e: Event) => this.handleInputChange('position', (e.target as HTMLSelectElement).value)}
              ?disabled=${this.loading}
              required
            >
              <option value="">${i18n.t('selectPosition')}</option>
              ${POSITIONS.map(pos => html`
                <option value=${pos} ?selected=${this.formData.position === pos}>
                  ${pos}
                </option>
              `)}
            </select>
            ${this.errors.position && this.touched.position
        ? html`<span class="error-message">${this.errors.position}</span>`
        : ''}
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            ?disabled=${this.loading}
          >
            ${this.loading
        ? html`
                <span class="loading">
                  <span class="spinner"></span>
                  ${isUpdate ? i18n.t('updating') : i18n.t('creating')}
                </span>
              `
        : i18n.t('save')
      }
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click=${this.handleCancel}
            ?disabled=${this.loading}
          >
            ${i18n.t('cancel')}
          </button>
        </div>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'employee-form': EmployeeForm;
  }
}
