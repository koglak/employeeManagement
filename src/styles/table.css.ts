import { css } from 'lit';

// Table component styles
export const tableStyles = css`
  :host { 
    display: block; 
  }
  
  .table-container { 
    margin: 0 var(--space-6, 24px); 
    padding: var(--space-4, 16px); 
    background: var(--color-surface, #fff); 
    border: 1px solid #eee; 
    border-radius: var(--radius, 12px); 
    overflow-x: auto; 
  }
  
  table { 
    width: 100%; 
    border-collapse: collapse; 
    font-size: var(--font-size-sm, 14px); 
  }
  
  thead th {
    font-weight: 700; 
    color: var(--color-primary, #ff6a00); 
    text-align: left; 
    font-size: var(--font-size-xs, 13px);
    padding: var(--space-4, 14px) var(--space-3, 12px); 
    border-bottom: 1px solid #f0f0f0; 
    white-space: nowrap; 
    background: var(--color-surface, #fff);
  }
  
  tbody td { 
    padding: var(--space-4, 16px) var(--space-3, 12px); 
    border-bottom: 1px solid #f4f4f4; 
    white-space: nowrap; 
    vertical-align: middle; 
    color: var(--color-text, #2b2b2b); 
  }
  
  tbody tr:hover { 
    background: rgba(255,106,0,.03); 
  }
  
  tbody tr:last-child td { 
    border-bottom: none; 
  }

  .chk { 
    width: 44px; 
    text-align: center; 
  }
  
  .actions { 
    width: 72px; 
    text-align: right; 
  }

  /* Checkbox styling */
  input[type="checkbox"] { 
    width: 16px; 
    height: 16px; 
    accent-color: var(--color-primary, #ff6a00); 
  }

  .first { 
    font-weight: 600; 
  }

  .actions-cell { 
    display: flex; 
    gap: var(--space-3, 12px); 
    justify-content: flex-end; 
  }
  
  .icon-btn {
    border: 0; 
    background: transparent; 
    cursor: pointer; 
    padding: 0; 
    line-height: 0;
    color: var(--color-primary, #ff6a00);
  }
  
  .icon-btn:hover { 
    filter: brightness(0.9); 
  }
  
  .icon-btn icon-edit, 
  .icon-btn icon-delete { 
    width: 18px; 
    height: 18px; 
  }
`;
