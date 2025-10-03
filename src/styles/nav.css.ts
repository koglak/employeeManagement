import { css } from 'lit';

// Navigation/Header styles
export const navStyles = css`
  :host { 
    display: block; 
  }
  
  header {
    position: sticky; 
    top: 0; 
    z-index: 10;
    background: var(--color-surface);
    width: 100%;
    overflow: visible;
  }
  
  .bar {
    width: 100%;
    height: 56px;
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: 0 var(--space-4, 16px);
    box-sizing: border-box;
    min-width: 0;
    overflow: visible;
  }
  
  .brand {
    display: flex; 
    align-items: center; 
    gap: var(--space-3, 12px);
    color: var(--color-text);
    font-weight: 700;
    font-size: var(--font-size-lg, 18px);
    margin-left: 0;
    flex-shrink: 0;
  }
  
  .brand img { 
    width: 26px; 
    height: 26px; 
    display: block; 
    border-radius: 6px; 
    min-width: 26px; 
    min-height: 26px;
    flex-shrink: 0;
    margin-right: var(--space-4, 15px);
  }
  
  /* Desktop Navigation */
  .right {
    display: flex; 
    align-items: center; 
    gap: var(--space-5, 20px);
    color: var(--color-primary);
    font-weight: 600; 
    font-size: var(--font-size-sm, 14px);
    margin-right: 0;
    overflow: visible;
    position: relative;
  }
  
  .right app-language { 
    display: inline-flex; 
  }
  
  .link {
    display: inline-flex; 
    align-items: center; 
    gap: var(--space-2, 8px);
    color: var(--color-primary); 
    text-decoration: none;
    transition: opacity 0.2s ease;
    margin-right: var(--space-4, 15px);
  }
  
  .link:hover { 
    opacity: 0.7; 
  }
  
  .icon { 
    width: 16px; 
    height: 16px; 
    display: inline-block; 
    color: var(--color-primary); 
  }
  
  /* Hamburger Menu */
  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--space-2, 8px);
    z-index: 10;
  }
  
  .hamburger span {
    width: 100%;
    height: 2px;
    background: var(--color-primary);
    border-radius: 2px;
    transition: 0.3s;
  }
  
  /* Mobile styles */
  @media (max-width: 768px) {
    .right {
      display: none;
    }
    
    .hamburger {
      display: flex;
    }
    
    .mobile-menu {
      position: fixed;
      top: 56px;
      left: 0;
      right: 0;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border-light);
      padding: var(--space-2, 8px) 0;
      z-index: 9;
    }
    
    .mobile-menu.hidden {
      display: none;
    }
    
    .mobile-menu .link {
      display: block;
      padding: var(--space-3, 12px) var(--space-4, 16px);
      margin: 0;
      border-bottom: 1px solid var(--color-border-subtle);
    }
  }
`;
