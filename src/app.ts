import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { theme } from './styles/theme.css.ts';
import './components/navbar/app-navbar';

@customElement('employee-app')
export class EmployeeApp extends LitElement {
    static styles = [theme, css`
    :host{ display:block; background: var(--color-bg); min-height:100svh; color: var(--color-text); }
    main { max-width: 1200px; margin: 16px auto; padding: 0 16px; }
  `];

    render() {
        return html`
      <app-navbar></app-navbar>
      <main>
        <!-- ilerleyen adımlarda tablo/grid burada -->
      </main>
    `;
    }
}
declare global { interface HTMLElementTagNameMap { 'employee-app': EmployeeApp } }
