// src/components/employee/view-selector.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n, I18nController } from '../../i18n/i18n';

import '../icons/icon-menu';
import '../icons/icon-grid';

export type ViewMode = 'table' | 'grid';

@customElement('view-selector')
export class ViewSelector extends LitElement {
    private _i18n = new I18nController(this);

    @property() currentView: ViewMode = 'table';

    static styles = css`
    :host { display:inline-flex; }

    /* sadece iki ikon, arada boşluk */
    .view-toggle {
      display:flex; align-items:center; gap:16px;
      background: transparent; border:0; padding: 0;
    }

    .icon-btn {
      border:0; background:transparent; cursor:pointer;
      display:inline-flex; align-items:center; justify-content:center;
      width:28px; height:28px; line-height:0; border-radius:6px;

      /* PASİF renk (açık turuncu) */
      color: rgba(255,106,0,.35);
      transition: background .15s ease, color .15s ease;
    }

    /* AKTİF renk (turuncu) */
    .icon-btn[aria-pressed="true"] {
      color: var(--color-primary, #ff6a00);
    }

    .icon-btn:focus-visible {
      outline: 2px solid var(--color-primary, #ff6a00);
      outline-offset: 2px;
      border-radius: 6px;
    }
  `;

    private change(view: ViewMode) {
        if (view === this.currentView) return;
        this.currentView = view;
        this.dispatchEvent(new CustomEvent('view-change', {
            detail: { view }, bubbles: true
        }));
    }

    render() {
        return html`
      <div class="view-toggle" role="group" aria-label="View options">
        <button
          class="icon-btn"
          title=${i18n.t('table')}
          aria-label=${i18n.t('table')}
          aria-pressed=${this.currentView === 'table'}
          @click=${() => this.change('table')}
        >
          <icon-menu></icon-menu>
        </button>

        <button
          class="icon-btn"
          title=${i18n.t('grid')}
          aria-label=${i18n.t('grid')}
          aria-pressed=${this.currentView === 'grid'}
          @click=${() => this.change('grid')}
        >
          <icon-grid></icon-grid>
        </button>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap { 'view-selector': ViewSelector; }
}
