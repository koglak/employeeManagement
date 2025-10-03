import { css } from 'lit';

export const homeStyles = css`
  :host { 
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--color-bg);
    overflow: hidden;
  }

  /* Header */
  .page-head {
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: var(--space-4) var(--space-6);
    flex-shrink: 0;
  }
  
  .title {
    color: var(--color-primary);
    font-size: var(--font-size-2xl); 
    font-weight: 800; 
    letter-spacing: 0.2px;
    margin: 0;
  }
  
  .controls {
    display: flex;
    gap: var(--space-4);
    align-items: center;
  }

  /* Search */
  .search-box {
    padding: var(--space-4) var(--space-6);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  /* Content Area */
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: var(--space-4) 0;
  }

  .content-scroll {
    flex: 1;
    overflow-y: auto;
    padding-bottom: var(--space-4);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .page-head {
      flex-direction: column;
      gap: var(--space-4);
      align-items: stretch;
    }

    .controls {
      justify-content: center;
    }
  }
`;
