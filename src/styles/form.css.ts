import { css } from 'lit';

// Form styles for pages
export const formStyles = css`
*, *::before, *::after { box-sizing: border-box; }
:host {
      display: block;
      height: 100%;
    }
    
  .form-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .form-grid {
    flex: 1;
    overflow-y: auto;
  }
    
  .form-actions {
    flex-shrink: 0;
    padding-top: var(--space-4, 16px);
    border-top: 1px solid var(--color-border);
    margin-top: var(--space-4, 16px);
  }

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-5, 20px);
  box-sizing: border-box;
  min-height: calc(100vh - 60px); /* Account for navbar height */
  display: flex;
  flex-direction: column;
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
    color: var(--color-primary);
    margin: 0;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2, 8px);
    padding: var(--space-2, 8px) var(--space-4, 16px);
    background: var(--color-hover-bg);
    color: var(--color-text);
    text-decoration: none;
    border-radius: var(--radius, 8px);
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .back-btn:hover {
    background: var(--color-hover-bg-dark);
  }

  .form-card {
    background: var(--color-surface);
    border-radius: var(--radius, 12px);
    padding: var(--space-8, 32px);
    box-shadow: var(--shadow, 0 4px 14px rgba(0,0,0,.06));
    flex: 1;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    .container {
      padding: var(--space-3, 12px);
      min-height: calc(100vh - 60px);
    }
    
    .form-card {
      padding: var(--space-4, 16px);
      margin-bottom: var(--space-4, 16px);
    }
    
    .header {
      margin-bottom: var(--space-4, 16px);
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-2, 8px);
    }
    
    .title {
      font-size: var(--font-size-2xl, 24px);
    }
    
    .back-btn {
      align-self: flex-start;
    }
    
    .form-actions {
      flex-direction: column;
      width: 100%;
    }
    
    .btn {
      width: 100%;
      min-width: unset;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: var(--space-2, 8px);
    }
    
    .form-card {
      padding: var(--space-3, 12px);
      border-radius: var(--radius, 8px);
    }
    
    .title {
      font-size: var(--font-size-xl, 20px);
    }
    
    .form-input, 
    .form-select {
      padding: var(--space-2, 8px) var(--space-3, 12px);
      font-size: var(--font-size-sm, 14px);
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-6, 24px);
  }

  @media (max-width: 1024px) {
    .form-grid {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4, 16px);
    }
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
      gap: var(--space-3, 12px);
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
    border: 1px solid var(--color-border-dark);
    border-radius: 3px;
    font-size: var(--font-size-base, 16px);
    background: var(--color-surface);
    color: var(--color-text);
    transition: border-color 0.2s ease;
  }

  /* Style date input calendar icon */
  .form-input[type="date"] {
    color-scheme: light;
    position: relative;
  }

  .form-input[type="date"]::-webkit-calendar-picker-indicator {
    color: var(--color-primary);
    cursor: pointer;
    filter: invert(35%) sepia(100%) saturate(2000%) hue-rotate(15deg) brightness(1.1) contrast(1);
    background: transparent;
    border: none;
    padding: 4px;
  }

  .form-input[type="date"]::-webkit-calendar-picker-indicator:hover {
    background: var(--color-hover-bg);
    border-radius: 4px;
  }

  /* Alternative approach - hide default and add custom icon */
  .form-input[type="date"].custom-calendar {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23ff6a00' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
  }

  .form-input[type="date"].custom-calendar::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 12px;
    width: 16px;
    height: 16px;
  }

  .form-input[type="date"]::-webkit-datetime-edit {
    color: var(--color-text);
  }

  .form-input[type="date"]::-webkit-datetime-edit-fields-wrapper {
    color: var(--color-text);
  }

  .form-input:focus, 
  .form-select:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  .form-input.error, 
  .form-select.error {
    border-color: var(--color-error);
  }

  .error-message {
    color: var(--color-error);
    font-size: var(--font-size-xs, 12px);
    margin-top: var(--space-1, 4px);
  }

  .form-actions {
    display: flex;
    gap: var(--space-3, 12px);
    justify-content: center;
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
    min-width: 20vh;
    justify-content: center;
  }

  .btn-primary {
    background: var(--color-primary);
    color: var(--color-surface);
    border: none;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-secondary);
    border: 1px solid var(--color-secondary);
  }

  .btn-secondary:hover {
    background: var(--color-hover-bg);
    border-color: var(--color-text);
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
