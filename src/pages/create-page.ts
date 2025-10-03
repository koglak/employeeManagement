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

    private handleEmployeeSubmit(e: CustomEvent) {
        const { type, data } = e.detail;

        if (type === 'create') {
            this.createEmployee(data as EmployeeCreateData);
        }
    }

    private async createEmployee(data: EmployeeCreateData) {
        this.loading = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            employeeStore.add(data);
            Router.getInstance().navigate('/');
        } catch (error) {
        } finally {
            this.loading = false;
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
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'create-page': CreatePage;
    }
}
