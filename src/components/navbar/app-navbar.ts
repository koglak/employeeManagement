// src/components/navbar/app-navbar.ts
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { i18n, I18nController } from '../../i18n/i18n';

// DİL BİLEŞENİNİ TANIT (kritik!)
import './app-language';

// LOGO
import logoUrl from '../../assets/logo2.svg?url';

@customElement('app-navbar')
export class AppNavbar extends LitElement {
  private i18nController = new I18nController(this);
  
  @state() 
  private mobileMenuOpen = false;

  static styles = css`
    :host { display:block; }
    header {
      position: sticky; top: 0; z-index: 10;
      background: var(--color-surface, #fff);
      width: 100%;
      border-bottom: 1px solid #eee;
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
    
    /* Desktop Navigation */
    .right {
      display:flex; align-items:center; gap:14px;
      color: var(--color-primary, #ff6a00);
      font-weight:600; margin-right:0;
    }
    .right app-language { display:inline-flex; }
    .link {
      display:inline-flex; align-items:center; gap:6px;
      color: var(--color-primary, #ff6a00); text-decoration:none;
      transition: opacity 0.2s ease;
    }
    .link:hover { opacity: 0.7; }
    .icon { width:16px; height:16px; display:inline-block; color: var(--color-primary, #ff6a00); }
    
    /* Hamburger Menu */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 3px;
      padding: 8px;
      cursor: pointer;
      border: none;
      background: none;
      color: var(--color-primary, #ff6a00);
    }
    .hamburger span {
      width: 18px;
      height: 2px;
      background: currentColor;
      transition: all 0.3s ease;
      transform-origin: center;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }
    
    /* Mobile Menu */
    .mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--color-surface, #fff);
      border-bottom: 1px solid #eee;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 999;
    }
    .mobile-menu.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    .mobile-menu-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .mobile-menu .link {
      padding: 8px 0;
      justify-content: flex-start;
    }
    
    /* Responsive Styles */
    @media (max-width: 768px) {
      .right { display: none; }
      .hamburger { display: flex; }
    }
  `;

  private toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  private closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  render() {
    return html`
      <header>
        <div class="bar">
          <div class="brand" aria-label="brand">
            <img src="${logoUrl}" alt="ING logo" />
            <span>ING</span>
          </div>

          <!-- Desktop Navigation -->
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

          <!-- Hamburger Menu for Mobile -->
          <button class="hamburger ${this.mobileMenuOpen ? 'open' : ''}" 
                  @click=${this.toggleMobileMenu}
                  aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div class="mobile-menu ${this.mobileMenuOpen ? 'open' : ''}">
          <div class="mobile-menu-content">
            <a class="link" href="#" @click=${this.closeMobileMenu} aria-label=${i18n.t('employees')}>
              <span class="icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"/>
                </svg>
              </span>
              ${i18n.t('employees')}
            </a>

            <a class="link" href="#" @click=${this.closeMobileMenu} aria-label=${i18n.t('addNew')}>
              <span class="icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
                </svg>
              </span>
              ${i18n.t('addNew')}
            </a>

            <div style="padding: 8px 0;">
              <app-language></app-language>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'app-navbar': AppNavbar } }
