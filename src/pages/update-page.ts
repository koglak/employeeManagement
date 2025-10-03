// src/pages/update-page.ts
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { formStyles } from '../styles/form.css.js';
import { i18n, I18nController } from '../i18n/i18n.js';
import { Router, RouterController } from '../router/router.js';
import { employeeStore } from '../stores/employee-store.js';
import type { Employee, EmployeeUpdateData } from '../models/employee.js';
import '../components/forms/employee-form.js';

@customElement('update-page')
export class UpdatePage extends LitElement {
  private i18nCtl = new I18nController(this);
  static styles = [formStyles];

  private routerController = new RouterController(this);

  @state() private employee: Employee | null = null;
  @state() private loading = false;
  @state() private pageLoading = true;

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployee();
  }

  private loadEmployee() {
    const path = this.routerController.getCurrentPath();
    const match = path.match(/^\/update\/(.+)$/);

    if (match) {
      const employeeId = match[1];
      this.employee = employeeStore.getById(employeeId);

      if (!this.employee) {
        console.error('Employee not found');
        Router.getInstance().navigate('/');
        return;
      }
    } else {
      Router.getInstance().navigate('/');
      return;
    }

    this.pageLoading = false;
  }

  private handleEmployeeSubmit(e: CustomEvent) {
    const { type, data, id } = e.detail;

    if (type === 'update' && id) {
      this.updateEmployee(id, data as EmployeeUpdateData);
    }
  }

  private async updateEmployee(id: string, data: EmployeeUpdateData) {
    this.loading = true;

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedEmployee = employeeStore.update(id, data);

      if (updatedEmployee) {
        console.log('Employee updated successfully:', updatedEmployee);
        Router.getInstance().navigate('/');
      } else {
        console.error('Failed to update employee: Employee not found');
      }
    } catch (error) {
      console.error('Failed to update employee:', error);
      // You could implement error handling/toast notifications here
    } finally {
      this.loading = false;
    }
  }

  private handleEmployeeCancel() {
    Router.getInstance().navigate('/');
  }

  render() {
    if (this.pageLoading) {
      return html`
        <div class="container">
          <div class="loading">Loading...</div>
        </div>
      `;
    }

    if (!this.employee) {
      return html`
        <div class="container">
          <div class="error">Employee not found</div>
        </div>
      `;
    }

    return html`
      <div class="container">
        <div class="header">
          <h1 class="title">${i18n.t('update')}</h1>
          <a href="/" class="back-btn">
            ← Back to ${i18n.t('home')}
          </a>
        </div>

        <employee-form 
          .employee=${this.employee}
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
    'update-page': UpdatePage;
  }
}
