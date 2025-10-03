// src/pages/home-page.ts
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { i18n } from '../i18n/i18n';
import { Router } from '../router/router';
import type { Employee } from '../models/employee';
import { employeeStore } from '../stores/employee-store';
import { homeStyles } from '../styles/home.css';

// Import components
import '../components/icons/icon-menu';
import '../components/icons/icon-grid';
import '../components/employee/employee-grid';
import '../components/employee/employee-table';
import '../components/employee/view-selector';
import '../components/pagination/app-pagination';
import '../components/popups/confirm-popup';

type ViewMode = 'table' | 'grid';

@customElement('home-page')
export class HomePage extends LitElement {
  @state() private employees: Employee[] = [];
  @state() private view: ViewMode = 'table';
  @state() private currentPage = 1;
  @state() private searchTerm = '';
  @state() private showDeleteConfirm = false;
  @state() private employeeToDelete: Employee | null = null;

  static styles = homeStyles;

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
    this.employeeToDelete = employee;
    this.showDeleteConfirm = true;
  }

  private confirmDelete() {
    if (this.employeeToDelete) {
      employeeStore.delete(this.employeeToDelete.id);
      this.loadEmployees();
    }
    this.hideDeleteConfirm();
  }

  private hideDeleteConfirm() {
    this.showDeleteConfirm = false;
    this.employeeToDelete = null;
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

      ${this.showDeleteConfirm && this.employeeToDelete ? html`
        <confirm-popup 
          .open=${true}
          .title=${i18n.t('confirmDelete')}
          .message=${i18n.t('employeeDeleteMessage').replace('{name}', `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}`)}
          .confirmText=${i18n.t('delete')}
          .cancelText=${i18n.t('cancel')}
          @confirm=${this.confirmDelete}
          @cancel=${this.hideDeleteConfirm}
        ></confirm-popup>
      ` : ''}
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'home-page': HomePage; } }
