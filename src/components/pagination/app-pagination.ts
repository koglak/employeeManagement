// src/components/pagination/app-pagination.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { paginationStyles } from '../../styles/pagination.css';

@customElement('app-pagination')
export class AppPagination extends LitElement {
  @property({ type: Number }) currentPage = 1;
  @property({ type: Number }) totalPages = 1;
  @property({ type: Number }) totalItems = 0;
  @property({ type: Number }) itemsPerPage = 10;

  static styles = paginationStyles;

  private generatePageList(): (number | '...')[] {
    const total = this.totalPages, current = this.currentPage;
    const out: (number | '...')[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) out.push(i);
      return out;
    }

    out.push(1);
    if (current > 4) out.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) out.push(i);

    if (current < total - 3) out.push('...');
    out.push(total);

    return out;
  }

  private goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.dispatchEvent(new CustomEvent('page-change', {
        detail: { page },
        bubbles: true,
        composed: true
      }));
    }
  }

  render() {
    if (this.totalPages <= 1) return html``;

    const pages = this.generatePageList();
    const canPrev = this.currentPage > 1;
    const canNext = this.currentPage < this.totalPages;

    return html`
      <div class="pagination">
        <button class="page-btn" ?disabled=${!canPrev} @click=${() => this.goToPage(this.currentPage - 1)}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        ${pages.map(page =>
      page === '...'
        ? html`<span class="ellipsis">...</span>`
        : html`
                <button 
                  class="page-num" 
                  aria-current=${page === this.currentPage ? 'page' : 'false'}
                  @click=${() => this.goToPage(page as number)}
                >
                  ${page}
                </button>
              `
    )}

        <button class="page-btn" ?disabled=${!canNext} @click=${() => this.goToPage(this.currentPage + 1)}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'app-pagination': AppPagination; }
}