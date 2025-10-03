import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { formStyles } from '../styles/form.css.js';
import { i18n, I18nController } from '../i18n/i18n.js';
import { employeeStore } from '../stores/employee-store.js';
import { Router } from '../router/router.js';
import type { EmployeeCreateData } from '../models/employee.js';
import { isAtLeast18YearsOld } from '../models/employee.js';
import '../components/forms/employee-form.js';
import '../components/popups/info-popup.js';

@customElement('create-page')
export class CreatePage extends LitElement {
    private i18nCtl = new I18nController(this);
    static styles = [formStyles];

    @state() private loading = false;
    @state() private errorMessage = '';

    private handleEmployeeSubmit(e: CustomEvent) {
        const { type, data } = e.detail;

        if (type === 'create') {
            this.createEmployee(data as EmployeeCreateData);
        }
    }

    private async createEmployee(data: EmployeeCreateData) {
        this.loading = true;
        this.errorMessage = '';

        try {
            // Check if employee with this email already exists
            const existingEmployee = employeeStore.findByEmail(data.email);
            if (existingEmployee) {
                this.showDuplicateEmployeePopup(data.email);
                return;
            }

            // Check if employee is at least 18 years old
            if (!isAtLeast18YearsOld(data.birthDate)) {
                this.showAgeValidationPopup();
                return;
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            employeeStore.add(data);

            // Navigate to home page on success
            Router.getInstance().navigate('/');
        } catch (error) {
            console.error('Failed to create employee:', error);
            this.errorMessage = 'Failed to create employee. Please try again.';
            this.showErrorPopup(this.errorMessage);
        } finally {
            this.loading = false;
        }
    }

    private showErrorPopup(message: string) {
        const infoPopup = this.shadowRoot?.querySelector('info-popup') as any;
        if (infoPopup) {
            infoPopup.show({
                title: 'Error',
                message: message,
                type: 'error'
            });
        }
    }

    private showDuplicateEmployeePopup(email: string) {
        const infoPopup = this.shadowRoot?.querySelector('info-popup') as any;
        if (infoPopup) {
            infoPopup.show({
                title: i18n.t('duplicateEmployee'),
                message: `${i18n.t('employeeExistsMessage')}: ${email}`,
                type: 'warning'
            });
        }
    }

    private showAgeValidationPopup() {
        const infoPopup = this.shadowRoot?.querySelector('info-popup') as any;
        if (infoPopup) {
            infoPopup.show({
                title: i18n.t('invalidAge'),
                message: i18n.t('employeeTooYoungMessage'),
                type: 'warning'
            });
        }
    }

    private handleEmployeeCancel() {
        Router.getInstance().navigate('/');
    }

    render() {
        return html`
      <div class="container">
        <div class="header">
          <h1 class="title">${i18n.t('create')}</h1>
        </div>

        <employee-form 
          .loading=${this.loading}
          @employee-submit=${this.handleEmployeeSubmit}
          @employee-cancel=${this.handleEmployeeCancel}
        ></employee-form>
      </div>
      
      <info-popup></info-popup>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'create-page': CreatePage;
    }
}
