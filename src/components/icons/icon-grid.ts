import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
@customElement('icon-grid')
export class IconGrid extends LitElement {
    static styles = css`:host{display:inline-flex} svg{width:20px;height:20px}`;
    render() { return html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/></svg>` }
}
declare global { interface HTMLElementTagNameMap { 'icon-grid': IconGrid } }
