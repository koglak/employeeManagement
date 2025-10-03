import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { theme } from './styles/theme.css.ts';
import './components/navbar/app-navbar';
import { Router, RouterController } from './router/router';

// Import pages
import './pages/home-page';
import './pages/create-page';
import './pages/update-page';

@customElement('employee-app')
export class EmployeeApp extends LitElement {
  private routerController = new RouterController(this);
  private router = Router.getInstance();

  static styles = [theme, css`
    :host{ 
      display: flex;
      flex-direction: column;
      background: var(--color-bg); 
      min-height: 100vh; 
      color: var(--color-text); 
    }
    main { 
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
  `];

  connectedCallback() {
    super.connectedCallback();
    this.routerController.hostConnected();
    this.setupRoutes();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.routerController.hostDisconnected();
  }

  private setupRoutes() {
    this.router.addRoute({ path: '/', component: 'home-page', title: 'Employees' });
    this.router.addRoute({ path: '/create', component: 'create-page', title: 'Create Employee' });
    this.router.addRoute({ path: '/update', component: 'update-page', title: 'Update Employee' });
  }

  private renderCurrentPage() {
    const currentPath = this.routerController.getCurrentPath();

    if (currentPath === '/') {
      return html`<home-page></home-page>`;
    } else if (currentPath === '/create') {
      return html`<create-page></create-page>`;
    } else if (currentPath.startsWith('/update/')) {
      return html`<update-page></update-page>`;
    } else {
      // 404 - redirect to home
      this.router.navigate('/');
      return html`<home-page></home-page>`;
    }
  }

  render() {
    return html`
      <app-navbar></app-navbar>
      <main>
        ${this.renderCurrentPage()}
      </main>
    `;
  }
}
declare global { interface HTMLElementTagNameMap { 'employee-app': EmployeeApp } }
