import { css } from 'lit';

export const popupStyles = css`
  :host {
    display: block;
    position: fixed; 
    inset: 0;
    z-index: 1000; 
    pointer-events: none;
  }
  
  :host([open]) { 
    pointer-events: auto; 
  }

  .overlay {
    position: absolute; 
    inset: 0;
    background: rgba(0, 0, 0, .45);
    opacity: 0; 
    transition: opacity .2s ease;
  }
  
  :host([open]) .overlay { 
    opacity: 1; 
  }

  .popup {
    position: absolute; 
    left: 50%; 
    top: 50%;
    transform: translate(-50%, -50%) scale(.96);
    background: #fff; 
    border-radius: 2px;
    width: min(500px, calc(100vw - 32px));
    box-shadow: 0 12px 30px rgba(0, 0, 0, .18);
    opacity: 0; 
    transition: transform .2s ease, opacity .2s ease;
  }
  
  :host([open]) .popup { 
    opacity: 1; 
    transform: translate(-50%, -50%) scale(1); 
  }

  .box {
    padding: 16px 16px 18px;
  }

  .title-row {
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .title {
    margin: 0;
    font-size: 22px; 
    font-weight: 800;
    color: var(--color-primary, #ff6a00);
  }
  
  .close {
    border: 0; 
    background: transparent; 
    cursor: pointer;
    color: var(--color-primary, #ff6a00);
    width: 28px; 
    height: 28px; 
    border-radius: 6px; 
    line-height: 0;
  }
  
  .close:hover { 
    background: rgba(255, 106, 0, .08); 
  }
  
  .close svg { 
    width: 18px; 
    height: 18px; 
  }

  .message {
    margin: 10px 2px 16px;
    font-size: 14px; 
    color: #333; 
    line-height: 1.45;
  }

  .actions {
    display: flex; 
    flex-direction: column; 
    gap: 10px;
  }
  
  .btn {
    border: 0; 
    border-radius: 10px; 
    height: 40px;
    font-weight: 700; 
    font-size: 14px; 
    cursor: pointer;
    width: 100%;
  }
  
  .btn-primary {
    background: var(--color-primary, #ff6a00);
    color: #fff;
  }
  
  .btn-primary:hover { 
    filter: brightness(.96); 
  }
  
  .btn-secondary {
    background: #fff;
    --purple: var(--color-secondary, #5a52b3);
    color: var(--purple);
    border: 2px solid var(--purple);
  }
  
  .btn-secondary:hover { 
    background: rgba(90, 82, 179, .06); 
  }
  
  .btn:focus { 
    outline: 2px solid var(--color-primary, #ff6a00); 
    outline-offset: 2px; 
  }

  @media (max-width: 420px) {
    .box { 
      padding: 14px; 
    }
  }
`;
