// src/components/navbar/app-navbar.ts
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { i18n, I18nController } from '../../i18n/i18n';

// DİL BİLEŞENİNİ TANIT (kritik!)
import './app-language';

// LOGO
import logoUrl from '../../assets/logo2.svg?url';

@customElement('app-navbar')
export class AppNavbar extends LitElement {
  private i18nController = new I18nController(this);

  static styles = css`
    :host { display:block; }
    header {
      position: sticky; top: 0; z-index: 10;
      background: var(--color-surface, #fff);
      width: 100%;
    }
    .bar {
      width: 100%;
      height: 56px;
      display:flex; align-items:center; justify-content:space-between;
      padding: 0 16px;
      box-sizing: border-box;
    }
    .brand {
      display:flex; align-items:center; gap:10px;
      color: var(--color-text, #2b2b2b);
      font-weight:700;
      margin-left: 0;
    }
    .brand img { width:26px; height:26px; display:block; border-radius:6px; }
    .right {
      display:flex; align-items:center; gap:14px;
      color: var(--color-primary, #ff6a00);
      font-weight:600; margin-right:0;
    }
    .right app-language { display:inline-flex; }
    .link {
      display:inline-flex; align-items:center; gap:6px;
      color: var(--color-primary, #ff6a00); text-decoration:none;
    }
    .icon { width:16px; height:16px; display:inline-block; color: var(--color-primary, #ff6a00); }
  `;

  render() {
    return html`
      <header>
        <div class="bar">
          <div class="brand" aria-label="brand">
            <img src="${logoUrl}" alt="ING logo" />
            <span>ING</span>
          </div>

          <div class="right">
            <a class="link" href="#" aria-label=${i18n.t('employees')}>
              <span class="icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"/>
                </svg>
              </span>
              ${i18n.t('employees')}
            </a>

            <a class="link" href="#" aria-label=${i18n.t('addNew')}>
              <span class="icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
                </svg>
              </span>
              ${i18n.t('addNew')}
            </a>

            <app-language></app-language>
          </div>
        </div>
      </header>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'app-navbar': AppNavbar } }
