import { css } from 'lit';

// Navigation/Header styles
export const navStyles = css`
  :host { display:block; }
    header {
      position: sticky; top: 0; z-index: 10;
      background: var(--color-surface, #fff);
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
      color: var(--color-text, #2b2b2b);
      font-weight: 700;
      font-size: var(--font-size-lg, 18px);
      margin-left: 0;
      flex-shrink: 0;
    }
    .brand img { 
      width:26px; 
      height:26px; 
      display:block; 
      border-radius:6px; 
      min-width: 26px; 
      min-height: 26px;
      flex-shrink: 0;
      margin-right: 15px;
    }
    
    /* Desktop Navigation */
    .right {
      display: flex; 
      align-items: center; 
      gap: var(--space-5, 20px);
      color: var(--color-primary, #ff6a00);
      font-weight: 600; 
      font-size: var(--font-size-sm, 14px);
      margin-right: 0;
      overflow: visible;
      position: relative;
    }
    .right app-language { display:inline-flex; }
    .link {
      display: inline-flex; 
      align-items: center; 
      gap: var(--space-2, 8px);
      color: var(--color-primary, #ff6a00); 
      text-decoration: none;
      transition: opacity 0.2s ease;
      margin-right: var(--space-4, 15px);
    }
    .link:hover { opacity: 0.7; }
    .icon { width:16px; height:16px; display:inline-block; color: var(--color-primary, #ff6a00); }
    
    /* Hamburger Menu */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 3px;
      padding: 8px;
      cursor: pointer;
      border: none;
      background: none;
      color: var(--color-primary, #ff6a00);
    }
    .hamburger span {
      width: 18px;
      height: 2px;
      background: currentColor;
      transition: all 0.3s ease;
      transform-origin: center;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }
    
    /* Mobile Menu */
    .mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--color-surface, #fff);
      border-bottom: 1px solid #eee;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 999;
    }
    .mobile-menu.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    .mobile-menu-content {
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    .mobile-menu .link {
      padding: var(--space-2) 0;
      justify-content: flex-start;
      
    }
    
    /* Responsive Styles */
    @media (max-width: 768px) {
      .right { display: none; }
      .hamburger { display: flex; }
    }
`;
