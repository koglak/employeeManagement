import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
@customElement('icon-flag-en')
export class IconFlagEN extends LitElement {
    static styles = css`:host{display:inline-flex} svg{width:18px;height:18px;border-radius:2px}`;
    render() {
        return html`<svg viewBox="0 0 24 24">
    <rect width="24" height="24" fill="#012169"/>
    <path d="M0 0l24 24M24 0L0 24" stroke="#fff" stroke-width="5"/>
    <path d="M0 0l24 24M24 0L0 24" stroke="#C8102E" stroke-width="3"/>
    <path d="M10 0h4v24h-4zM0 10v4h24v-4z" fill="#fff"/>
    <path d="M11 0h2v24h-2zM0 11v2h24v-2z" fill="#C8102E"/>
  </svg>`}
}
declare global { interface HTMLElementTagNameMap { 'icon-flag-en': IconFlagEN } }
