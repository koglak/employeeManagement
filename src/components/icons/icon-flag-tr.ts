import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
@customElement('icon-flag-tr')
export class IconFlagTR extends LitElement {
    static styles = css`:host{display:inline-flex} svg{width:18px;height:18px;border-radius:2px}`;
    render() {
        return html`<svg viewBox="0 0 24 24">
    <rect width="24" height="24" fill="#e30a17"/>
    <circle cx="10" cy="12" r="5" fill="#fff"/>
    <circle cx="11.5" cy="12" r="4" fill="#e30a17"/>
    <path d="M14.5 12l3.5 2.1-1.3-3.9 3.3-2.4h-4.1L14.5 4l-1 3.8h-4l3.2 2.4-1.2 3.9z" fill="#fff"/>
  </svg>`}
}
declare global { interface HTMLElementTagNameMap { 'icon-flag-tr': IconFlagTR } }
