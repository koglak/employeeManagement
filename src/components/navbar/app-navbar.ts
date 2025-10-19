// src/components/navbar/app-navbar.ts
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { i18n, I18nController } from '../../i18n/i18n';
import { Router } from '../../router/router';

// DİL BİLEŞENİNİ TANIT (kritik!)
import './app-language';

// LOGO
import logoUrl from '/logo2.svg?url';
import { navStyles } from '../../styles';

@customElement('app-navbar')
export class AppNavbar extends LitElement {
  private i18nController = new I18nController(this);

  @state()
  private mobileMenuOpen = false;

  static styles = navStyles;

  private toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  private closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  private navigate(path: string, event: Event) {
    event.preventDefault();
    Router.getInstance().navigate(path);
    this.closeMobileMenu();
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
            <a class="link" href="/" @click=${(e: Event) => this.navigate('/', e)} aria-label=${i18n.t('employees')}>
              <span class="icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"/>
                </svg>
              </span>
              ${i18n.t('employees')}
            </a>

            <a class="link" href="/create" @click=${(e: Event) => this.navigate('/create', e)} aria-label=${i18n.t('addNew')}>
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
            <a class="link" href="/" @click=${(e: Event) => this.navigate('/', e)} aria-label=${i18n.t('employees')}>
              <span class="icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"/>
                </svg>
              </span>
              ${i18n.t('employees')}
            </a>

            <a class="link" href="/create" @click=${(e: Event) => this.navigate('/create', e)} aria-label=${i18n.t('addNew')}>
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
