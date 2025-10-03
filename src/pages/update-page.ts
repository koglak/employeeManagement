// src/pages/update-page.ts
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { formStyles } from '../styles/form.css.js';
import { i18n, I18nController } from '../i18n/i18n.js';
import { Router, RouterController } from '../router/router.js';
import { employeeStore } from '../stores/employee-store.js';
import type { Employee, EmployeeUpdateData } from '../models/employee.js';
import '../components/forms/employee-form.js';
import '../components/popups/info-popup.js';

@customElement('update-page')
export class UpdatePage extends LitElement {
  private i18nCtl = new I18nController(this);
  static styles = [formStyles];

  private routerController = new RouterController(this);

  @state() private employee: Employee | null = null;
  @state() private loading = false;
  @state() private pageLoading = true;
  @state() private errorMessage = '';

  connectedCallback() {
    super.connectedCallback();
    this.routerController.hostConnected();
    this.loadEmployee();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.routerController.hostDisconnected();
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
    this.errorMessage = '';

    try {
      // Check if email is being changed and if new email already exists
      if (data.email && data.email !== this.employee?.email) {
        const existingEmployee = employeeStore.findByEmail(data.email);
        if (existingEmployee && existingEmployee.id !== id) {
          this.showDuplicateEmployeePopup(data.email);
          return;
        }
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedEmployee = employeeStore.update(id, data);

      if (updatedEmployee) {
        console.log('Employee updated successfully:', updatedEmployee);
        // Navigate to home page on success
        Router.getInstance().navigate('/');
      } else {
        this.errorMessage = 'Failed to update employee: Employee not found';
        this.showErrorPopup(this.errorMessage);
      }
    } catch (error) {
      console.error('Failed to update employee:', error);
      this.errorMessage = 'Failed to update employee. Please try again.';
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
  } private handleEmployeeCancel() {
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
        </div>

        <employee-form 
          .employee=${this.employee}
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
    'update-page': UpdatePage;
  }
}
