// src/components/employee/employee-grid.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Employee } from '../../models/employee';
import '../icons/icon-edit';
import '../icons/icon-delete';
import { formatPhone } from '../../utils/phone';
import { i18n, I18nController } from '../../i18n/i18n';

@customElement('employee-grid')
export class EmployeeGrid extends LitElement {
  private i18nController = new I18nController(this);

  @property({ type: Array }) employees: Employee[] = [];

  static styles = css`
    :host { display:block; }

    .grid-wrap {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-4, 16px) var(--space-6, 24px);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px 32px;
    }
    @media (max-width: 900px){
      .grid { grid-template-columns: 1fr; }
    }

    .emp-card {
      background: var(--color-surface, #fff);
      border: 1px solid #dedede;
      border-radius: var(--radius, 12px);
      padding: var(--space-6, 24px);
      box-shadow: var(--shadow, 0 4px 14px rgba(0,0,0,.06));
      transition: box-shadow .2s ease, transform .2s ease;
    }
    .emp-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.10); transform: translateY(-2px); }

    .kv {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 36px;
      row-gap: 18px;
    }
    @media (max-width: 600px){
      .kv { grid-template-columns: 1fr; gap: 12px; }
    }

    .field { display:flex; flex-direction:column; }
    .label {
      color: var(--color-muted, #9a9a9a);
      font-size: var(--font-size-xs, 13px);
      line-height: 1.2;
      margin-bottom: 6px;
    }
    .value {
      color: var(--color-text, #2b2b2b);
      font-size: var(--font-size-base, 16px);
      font-weight: 700;
      word-break: break-word;
    }

    .card-actions {
      display: flex; 
      gap: var(--space-3, 12px);
      margin-top: var(--space-5, 18px); 
      padding-top: var(--space-5, 18px);
    }
    .btn {
      display: inline-flex; 
      align-items: center; 
      gap: var(--space-2, 8px);
      border: 0; 
      cursor: pointer; 
      border-radius: var(--radius, 8px);
      padding: var(--space-2, 8px) var(--space-4, 14px); 
      color: #fff; 
      font-weight: 600; 
      font-size: var(--font-size-sm, 14px);
      transition: filter .2s ease, transform .2s ease;
    }
    .btn svg, .btn icon-edit, .btn icon-delete { width:14px; height:14px; }
    .btn-edit { background:#5a52b3; }
    .btn-del  { background: var(--color-primary, #ff6a00); }
    .btn:hover { filter:brightness(.95); transform: translateY(-1px); }
  `;

  private edit(employee: Employee) {
    this.dispatchEvent(new CustomEvent('edit-employee', { detail: { employee }, bubbles: true, composed: true }));
  }
  private del(employee: Employee) {
    this.dispatchEvent(new CustomEvent('delete-employee', { detail: { employee }, bubbles: true, composed: true }));
  }

  render() {
    if (!this.employees?.length) {
      return html`
        <div class="grid-wrap"><div class="emp-card" style="text-align:center">
          <div class="label" style="font-size: var(--font-size-sm, 14px); color: var(--color-muted, #666)">No employees found</div>
        </div></div>
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
