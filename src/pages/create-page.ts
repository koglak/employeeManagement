import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { formStyles } from '../styles/form.css.js';
import { i18n, I18nController } from '../i18n/i18n.js';
import { employeeStore } from '../stores/employee-store.js';
import { Router } from '../router/router.js';
import type { EmployeeCreateData } from '../models/employee.js';
import '../components/forms/employee-form.js';

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
                this.errorMessage = `Employee with email "${data.email}" already exists!`;
                this.showErrorPopup(this.errorMessage);
                return;
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const newEmployee = employeeStore.add(data);
            console.log('Employee created successfully:', newEmployee);

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
        // Simple browser alert for now - could be replaced with a custom modal
        alert(message);
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
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'create-page': CreatePage;
    }
}
