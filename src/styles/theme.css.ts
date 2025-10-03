import { css } from 'lit';

// Apply global CSS custom properties to document root
const globalStyles = `
  :root {
    --color-bg: #fafafa;
    --color-surface: #ffffff;
    --color-text: #2b2b2b;
    --color-muted: #888;
    --color-primary: #ff6a00;  
    --color-primary-600: #e45f00;
    --radius: 12px;
    --shadow: 0 4px 14px rgba(0,0,0,.06);
    
    /* Typography Scale - Desktop */
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 30px;
    --font-size-4xl: 36px;
    
    /* Line Heights */
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    /* Spacing Scale */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;
  }

  /* Tablet Responsive - 768px to 1024px */
  @media (max-width: 1024px) {
    :root {
      --font-size-xs: 11px;
      --font-size-sm: 13px;
      --font-size-base: 15px;
      --font-size-lg: 17px;
      --font-size-xl: 19px;
      --font-size-2xl: 22px;
      --font-size-3xl: 26px;
      --font-size-4xl: 32px;
    }
  }

  /* Mobile Responsive - below 768px */
  @media (max-width: 768px) {
    :root {
      --font-size-xs: 10px;
      --font-size-sm: 12px;
      --font-size-base: 14px;
      --font-size-lg: 16px;
      --font-size-xl: 18px;
      --font-size-2xl: 20px;
      --font-size-3xl: 24px;
      --font-size-4xl: 28px;
      
      --space-1: 3px;
      --space-2: 6px;
      --space-3: 9px;
      --space-4: 12px;
      --space-5: 15px;
      --space-6: 18px;
      --space-8: 24px;
      --space-10: 30px;
      --space-12: 36px;
    }
  }

  /* Small Mobile - below 480px */
  @media (max-width: 480px) {
    :root {
      --font-size-xs: 9px;
      --font-size-sm: 11px;
      --font-size-base: 13px;
      --font-size-lg: 15px;
      --font-size-xl: 17px;
      --font-size-2xl: 19px;
      --font-size-3xl: 22px;
      --font-size-4xl: 26px;
    }
  }

  /* Base Typography Styles */
  * {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
    color: var(--color-text);
    margin: 0;
    padding: 0;
  }

  /* Typography Utility Classes */
  .text-xs { font-size: var(--font-size-xs); }
  .text-sm { font-size: var(--font-size-sm); }
  .text-base { font-size: var(--font-size-base); }
  .text-lg { font-size: var(--font-size-lg); }
  .text-xl { font-size: var(--font-size-xl); }
  .text-2xl { font-size: var(--font-size-2xl); }
  .text-3xl { font-size: var(--font-size-3xl); }
  .text-4xl { font-size: var(--font-size-4xl); }

  .font-normal { font-weight: 400; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  .font-extrabold { font-weight: 800; }

  .leading-tight { line-height: var(--line-height-tight); }
  .leading-normal { line-height: var(--line-height-normal); }
  .leading-relaxed { line-height: var(--line-height-relaxed); }
`;

// Inject global styles into document head
if (!document.querySelector('#global-theme-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'global-theme-styles';
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}

export const theme = css`
  :host {
    --color-bg: #fafafa;
    --color-surface: #ffffff;
    --color-text: #2b2b2b;
    --color-muted: #888;
    --color-primary: #ff6a00;  
    --color-primary-600: #e45f00;
    --radius: 5px;
    --shadow: 0 4px 14px rgba(0,0,0,.06);
    
    /* Typography Scale - Desktop */
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 30px;
    --font-size-4xl: 36px;
    
    /* Line Heights */
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    /* Spacing Scale */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;
  }

  /* Tablet Responsive - 768px to 1024px */
  @media (max-width: 1024px) {
    :root {
      --font-size-xs: 11px;
      --font-size-sm: 13px;
      --font-size-base: 15px;
      --font-size-lg: 17px;
      --font-size-xl: 19px;
      --font-size-2xl: 22px;
      --font-size-3xl: 26px;
      --font-size-4xl: 32px;
    }
  }

  /* Mobile Responsive - below 768px */
  @media (max-width: 768px) {
    :root {
      --font-size-xs: 10px;
      --font-size-sm: 12px;
      --font-size-base: 14px;
      --font-size-lg: 16px;
      --font-size-xl: 18px;
      --font-size-2xl: 20px;
      --font-size-3xl: 24px;
      --font-size-4xl: 28px;
      
      --space-1: 3px;
      --space-2: 6px;
      --space-3: 9px;
      --space-4: 12px;
      --space-5: 15px;
      --space-6: 18px;
      --space-8: 24px;
      --space-10: 30px;
      --space-12: 36px;
    }
  }

  /* Small Mobile - below 480px */
  @media (max-width: 480px) {
    :root {
      --font-size-xs: 9px;
      --font-size-sm: 11px;
      --font-size-base: 13px;
      --font-size-lg: 15px;
      --font-size-xl: 17px;
      --font-size-2xl: 19px;
      --font-size-3xl: 22px;
      --font-size-4xl: 26px;
    }
  }

  /* Base Typography Styles */
  * {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
    color: var(--color-text);
    margin: 0;
    padding: 0;
  }

  /* Typography Utility Classes */
  .text-xs { font-size: var(--font-size-xs); }
  .text-sm { font-size: var(--font-size-sm); }
  .text-base { font-size: var(--font-size-base); }
  .text-lg { font-size: var(--font-size-lg); }
  .text-xl { font-size: var(--font-size-xl); }
  .text-2xl { font-size: var(--font-size-2xl); }
  .text-3xl { font-size: var(--font-size-3xl); }
  .text-4xl { font-size: var(--font-size-4xl); }

  .font-normal { font-weight: 400; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  .font-extrabold { font-weight: 800; }

  .leading-tight { line-height: var(--line-height-tight); }
  .leading-normal { line-height: var(--line-height-normal); }
  .leading-relaxed { line-height: var(--line-height-relaxed); }
`;
