// src/i18n/i18n.ts
import en from './locales/en';
import tr from './locales/tr';
import type { ReactiveController, ReactiveControllerHost } from 'lit';

type Lang = 'tr' | 'en';
const dictionaries = { tr, en } as const;

class I18nStore {
    private _lang: Lang;
    private listeners = new Set<() => void>();

    constructor() {
        // 1. Önce HTML lang attribute'unu kontrol et
        const htmlLang = document.documentElement.lang as Lang;

        // 2. Sonra localStorage'ı kontrol et
        const storedLang = localStorage.getItem('app-language') as Lang;

        // 3. Geçerli dil seç (öncelik sırası: stored > html > default)
        this._lang = this.isValidLang(storedLang) ? storedLang
            : this.isValidLang(htmlLang) ? htmlLang
                : 'tr';

        // 4. HTML lang attribute'unu güncelle
        this.updateHtmlLang();
    }

    private isValidLang(lang: string): lang is Lang {
        return lang === 'tr' || lang === 'en';
    }

    private updateHtmlLang() {
        document.documentElement.lang = this._lang;
        localStorage.setItem('app-language', this._lang);
    }

    get lang() { return this._lang; }
    set lang(v: Lang) {
        if (this._lang !== v) {
            this._lang = v;
            this.updateHtmlLang();
            this.emit();
        }
    }

    t(key: keyof typeof en | keyof typeof tr) {
        return (dictionaries[this._lang] as any)[key] ?? String(key);
    }

    subscribe(cb: () => void) { this.listeners.add(cb); return () => this.listeners.delete(cb); }
    private emit() { for (const cb of this.listeners) cb(); }
}
export const i18n = new I18nStore();

// 🔧 reaktif controller (unsubscribe destekli)
export class I18nController implements ReactiveController {
    private host: ReactiveControllerHost;
    private unsub?: () => void;
    constructor(host: ReactiveControllerHost) { this.host = host; host.addController(this); }
    hostConnected() { this.unsub = i18n.subscribe(() => this.host.requestUpdate()); }
    hostDisconnected() { this.unsub?.(); }
}
