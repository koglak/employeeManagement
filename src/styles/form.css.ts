import { css } from 'lit';

// Form styles for pages
export const formStyles = css`
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-6, 24px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-8, 32px);
  }

  .title {
    font-size: var(--font-size-3xl, 28px);
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2, 8px);
    padding: var(--space-2, 8px) var(--space-4, 16px);
    background: #f5f5f5;
    color: var(--color-text);
    text-decoration: none;
    border-radius: var(--radius, 8px);
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .back-btn:hover {
    background: #e0e0e0;
  }

  .form-card {
    background: var(--color-surface);
    border-radius: var(--radius, 12px);
    padding: var(--space-8, 32px);
    box-shadow: var(--shadow, 0 4px 14px rgba(0,0,0,.06));
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6, 24px);
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
      gap: var(--space-4, 16px);
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-label {
    font-weight: 600;
    color: var(--color-text);
    font-size: var(--font-size-sm, 14px);
  }

  .form-input, 
  .form-select {
    padding: var(--space-3, 12px) var(--space-4, 16px);
    border: 2px solid #e0e0e0;
    border-radius: var(--radius, 8px);
    font-size: var(--font-size-base, 16px);
    background: var(--color-surface);
    color: var(--color-text);
    transition: border-color 0.2s ease;
  }

  .form-input:focus, 
  .form-select:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  .form-input.error, 
  .form-select.error {
    border-color: #ff4444;
  }

  .error-message {
    color: #ff4444;
    font-size: var(--font-size-xs, 12px);
    margin-top: var(--space-1, 4px);
  }

  .form-actions {
    display: flex;
    gap: var(--space-3, 12px);
    justify-content: flex-end;
    margin-top: var(--space-8, 32px);
  }

  .btn {
    padding: var(--space-3, 12px) var(--space-6, 24px);
    border: none;
    border-radius: var(--radius, 8px);
    font-size: var(--font-size-base, 16px);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2, 8px);
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-secondary {
    background: #f5f5f5;
    color: var(--color-text);
  }

  .btn-secondary:hover {
    background: #e0e0e0;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading state */
  .loading {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2, 8px);
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
