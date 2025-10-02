import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
@customElement('icon-menu')
export class IconMenu extends LitElement {
    static styles = css`:host{display:inline-flex} svg{width:20px;height:20px}`;
    render() {
        return html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"/></svg>`}
}
declare global { interface HTMLElementTagNameMap { 'icon-menu': IconMenu } }
