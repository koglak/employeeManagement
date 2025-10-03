import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('icon-edit')
export class IconEdit extends LitElement {
    @property({ type: String }) color?: string;
    @property({ type: Number }) size = 18;

    static styles = css`
    :host { display:inline-flex; color: var(--icon-color, var(--color-primary, #ff6a00)); }
    svg { display:block; }
  `;

    render() {
        const svgStyle: Record<string, string> = {
            width: `${this.size}px`,
            height: `${this.size}px`,
        };
        if (this.color) svgStyle.color = this.color;

        return html`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        style=${styleMap(svgStyle)}
      >
        <rect x="3" y="3" width="18" height="18" rx="3"></rect>
        <path d="M9 15l6.5-6.5a1.5 1.5 0 0 1 2.12 0 1.5 1.5 0 0 1 0 2.12L11 17H9z"></path>
      </svg>
    `;
    }
}
declare global { interface HTMLElementTagNameMap { 'icon-edit': IconEdit } }
