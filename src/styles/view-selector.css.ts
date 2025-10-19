import { css } from 'lit';

export const viewSelectorStyle = css`
    :host { display:inline-flex; }

    /* sadece iki ikon, arada boşluk */
    .view-toggle {
      display:flex; align-items:center; gap:16px;
      background: transparent; border:0; padding: 0;
    }

    .icon-btn {
      border:0; background:transparent; cursor:pointer;
      display:inline-flex; align-items:center; justify-content:center;
      width:28px; height:28px; line-height:0; border-radius:6px;

      /* PASİF renk (açık turuncu) */
      color: rgba(255,106,0,.35);
      transition: background .15s ease, color .15s ease;
    }

    /* AKTİF renk (turuncu) */
    .icon-btn[aria-pressed="true"] {
      color: var(--color-primary, #ff6a00);
    }

    .icon-btn:focus-visible {
      outline: 2px solid var(--color-primary, #ff6a00);
      outline-offset: 2px;
      border-radius: 6px;
    }
  `;