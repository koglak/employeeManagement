import { css } from 'lit';

// Grid/Card component styles
export const gridStyles = css`
  :host { 
    display: block; 
  }

  .grid-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-4, 16px) var(--space-6, 24px);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 32px;
  }
  
  @media (max-width: 900px) {
    .grid { 
      grid-template-columns: 1fr; 
    }
  }

  .emp-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius);
    padding: var(--space-6, 24px);
    box-shadow: var(--shadow);
    transition: box-shadow .2s ease, transform .2s ease;
  }
  
  .emp-card:hover {
    box-shadow: 0 8px 25px rgba(0,0,0,.12);
    transform: translateY(-2px);
  }

  .kv {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4, 16px) var(--space-6, 24px);
    margin-bottom: var(--space-4, 16px);
  }
  
  @media (max-width: 600px) {
    .kv { 
      grid-template-columns: 1fr; 
      gap: var(--space-3, 12px); 
    }
  }

  .field { 
    display: flex; 
    flex-direction: column; 
  }
  
  .label {
    color: var(--color-muted);
    font-size: var(--font-size-xs, 13px);
    line-height: 1.2;
    margin-bottom: var(--space-2, 6px);
  }
  
  .value {
    color: var(--color-text);
    font-size: var(--font-size-base, 16px);
    font-weight: 700;
    word-break: break-word;
  }

  .card-actions {
    display: flex; 
    gap: var(--space-3, 12px);
    margin-top: var(--space-5, 18px); 
    padding-top: var(--space-5, 18px);
  }
  
  .btn {
    display: inline-flex; 
    align-items: center; 
    gap: var(--space-2, 8px);
    border: 0; 
    cursor: pointer; 
    border-radius: var(--radius);
    padding: var(--space-2, 8px) var(--space-4, 14px); 
    color: var(--color-surface); 
    font-weight: 600; 
    font-size: var(--font-size-sm, 14px);
    transition: filter .2s ease, transform .2s ease;
  }
  
  .btn svg, 
  .btn icon-edit, 
  .btn icon-delete { 
    width: 14px; 
    height: 14px; 
  }
  
  .btn-edit { 
    background: var(--color-secondary); 
  }
  
  .btn-del { 
    background: var(--color-primary); 
  }
  
  .btn:hover {
    filter: brightness(0.9);
    transform: translateY(-1px);
  }
  
  .btn:active {
    transform: translateY(0);
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: var(--space-12, 48px) var(--space-6, 24px);
  }
  
  .empty-state .label {
    font-size: var(--font-size-sm, 14px);
    color: var(--color-muted);
    margin: 0;
  }
`;
