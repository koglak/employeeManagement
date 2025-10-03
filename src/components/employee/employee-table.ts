import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Employee } from '../../models/employee';
import '../icons/icon-edit';
import '../icons/icon-delete';
import { formatPhone } from '../../utils/phone';
import { i18n, I18nController } from '../../i18n/i18n';

@customElement('employee-table')
export class EmployeeTable extends LitElement {
  private i18nController = new I18nController(this);
  @property({ type: Array }) employees: Employee[] = [];
  @state() private selected = new Set<string>();

  static styles = css`
    :host { display:block; }
    .table-container{ 
      margin: 0 var(--space-6, 24px); 
      padding: var(--space-4, 16px); 
      background: var(--color-surface, #fff); 
      border: 1px solid #eee; 
      border-radius: var(--radius, 12px); 
      overflow-x: auto; 
    }
    table{ 
      width: 100%; 
      border-collapse: collapse; 
      font-size: var(--font-size-sm, 14px); 
    }
    thead th{
      font-weight: 700; 
      color: var(--color-primary, #ff6a00); 
      text-align: left; 
      font-size: var(--font-size-xs, 13px);
      padding: var(--space-4, 14px) var(--space-3, 12px); 
      border-bottom: 1px solid #f0f0f0; 
      white-space: nowrap; 
      background: var(--color-surface, #fff);
    }
    tbody td{ 
      padding: var(--space-4, 16px) var(--space-3, 12px); 
      border-bottom: 1px solid #f4f4f4; 
      white-space: nowrap; 
      vertical-align: middle; 
      color: var(--color-text, #2b2b2b); 
    }
    tbody tr:hover{ background: rgba(255,106,0,.03); }
    tbody tr:last-child td{ border-bottom: none; }

    .chk{ width: 44px; text-align: center; }
    .actions{ width: 72px; text-align: right; }

    /* turuncu checkbox */
    input[type="checkbox"]{ 
      width: 16px; 
      height: 16px; 
      accent-color: var(--color-primary, #ff6a00); 
    }

    .first{ font-weight: 600; }

    .actions-cell{ 
      display: flex; 
      gap: var(--space-3, 12px); 
      justify-content: flex-end; 
    }
    .icon-btn{
      border: 0; 
      background: transparent; 
      cursor: pointer; 
      padding: 0; 
      line-height: 0;
      color: var(--color-primary, #ff6a00);
    }
    .icon-btn:hover{ filter: brightness(0.9); }
    .icon-btn icon-edit, .icon-btn icon-delete{ width: 18px; height: 18px; }
  `;

  private get allSelected() {
    return this.employees.length > 0 && this.employees.every(e => this.selected.has(e.id));
  }
  private toggleAll(e: Event) {
    const on = (e.target as HTMLInputElement).checked;
    const next = new Set(this.selected);
    this.employees.forEach(emp => on ? next.add(emp.id) : next.delete(emp.id));
    this.selected = next;
  }
  private toggleOne(id: string, e: Event) {
    const on = (e.target as HTMLInputElement).checked;
    const next = new Set(this.selected);
    on ? next.add(id) : next.delete(id);
    this.selected = next;
  }

  private edit(emp: Employee) { this.dispatchEvent(new CustomEvent('edit-employee', { detail: { employee: emp }, bubbles: true, composed: true })); }
  private del(emp: Employee) { this.dispatchEvent(new CustomEvent('delete-employee', { detail: { employee: emp }, bubbles: true, composed: true })); }

  render() {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="chk"><input type="checkbox" .checked=${this.allSelected} @change=${this.toggleAll} aria-label="Select all" /></th>
              <th>${i18n.t('firstName')}</th>
              <th>${i18n.t('lastName')}</th>
              <th class="hide-sm">${i18n.t('employmentDate')}</th>
              <th class="hide-sm">${i18n.t('birthDate')}</th>
              <th>${i18n.t('phone')}</th>
              <th>${i18n.t('email')}</th>
              <th class="hide-sm">${i18n.t('department')}</th>
              <th class="hide-sm">${i18n.t('position')}</th>
              <th class="actions">${i18n.t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(emp => html`
              <tr>
                <td class="chk">
                  <input type="checkbox" .checked=${this.selected.has(emp.id)} @change=${(e: Event) => this.toggleOne(emp.id, e)} aria-label="Select row" />
                </td>
                <td class="first">${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td class="hide-sm">${new Date(emp.employmentDate).toLocaleDateString()}</td>
                <td class="hide-sm">${new Date(emp.birthDate).toLocaleDateString()}</td>
                <td>${formatPhone(emp.phone)}</td>
                <td>${emp.email}</td>
                <td class="hide-sm">${emp.department}</td>
                <td class="hide-sm">${emp.position}</td>
                <td class="actions">
                  <div class="actions-cell">
                    <button class="icon-btn" title="Edit" @click=${() => this.edit(emp)}><icon-edit style="--icon-color:#ff6a00"></icon-edit></button>
                    <button class="icon-btn" title="Delete" @click=${() => this.del(emp)}><icon-delete style="--icon-color:#ff6a00"></icon-delete></button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { 'employee-table': EmployeeTable } }
