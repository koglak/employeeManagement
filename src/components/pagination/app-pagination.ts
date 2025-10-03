// src/components/pagination/app-pagination.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-pagination')
export class AppPagination extends LitElement {
  @property({ type: Number }) currentPage = 1;
  @property({ type: Number }) totalPages = 1;
  @property({ type: Number }) totalItems = 0;
  @property({ type: Number }) itemsPerPage = 10;

  static styles = css`
    :host { display:block; }
    .pagination {
      display: flex; 
      align-items: center; 
      justify-content: center;
      gap: var(--space-2, 8px); 
      padding: var(--space-4, 16px) 0;
    }
    .page-btn, .page-num {
      border: 0; 
      background: transparent; 
      cursor: pointer;
      border-radius: 9999px; 
      padding: var(--space-2, 6px) var(--space-3, 10px);
    }
    /* Sayı düğmeleri */
    .page-num { 
      min-width: 32px; 
      height: 32px; 
      display: grid; 
      place-items: center; 
      color: var(--color-text, #2b2b2b); 
    }
    .page-num:hover { background: rgba(255,106,0,.1); }
    .page-num[aria-current="page"] {
      background: var(--color-primary, #ff6a00); 
      color: #fff; 
      font-weight: 700;
    }
    .ellipsis { 
      padding: 0 var(--space-2, 6px); 
      color: var(--color-muted, #999); 
    }

    /* Ok düğmeleri (ikon renkleri durumuna göre) */
    .page-btn { width: 32px; height: 32px; display: grid; place-items: center; }
    .page-btn svg { 
      width: 18px; 
      height: 18px; 
      color: var(--color-primary, #ff6a00); 
    }
    .page-btn[disabled] { cursor: not-allowed; }
    .page-btn[disabled] svg { color: #c8c8c8; }         /* görseldeki sol gri ok */
    .page-btn:not([disabled]):hover { background: rgba(255,106,0,.1); }
  `;

  private generatePageList(): (number | '...')[] {
    const total = this.totalPages, current = this.currentPage;
    const out: (number | '...')[] = [];
    const add = (n: number) => { if (!out.includes(n)) out.push(n); };

    add(1);
    if (current > 4) out.push('...');
    for (let n = Math.max(2, current - 2); n <= Math.min(total - 1, current + 2); n++) add(n);
    if (current < total - 3) out.push('...');
    if (total > 1) add(total);
    return out;
  }

  private goToPage(page: number) {
    const next = Math.min(this.totalPages, Math.max(1, page));
    if (next !== this.currentPage) {
      this.dispatchEvent(new CustomEvent('page-change', {
        detail: { page: next }, bubbles: true, composed: true
      }));
    }
  }

  render() {
    if (this.totalPages <= 1) return html``;

    const pages = this.generatePageList();
    const prevDisabled = this.currentPage <= 1;
    const nextDisabled = this.currentPage >= this.totalPages;

    return html`
      <div class="pagination" role="navigation" aria-label="Pagination">
        <!-- Sol (geri) ok: ilk sayfada gri/disabled -->
        <button class="page-btn" title="Previous" ?disabled=${prevDisabled}
                @click=${() => this.goToPage(this.currentPage - 1)}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        ${pages.map(p => p === '...'
      ? html`<span class="ellipsis">…</span>`
      : html`<button class="page-num"
                        aria-current=${this.currentPage === p ? 'page' : 'false'}
                        @click=${() => this.goToPage(p as number)}>${p}</button>`
    )}

        <!-- Sağ (ileri) ok: aktifken turuncu -->
        <button class="page-btn" title="Next" ?disabled=${nextDisabled}
                @click=${() => this.goToPage(this.currentPage + 1)}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
          </svg>
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-pagination': AppPagination;
  }
}
