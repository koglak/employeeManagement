import { css } from 'lit';

export const infoPopupStyles = css`
  .icon {
    width: 24px;
    height: 24px;
    margin-right: var(--space-3, 12px);
    flex-shrink: 0;
  }
  
  .icon.warning {
    color: var(--color-warning);
  }
  
  .icon.error {
    color: var(--color-error);
  }
  
  .icon.success {
    color: var(--color-success);
  }
  
  .icon.info {
    color: var(--color-info);
  }
  
  .message-container {
    display: flex;
    align-items: flex-start;
    margin-bottom: var(--space-4, 16px);
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
  }
`;
