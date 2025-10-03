import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Employee } from '../../models/employee';
import '../icons/icon-edit';
import '../icons/icon-delete';
import { formatPhone } from '../../utils/phone';
import { i18n, I18nController } from '../../i18n/i18n';
import { tableStyles } from '../../styles/table.css';

@customElement('employee-table')
export class EmployeeTable extends LitElement {
  private i18nController = new I18nController(this);
  @property({ type: Array }) employees: Employee[] = [];
  @state() private selected = new Set<string>();

  static styles = tableStyles;

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
