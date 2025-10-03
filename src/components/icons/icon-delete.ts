import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('icon-delete')
export class IconDelete extends LitElement {
    @property({ type: String }) color?: string;
    @property({ type: Number }) size = 18;

    static styles = css`
    :host{
      display:inline-flex;
      /* color prop verilmezse tema turuncusu */
      color: var(--icon-color, var(--color-primary, #ff6a00));
    }
    svg{ display:block; }
  `;

    render() {
        const svgStyle: Record<string, string> = {
            width: `${this.size}px`,
            height: `${this.size}px`,
        };
        if (this.color) svgStyle.color = this.color;

        return html`
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
           style=${styleMap(svgStyle)}>
        <path d="M9 3h6l1 2h4v2H4V5h4l1-2zM7 9h10l-1 11H8L7 9z"></path>
      </svg>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap { 'icon-delete': IconDelete }
}
