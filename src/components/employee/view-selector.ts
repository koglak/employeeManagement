// src/components/employee/view-selector.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n, I18nController } from '../../i18n/i18n';

import '../icons/icon-menu';
import '../icons/icon-grid';
import { viewSelectorStyles } from '../../styles/view-selector.css';
import type { ViewMode } from '../../constants/interfaces';

@customElement('view-selector')
export class ViewSelector extends LitElement {
  private _i18n = new I18nController(this);

  @property() currentView: ViewMode = 'table';

  static styles = viewSelectorStyles;

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
