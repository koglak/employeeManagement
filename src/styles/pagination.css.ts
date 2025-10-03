import { css } from 'lit';

// Pagination component styles
export const paginationStyles = css`
  :host { 
    display: block; 
  }
  
  .pagination {
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: var(--space-2, 8px); 
    padding: var(--space-4, 16px) 0;
  }
  
  .page-btn, 
  .page-num {
    border: 0; 
    background: transparent; 
    cursor: pointer;
    border-radius: 9999px; 
    padding: var(--space-2, 6px) var(--space-3, 10px);
  }
  
  /* Number buttons */
  .page-num { 
    min-width: 32px; 
    height: 32px; 
    display: grid; 
    place-items: center; 
    color: var(--color-text, #2b2b2b); 
  }
  
  .page-num:hover { 
    background: rgba(255,106,0,.1); 
  }
  
  .page-num[aria-current="page"] {
    background: var(--color-primary, #ff6a00); 
    color: #fff; 
    font-weight: 700;
  }
  
  .ellipsis { 
    padding: 0 var(--space-2, 6px); 
    color: var(--color-muted, #999); 
  }

  /* Arrow buttons */
  .page-btn { 
    width: 32px; 
    height: 32px; 
    display: grid; 
    place-items: center; 
  }
  
  .page-btn svg { 
    width: 18px; 
    height: 18px; 
    color: var(--color-primary, #ff6a00); 
  }
  
  .page-btn[disabled] { 
    cursor: not-allowed; 
  }
  
  .page-btn[disabled] svg { 
    color: #c8c8c8; 
  }
  
  .page-btn:not([disabled]):hover { 
    background: rgba(255,106,0,.1); 
  }
`;
