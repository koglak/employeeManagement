import { css } from 'lit';

// Table component styles
export const tableStyles = css`
  :host { 
    display: block; 
  }
  
  .table-container { 
    margin: 0 var(--space-6, 24px); 
    padding: var(--space-4, 16px); 
    background: var(--color-surface); 
    border: 1px solid var(--color-border-light); 
    border-radius: var(--radius); 
    overflow-x: auto; 
  }
  
  table { 
    width: 100%; 
    border-collapse: collapse; 
    font-size: var(--font-size-sm, 14px); 
  }
  
  thead th {
    font-weight: 700; 
    color: var(--color-primary); 
    text-align: left; 
    font-size: var(--font-size-xs, 13px);
    padding: var(--space-4, 14px) var(--space-3, 12px); 
    border-bottom: 1px solid var(--color-border-lighter); 
    white-space: nowrap; 
    background: var(--color-surface);
  }
  
  tbody td { 
    padding: var(--space-4, 16px) var(--space-3, 12px); 
    border-bottom: 1px solid var(--color-border-lightest); 
    white-space: nowrap; 
    vertical-align: middle; 
    color: var(--color-text); 
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
    accent-color: var(--color-primary); 
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
    color: var(--color-primary);
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
