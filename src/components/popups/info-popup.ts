// src/components/popups/info-popup.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n } from '../../i18n/i18n';
import { popupStyles, infoPopupStyles } from '../../styles';

export interface InfoPopupOptions {
    title: string;
    message: string;
    okText?: string;
    type?: 'info' | 'warning' | 'error' | 'success';
}

@customElement('info-popup')
export class InfoPopup extends LitElement {
    @property({ type: Boolean, reflect: true }) open = false;
    @property({ type: String }) title = '';
    @property({ type: String }) message = '';
    @property({ type: String }) okText = i18n.t('ok') || 'OK';
    @property({ type: String }) type: 'info' | 'warning' | 'error' | 'success' = 'info';

    private _onKeyDown = (e: KeyboardEvent) => {
        if (!this.open) return;
        if (e.key === 'Escape' || e.key === 'Enter') this.handleOk();
    };

    static styles = [popupStyles, infoPopupStyles];

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this._onKeyDown);
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this._onKeyDown);
        super.disconnectedCallback();
    }

    show(opts: InfoPopupOptions) {
        this.title = opts.title;
        this.message = opts.message;
        this.type = opts.type || 'info';
        if (opts.okText) this.okText = opts.okText;
        this.open = true;
    }

    hide() {
        this.open = false;
    }

    private handleOverlayClick(e: Event) {
        if (e.target === e.currentTarget) this.handleOk();
    }

    private handleOk() {
        this.dispatchEvent(new CustomEvent('ok', { bubbles: true, composed: true }));
        this.hide();
    }

    private renderIcon() {
        switch (this.type) {
            case 'warning':
                return html`
                    <svg class="icon warning" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                `;
            case 'error':
                return html`
                    <svg class="icon error" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                `;
            case 'success':
                return html`
                    <svg class="icon success" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                `;
            case 'info':
            default:
                return html`
                    <svg class="icon info" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                `;
        }
    }

    render() {
        return html`
            <div class="overlay" @click=${this.handleOverlayClick}>
                <div class="popup ${this.type}" role="dialog" aria-modal="true" aria-labelledby="ip-title">
                    <div class="box">
                        <div class="title-row">
                            <h3 id="ip-title" class="title">${this.title}</h3>
                            <button class="close" aria-label="${i18n.t('close') || 'Close'}" @click=${this.handleOk}>
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3 10.6 10.6 16.9 4.3z"/>
                                </svg>
                            </button>
                        </div>

                        <div class="message-container">
                            ${this.renderIcon()}
                            <p class="message">${this.message}</p>
                        </div>

                        <div class="actions">
                            <button class="btn btn-primary" @click=${this.handleOk}>${this.okText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'info-popup': InfoPopup
    }
}
