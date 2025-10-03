import { css } from 'lit';

// Language selector styles
export const languageStyles = css`
  .language-selector {
    position: relative;
    display: inline-block;
    z-index: 9999;
    overflow: visible;
  }
  
  .selected-flag {
    display: flex;
    align-items: center;
    gap: var(--space-1, 4px);
    padding: var(--space-1, 4px);
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
    font-size: var(--font-size-lg, 18px);
    line-height: 1;
  }
  
  .dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 140px;
    width: max-content;
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: 10px;
    box-shadow: var(--shadow, 0 4px 14px rgba(0,0,0,.06));
    overflow: hidden;
    z-index: 1000;
    white-space: nowrap;
  }
  
  .dropdown.hidden {
    display: none;
  }
  
  .option {
    display: flex;
    align-items: center;
    gap: var(--space-2, 8px);
    padding: var(--space-3, 10px) var(--space-4, 16px);
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
    font-size: var(--font-size-xs, 12px);
    color: var(--color-primary);
    transition: transform 0.2s ease;
  }
  
  .caret.open {
    transform: rotate(180deg);
  }
`;
