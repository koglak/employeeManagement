// src/router/router.ts
export interface Route {
    path: string;
    component: string;
    title: string;
}

export class Router {
    private static instance: Router;
    private routes: Route[] = [];
    private currentPath = '/';
    private listeners: (() => void)[] = [];

    static getInstance(): Router {
        if (!Router.instance) {
            Router.instance = new Router();
        }
        return Router.instance;
    }

    private constructor() {
        // Listen to browser navigation events
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });

        // Handle initial route
        this.handleRouteChange();
    }

    addRoute(route: Route) {
        this.routes.push(route);
    }

    navigate(path: string) {
        if (path !== this.currentPath) {
            this.currentPath = path;
            window.history.pushState({}, '', path);
            this.handleRouteChange();
        }
    }

    getCurrentPath(): string {
        return this.currentPath;
    }

    getCurrentRoute(): Route | null {
        const currentPath = this.currentPath;

        // First try exact match
        let route = this.routes.find(route => route.path === currentPath);

        // If no exact match, try pattern matching for update routes
        if (!route && currentPath.startsWith('/update/')) {
            route = this.routes.find(route => route.path === '/update');
        }

        return route || null;
    }

    private handleRouteChange() {
        this.currentPath = window.location.pathname;

        // Update document title
        const route = this.getCurrentRoute();
        if (route) {
            document.title = `${route.title} - Employee Management`;
        }

        // Notify listeners
        this.listeners.forEach(listener => listener());
    }

    addRouteChangeListener(listener: () => void) {
        this.listeners.push(listener);
    }

    removeRouteChangeListener(listener: () => void) {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
}

// Router Controller for LitElement
export class RouterController {
    private host: any;
    private router: Router;
    private routeChangeListener: () => void;

    constructor(host: any) {
        this.host = host;
        this.router = Router.getInstance();
        this.routeChangeListener = () => {
            this.host.requestUpdate();
        };
    }

    hostConnected() {
        this.router.addRouteChangeListener(this.routeChangeListener);
    }

    hostDisconnected() {
        this.router.removeRouteChangeListener(this.routeChangeListener);
    }

    getCurrentPath(): string {
        return this.router.getCurrentPath();
    }

    navigate(path: string) {
        this.router.navigate(path);
    }
}
