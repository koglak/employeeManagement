// src/components/employee/employee-grid.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Employee } from '../../models/employee';
import '../icons/icon-edit';
import '../icons/icon-delete';
import { formatPhone } from '../../utils/phone';
import { i18n, I18nController } from '../../i18n/i18n';
import { gridStyles } from '../../styles/grid.css';

@customElement('employee-grid')
export class EmployeeGrid extends LitElement {
  private i18nController = new I18nController(this);

  @property({ type: Array }) employees: Employee[] = [];

  static styles = gridStyles;

  private edit(employee: Employee) {
    this.dispatchEvent(new CustomEvent('edit-employee', { detail: { employee }, bubbles: true, composed: true }));
  }

  private del(employee: Employee) {
    this.dispatchEvent(new CustomEvent('delete-employee', { detail: { employee }, bubbles: true, composed: true }));
  }

  render() {
    if (!this.employees?.length) {
      return html`
        <div class="grid-wrap">
          <div class="empty-state">
            <div class="label">No employees found</div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="grid-wrap">
        <div class="grid">
          ${this.employees.map(emp => html`
            <article class="emp-card">
              <div class="kv">
                <div class="field">
                  <span class="label">${i18n.t('firstName')}:</span>
                  <span class="value">${emp.firstName}</span>
                </div>
                <div class="field">
                  <span class="label">${i18n.t('lastName')}:</span>
                  <span class="value">${emp.lastName}</span>
                </div>

                <div class="field">
                  <span class="label">${i18n.t('employmentDate')}:</span>
                  <span class="value">${new Date(emp.employmentDate).toLocaleDateString()}</span>
                </div>
                <div class="field">
                  <span class="label">${i18n.t('birthDate')}:</span>
                  <span class="value">${new Date(emp.birthDate).toLocaleDateString()}</span>
                </div>

                <div class="field">
                  <span class="label">${i18n.t('phone')}:</span>
                  <span class="value">${formatPhone(emp.phone)}</span>
                </div>
                <div class="field">
                  <span class="label">${i18n.t('email')}:</span>
                  <span class="value">${emp.email}</span>
                </div>

                <div class="field">
                  <span class="label">${i18n.t('department')}:</span>
                  <span class="value">${emp.department}</span>
                </div>
                <div class="field">
                  <span class="label">${i18n.t('position')}:</span>
                  <span class="value">${emp.position}</span>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn btn-edit" @click=${() => this.edit(emp)}>
                  <icon-edit style="--icon-color:#fff"></icon-edit> ${i18n.t('edit')}
                </button>
                <button class="btn btn-del" @click=${() => this.del(emp)}>
                  <icon-delete style="--icon-color:#fff"></icon-delete> ${i18n.t('delete')}
                </button>
              </div>
            </article>
          `)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'employee-grid': EmployeeGrid; }
}