// src/pages/home-page.ts
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { i18n, I18nController } from '../i18n/i18n';
import { Router } from '../router/router';
import type { Employee } from '../models/employee';
import { employeeStore } from '../stores/employee-store';

// Import components
import '../components/icons/icon-menu';
import '../components/icons/icon-grid';
import '../components/employee/employee-grid';
import '../components/employee/employee-table';
import '../components/employee/view-selector';
import '../components/pagination/app-pagination';

type ViewMode = 'table' | 'grid';

@customElement('home-page')
export class HomePage extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private i18nCtl = new I18nController(this);

  @state() private employees: Employee[] = [];
  @state() private view: ViewMode = 'table';
  @state() private currentPage = 1;
  @state() private searchTerm = '';

  static styles = css`
    :host { 
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      background: var(--color-bg, #f6f6f6);
      overflow: hidden;
    }

    /* Header */
    .page-head {
      display: flex; 
      align-items: center; 
      justify-content: space-between;
      padding: 16px 24px;
      flex-shrink: 0;
    }
    
    .title {
      color: var(--color-primary, #ff6a00);
      font-size: var(--font-size-2xl); 
      font-weight: 800; 
      letter-spacing: .2px;
      margin: 0;
    }
    
    .controls {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    /* Search */
    .search-box {
      padding: 16px 24px;
      background: var(--color-surface, #fff);
      border-bottom: 1px solid #e0e0e0;
      flex-shrink: 0;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px 0;
    }

    .content-scroll {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 16px;
    }

    @media (max-width: 768px) {
      .page-head {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .controls {
        justify-content: center;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();
  }

  private async loadEmployees() {
    this.employees = await employeeStore.getAllEmployees();
  }

  private get currentPageSize() {
    return this.view === 'grid' ? 4 : 10; // Grid: 4, Table: 10
  }

  private get totalPages() {
    return Math.max(1, Math.ceil(this.filteredEmployees.length / this.currentPageSize));
  }

  private get filteredEmployees() {
    if (!this.searchTerm) return this.employees;

    const term = this.searchTerm.toLowerCase();
    return this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term)
    );
  }

  private get pagedEmployees() {
    const start = (this.currentPage - 1) * this.currentPageSize;
    return this.filteredEmployees.slice(start, start + this.currentPageSize);
  }

  private handlePageChange(e: CustomEvent) {
    this.currentPage = e.detail.page;
  }

  private handleEditEmployee(e: CustomEvent) {
    const employee = e.detail.employee;
    Router.getInstance().navigate(`/update/${employee.id}`);
  }

  private handleDeleteEmployee(e: CustomEvent) {
    const employee = e.detail.employee;
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      employeeStore.delete(employee.id);
      this.loadEmployees();
    }
  }

  private handleViewChange(newView: ViewMode) {
    this.view = newView;
    this.currentPage = 1; // Reset to first page when changing view
  }

  private handleViewChangeEvent(e: CustomEvent) {
    this.handleViewChange(e.detail.view);
  }

  render() {
    return html`
      <div class="page-head">
        <h2 class="title">${i18n.t('brand')}</h2>
        <div class="controls">
          <view-selector 
            .currentView=${this.view}
            @view-change=${this.handleViewChangeEvent}
          ></view-selector>
        </div>
      </div>

      <div class="content-area">
        <div class="content-scroll">
          ${this.view === 'grid'
        ? html`
                <employee-grid 
                  .employees=${this.pagedEmployees}
                  @edit-employee=${this.handleEditEmployee}
                  @delete-employee=${this.handleDeleteEmployee}
                ></employee-grid>
              `
        : html`
                <employee-table 
                  .employees=${this.pagedEmployees}
                  @edit-employee=${this.handleEditEmployee}
                  @delete-employee=${this.handleDeleteEmployee}
                ></employee-table>
              `
      }
        </div>

        <app-pagination
          .currentPage=${this.currentPage}
          .totalPages=${this.totalPages}
          .totalItems=${this.filteredEmployees.length}
          .itemsPerPage=${this.currentPageSize}
          @page-change=${this.handlePageChange}
        ></app-pagination>
      </div>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'home-page': HomePage; } }
