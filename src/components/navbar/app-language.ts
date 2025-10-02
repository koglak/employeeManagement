import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { i18n, I18nController } from '../../i18n/i18n';
import '../icons/icon-flag-tr';
import '../icons/icon-flag-en';

@customElement('app-language')
export class AppLanguage extends LitElement {
  private i18nController = new I18nController(this);

  static styles = css`
    :host { display:inline-flex; align-items:center; }
    
    .language-selector {
      position: relative;
      display: inline-block;
    }
    
    .selected-flag {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: var(--color-text);
      cursor: pointer;
      transition: all 0.2s ease;
      justify-content: center;
    }
    
    .selected-flag:hover {
      background: rgba(255, 106, 0, 0.05);
      border-radius: 6px;
    }
    
    .flag {
      display: flex;
      align-items: center;
      font-size: 18px;
      line-height: 1;
    }
    
    .dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      min-width: 140px;
      width: max-content;
      background: var(--color-surface);
      border: 1px solid #eee;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      margin-top: 4px;
      overflow: hidden;
      white-space: nowrap;
    }
    
    .dropdown.hidden {
      display: none;
    }
    
    .option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font: inherit;
      color: var(--color-text);
      white-space: nowrap;
      min-width: max-content;
    }
    
    .option:hover {
      background: rgba(255, 106, 0, 0.1);
    }
    
    .option.selected {
      background: rgba(255, 106, 0, 0.15);
      color: var(--color-primary);
      font-weight: 600;
    }
    
    .caret {
      font-size: 12px;
      color: var(--color-primary);
      transition: transform 0.2s ease;
    }
    
    .caret.open {
      transform: rotate(180deg);
    }
  `;

  @state() 
  private language = i18n.lang;
  
  @state() 
  private isOpen = false;

  private languages = {
    tr: { flag: html`<icon-flag-tr></icon-flag-tr>`, name: 'Türkçe' },
    en: { flag: html`<icon-flag-en></icon-flag-en>`, name: 'English' }
  };

  private toggleDropdown(e: Event) {
    e.stopPropagation(); // Event'in dış elemanlara yayılmasını engelle
    console.log('Toggle dropdown clicked, current isOpen:', this.isOpen);
    this.isOpen = !this.isOpen;
    console.log('New isOpen state:', this.isOpen);
  }

  private selectLanguage(lang: 'tr' | 'en', e: Event) {
    e.stopPropagation();
    console.log('Language selected:', lang);
    i18n.lang = lang;
    this.language = lang;
    this.isOpen = false;
  }

  private handleClickOutside = (e: Event) => {
    const target = e.target as Node;
    // Eğer tıklanan yer bu komponentin içindeyse, dropdown'u kapatma
    if (this.shadowRoot?.contains(target) || this.contains(target)) {
      return;
    }
    console.log('Click outside detected, closing dropdown');
    this.isOpen = false;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleClickOutside);
  }

  render() {
    const currentLang = this.languages[this.language];

    return html`
            <div class="language-selector">
                <div class="selected-flag" @click=${this.toggleDropdown}>
                    <span class="flag">${currentLang.flag}</span>
                </div>
                
                <div class="dropdown ${this.isOpen ? '' : 'hidden'}">
                    ${Object.entries(this.languages).map(([code, lang]) => html`
                        <button 
                            class="option ${code === this.language ? 'selected' : ''}"
                            @click=${(e: Event) => this.selectLanguage(code as 'tr' | 'en', e)}
                        >
                            <span class="flag">${lang.flag}</span>
                            <span>${lang.name}</span>
                        </button>
                    `)}
                </div>
            </div>
        `;
  }
}
declare global { interface HTMLElementTagNameMap { 'app-language': AppLanguage } }
