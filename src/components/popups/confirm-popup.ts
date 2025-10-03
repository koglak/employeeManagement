// src/components/modals/confirm-popup.ts (aynı isim/yol)
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n } from '../../i18n/i18n';
import { popupStyles } from '../../styles';

export interface ConfirmPopupOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@customElement('confirm-popup')
export class ConfirmPopup extends LitElement {
    @property({ type: Boolean, reflect: true }) open = false;
    @property({ type: String }) title = '';
    @property({ type: String }) message = '';
    @property({ type: String }) confirmText = i18n.t('proceed') || 'Proceed';
    @property({ type: String }) cancelText = i18n.t('cancel') || 'Cancel';

    private _onKeyDown = (e: KeyboardEvent) => {
        if (!this.open) return;
        if (e.key === 'Escape') this.handleCancel();
        if (e.key === 'Enter') this.handleConfirm();
    };

    static styles = popupStyles;

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this._onKeyDown);
    }
    disconnectedCallback() {
        document.removeEventListener('keydown', this._onKeyDown);
        super.disconnectedCallback();
    }

    show(opts: ConfirmPopupOptions) {
        this.title = opts.title;
        this.message = opts.message;
        if (opts.confirmText) this.confirmText = opts.confirmText;
        if (opts.cancelText) this.cancelText = opts.cancelText;
        this.open = true;
    }
    hide() { this.open = false; }

    private handleOverlayClick(e: Event) {
        if (e.target === e.currentTarget) this.handleCancel();
    }
    private handleConfirm() {
        this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
        this.hide();
    }
    private handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
        this.hide();
    }

    render() {
        return html`
      <div class="overlay" @click=${this.handleOverlayClick}>
        <div class="popup" role="dialog" aria-modal="true" aria-labelledby="cp-title">
          <div class="box">
            <div class="title-row">
              <h3 id="cp-title" class="title">${this.title}</h3>
              <button class="close" aria-label="${i18n.t('close') || 'Close'}" @click=${this.handleCancel}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3 10.6 10.6 16.9 4.3z"/>
                </svg>
              </button>
            </div>

            <p class="message">${this.message}</p>

            <div class="actions">
              <button class="btn btn-primary" @click=${this.handleConfirm}>${this.confirmText}</button>
              <button class="btn btn-secondary" @click=${this.handleCancel}>${this.cancelText}</button>
            </div>
          </div>
        </div>
      </div>
    `;
    }
}

declare global { interface HTMLElementTagNameMap { 'confirm-popup': ConfirmPopup } }
