import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Router, RouterController, Route } from '../../src/router/router';

// Mock window.history and window.location
const mockPushState = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, 'history', {
    value: {
        pushState: mockPushState,
    },
    writable: true,
});

Object.defineProperty(window, 'location', {
    value: {
        pathname: '/',
    },
    writable: true,
});

Object.defineProperty(window, 'addEventListener', {
    value: mockAddEventListener,
    writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
    value: mockRemoveEventListener,
    writable: true,
});

// Mock document.title
Object.defineProperty(document, 'title', {
    value: '',
    writable: true,
});

describe('Router', () => {
    let router: Router;

    beforeEach(() => {
        // Reset the singleton instance
        (Router as any).instance = null;

        // Clear mocks
        mockPushState.mockClear();
        mockAddEventListener.mockClear();
        mockRemoveEventListener.mockClear();

        // Reset location
        (window as any).location = { pathname: '/' };
        document.title = '';

        router = Router.getInstance();
    });

    afterEach(() => {
        // Clean up listeners array
        (router as any).listeners = [];
        (router as any).routes = [];
    });

    describe('Singleton Pattern', () => {
        it('should return the same instance', () => {
            const router1 = Router.getInstance();
            const router2 = Router.getInstance();
            expect(router1).toBe(router2);
        });

        it('should only create one instance', () => {
            const router1 = Router.getInstance();
            const router2 = Router.getInstance();
            const router3 = Router.getInstance();
            expect(router1).toBe(router2);
            expect(router2).toBe(router3);
        });
    });

    describe('Constructor and Initialization', () => {
        it('should listen to popstate events', () => {
            expect(mockAddEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
        });

        it('should initialize with empty routes array', () => {
            const routes = (router as any).routes;
            expect(Array.isArray(routes)).toBe(true);
            expect(routes.length).toBe(0);
        });

        it('should initialize with root path', () => {
            expect(router.getCurrentPath()).toBe('/');
        });

        it('should initialize with empty listeners array', () => {
            const listeners = (router as any).listeners;
            expect(Array.isArray(listeners)).toBe(true);
            expect(listeners.length).toBe(0);
        });
    });

    describe('Route Management', () => {
        it('should add routes correctly', () => {
            const route: Route = {
                path: '/home',
                component: 'home-page',
                title: 'Home'
            };

            router.addRoute(route);
            const routes = (router as any).routes;
            expect(routes).toContain(route);
            expect(routes.length).toBe(1);
        });

        it('should add multiple routes', () => {
            const route1: Route = { path: '/home', component: 'home-page', title: 'Home' };
            const route2: Route = { path: '/create', component: 'create-page', title: 'Create' };

            router.addRoute(route1);
            router.addRoute(route2);

            const routes = (router as any).routes;
            expect(routes.length).toBe(2);
            expect(routes).toContain(route1);
            expect(routes).toContain(route2);
        });
    });

    describe('Navigation', () => {
        beforeEach(() => {
            const homeRoute: Route = { path: '/', component: 'home-page', title: 'Home' };
            const createRoute: Route = { path: '/create', component: 'create-page', title: 'Create' };
            router.addRoute(homeRoute);
            router.addRoute(createRoute);
        });

        it('should navigate to new path', () => {
            // Mock location change that would happen in browser
            (window as any).location.pathname = '/create';
            router.navigate('/create');
            expect(router.getCurrentPath()).toBe('/create');
        });

        it('should update browser history on navigation', () => {
            (window as any).location.pathname = '/create';
            router.navigate('/create');
            expect(mockPushState).toHaveBeenCalledWith({}, '', '/create');
        });

        it('should not navigate to same path', () => {
            router.navigate('/');
            expect(mockPushState).not.toHaveBeenCalled();
        });

        it('should handle multiple navigation calls', () => {
            (window as any).location.pathname = '/create';
            router.navigate('/create');
            (window as any).location.pathname = '/';
            router.navigate('/');
            (window as any).location.pathname = '/create';
            router.navigate('/create');

            expect(router.getCurrentPath()).toBe('/create');
            expect(mockPushState).toHaveBeenCalledTimes(3);
        });
    });

    describe('Current Path Management', () => {
        it('should return current path', () => {
            expect(router.getCurrentPath()).toBe('/');
        });

        it('should update current path on navigation', () => {
            (window as any).location.pathname = '/test';
            router.navigate('/test');
            expect(router.getCurrentPath()).toBe('/test');
        });

        it('should return string type', () => {
            expect(typeof router.getCurrentPath()).toBe('string');
        });
    });

    describe('Route Finding', () => {
        beforeEach(() => {
            const routes: Route[] = [
                { path: '/', component: 'home-page', title: 'Home' },
                { path: '/create', component: 'create-page', title: 'Create Employee' },
                { path: '/update', component: 'update-page', title: 'Update Employee' }
            ];
            routes.forEach(route => router.addRoute(route));
        });

        it('should find exact route match', () => {
            (window as any).location.pathname = '/create';
            router.navigate('/create');
            const route = router.getCurrentRoute();

            expect(route).toBeTruthy();
            expect(route!.path).toBe('/create');
            expect(route!.component).toBe('create-page');
            expect(route!.title).toBe('Create Employee');
        });

        it('should return null for non-existent route', () => {
            (window as any).location.pathname = '/nonexistent';
            router.navigate('/nonexistent');
            const route = router.getCurrentRoute();
            expect(route).toBeNull();
        });

        it('should handle root route', () => {
            router.navigate('/');
            const route = router.getCurrentRoute();

            expect(route).toBeTruthy();
            expect(route!.path).toBe('/');
            expect(route!.component).toBe('home-page');
        });

        it('should handle update route with ID pattern matching', () => {
            // Simulate navigation to update route with ID
            (router as any).currentPath = '/update/123';
            const route = router.getCurrentRoute();

            expect(route).toBeTruthy();
            expect(route!.path).toBe('/update');
            expect(route!.component).toBe('update-page');
            expect(route!.title).toBe('Update Employee');
        });

        it('should handle nested update paths', () => {
            (router as any).currentPath = '/update/456';
            const route = router.getCurrentRoute();

            expect(route).toBeTruthy();
            expect(route!.path).toBe('/update');
        });
    });

    describe('Route Change Handling', () => {
        beforeEach(() => {
            const homeRoute: Route = { path: '/', component: 'home-page', title: 'Home' };
            router.addRoute(homeRoute);
        });

        it('should update document title on route change', () => {
            // Simulate window location change
            (window as any).location.pathname = '/';
            (router as any).handleRouteChange();

            expect(document.title).toBe('Home - Employee Management');
        });

        it('should not update title for unknown route', () => {
            (window as any).location.pathname = '/unknown';
            document.title = 'Previous Title';
            (router as any).handleRouteChange();

            expect(document.title).toBe('Previous Title');
        });

        it('should update current path from window location', () => {
            (window as any).location.pathname = '/test-path';
            (router as any).handleRouteChange();

            expect(router.getCurrentPath()).toBe('/test-path');
        });
    });

    describe('Listener Management', () => {
        it('should add route change listeners', () => {
            const listener = vi.fn();
            router.addRouteChangeListener(listener);

            const listeners = (router as any).listeners;
            expect(listeners).toContain(listener);
            expect(listeners.length).toBe(1);
        });

        it('should add multiple listeners', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();

            router.addRouteChangeListener(listener1);
            router.addRouteChangeListener(listener2);

            const listeners = (router as any).listeners;
            expect(listeners.length).toBe(2);
            expect(listeners).toContain(listener1);
            expect(listeners).toContain(listener2);
        });

        it('should notify listeners on route change', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();

            router.addRouteChangeListener(listener1);
            router.addRouteChangeListener(listener2);

            (router as any).handleRouteChange();

            expect(listener1).toHaveBeenCalled();
            expect(listener2).toHaveBeenCalled();
        });

        it('should remove route change listeners', () => {
            const listener = vi.fn();
            router.addRouteChangeListener(listener);

            let listeners = (router as any).listeners;
            expect(listeners).toContain(listener);

            router.removeRouteChangeListener(listener);

            listeners = (router as any).listeners;
            expect(listeners).not.toContain(listener);
        });

        it('should handle removing non-existent listener', () => {
            const listener = vi.fn();
            const nonExistentListener = vi.fn();

            router.addRouteChangeListener(listener);
            router.removeRouteChangeListener(nonExistentListener);

            const listeners = (router as any).listeners;
            expect(listeners).toContain(listener);
            expect(listeners.length).toBe(1);
        });

        it('should remove specific listener only', () => {
            const listener1 = vi.fn();
            const listener2 = vi.fn();

            router.addRouteChangeListener(listener1);
            router.addRouteChangeListener(listener2);
            router.removeRouteChangeListener(listener1);

            const listeners = (router as any).listeners;
            expect(listeners).not.toContain(listener1);
            expect(listeners).toContain(listener2);
            expect(listeners.length).toBe(1);
        });
    });

    describe('Route Interface', () => {
        it('should accept valid route objects', () => {
            const route: Route = {
                path: '/test',
                component: 'test-component',
                title: 'Test Page'
            };

            expect(() => router.addRoute(route)).not.toThrow();
        });

        it('should handle route with all required properties', () => {
            const route: Route = {
                path: '/example',
                component: 'example-page',
                title: 'Example'
            };

            router.addRoute(route);
            const routes = (router as any).routes;
            const addedRoute = routes[0];

            expect(addedRoute.path).toBe('/example');
            expect(addedRoute.component).toBe('example-page');
            expect(addedRoute.title).toBe('Example');
        });
    });
});

describe('RouterController', () => {
    let mockHost: any;
    let routerController: RouterController;
    let router: Router;

    beforeEach(() => {
        // Reset singleton
        (Router as any).instance = null;

        // Create mock host
        mockHost = {
            requestUpdate: vi.fn()
        };

        router = Router.getInstance();
        routerController = new RouterController(mockHost);
    });

    afterEach(() => {
        // Clean up
        (router as any).listeners = [];
        (router as any).routes = [];
    });

    describe('Constructor', () => {
        it('should store host reference', () => {
            expect((routerController as any).host).toBe(mockHost);
        });

        it('should get router instance', () => {
            expect((routerController as any).router).toBe(router);
        });

        it('should create route change listener', () => {
            expect((routerController as any).routeChangeListener).toBeDefined();
            expect(typeof (routerController as any).routeChangeListener).toBe('function');
        });
    });

    describe('Host Lifecycle', () => {
        it('should add listener on host connected', () => {
            const listenersBefore = (router as any).listeners.length;
            routerController.hostConnected();
            const listenersAfter = (router as any).listeners.length;

            expect(listenersAfter).toBe(listenersBefore + 1);
        });

        it('should remove listener on host disconnected', () => {
            routerController.hostConnected();
            const listenersWithController = (router as any).listeners.length;

            routerController.hostDisconnected();
            const listenersAfterDisconnect = (router as any).listeners.length;

            expect(listenersAfterDisconnect).toBe(listenersWithController - 1);
        });

        it('should request update when route changes', () => {
            routerController.hostConnected();

            // Trigger route change
            (router as any).handleRouteChange();

            expect(mockHost.requestUpdate).toHaveBeenCalled();
        });
    });

    describe('Navigation Methods', () => {
        it('should delegate getCurrentPath to router', () => {
            (window as any).location.pathname = '/test';
            router.navigate('/test');
            expect(routerController.getCurrentPath()).toBe('/test');
        });

        it('should delegate navigate to router', () => {
            (window as any).location.pathname = '/controller-test';
            routerController.navigate('/controller-test');
            expect(router.getCurrentPath()).toBe('/controller-test');
        });

        it('should return string from getCurrentPath', () => {
            expect(typeof routerController.getCurrentPath()).toBe('string');
        });
    });

    describe('Integration with Host Component', () => {
        it('should trigger host updates on navigation', () => {
            routerController.hostConnected();
            routerController.navigate('/new-path');

            expect(mockHost.requestUpdate).toHaveBeenCalled();
        });

        it('should not trigger updates after disconnection', () => {
            routerController.hostConnected();
            routerController.hostDisconnected();

            mockHost.requestUpdate.mockClear();
            router.navigate('/test-after-disconnect');

            expect(mockHost.requestUpdate).not.toHaveBeenCalled();
        });
    });

    describe('Multiple Controller Instances', () => {
        it('should handle multiple controllers', () => {
            const mockHost2 = { requestUpdate: vi.fn() };
            const controller2 = new RouterController(mockHost2);

            routerController.hostConnected();
            controller2.hostConnected();

            router.navigate('/multi-controller-test');

            expect(mockHost.requestUpdate).toHaveBeenCalled();
            expect(mockHost2.requestUpdate).toHaveBeenCalled();
        });

        it('should handle independent disconnection', () => {
            const mockHost2 = { requestUpdate: vi.fn() };
            const controller2 = new RouterController(mockHost2);

            routerController.hostConnected();
            controller2.hostConnected();
            routerController.hostDisconnected();

            mockHost.requestUpdate.mockClear();
            mockHost2.requestUpdate.mockClear();

            router.navigate('/independent-test');

            expect(mockHost.requestUpdate).not.toHaveBeenCalled();
            expect(mockHost2.requestUpdate).toHaveBeenCalled();
        });
    });
});

describe('Router Integration Tests', () => {
    let router: Router;

    beforeEach(() => {
        (Router as any).instance = null;
        router = Router.getInstance();

        // Reset location to root
        (window as any).location = { pathname: '/' };

        // Set up routes
        const routes: Route[] = [
            { path: '/', component: 'home-page', title: 'Home' },
            { path: '/create', component: 'create-page', title: 'Create Employee' },
            { path: '/update', component: 'update-page', title: 'Update Employee' }
        ];
        routes.forEach(route => router.addRoute(route));
    });

    afterEach(() => {
        (router as any).listeners = [];
        (router as any).routes = [];
    });

    describe('Complete Navigation Flow', () => {
        it('should handle complete navigation with title updates', () => {
            // Navigate to create page
            (window as any).location.pathname = '/create';
            router.navigate('/create');
            (router as any).handleRouteChange();

            expect(router.getCurrentPath()).toBe('/create');
            expect(document.title).toBe('Create Employee - Employee Management');

            // Navigate to update page
            (window as any).location.pathname = '/update';
            router.navigate('/update');
            (router as any).handleRouteChange();

            expect(router.getCurrentPath()).toBe('/update');
            expect(document.title).toBe('Update Employee - Employee Management');
        });

        it('should handle browser back/forward navigation', () => {
            const listener = vi.fn();
            router.addRouteChangeListener(listener);

            // Simulate browser navigation
            (window as any).location.pathname = '/create';
            (router as any).handleRouteChange();

            expect(router.getCurrentPath()).toBe('/create');
            expect(listener).toHaveBeenCalled();
        });

        it('should maintain state consistency', () => {
            // Ensure clean state
            (window as any).location.pathname = '/';
            (router as any).handleRouteChange();

            expect(router.getCurrentPath()).toBe('/');
            expect(router.getCurrentRoute()?.path).toBe('/');

            (window as any).location.pathname = '/create';
            router.navigate('/create');
            expect(router.getCurrentPath()).toBe('/create');
            expect(router.getCurrentRoute()?.path).toBe('/create');
        });
    });

    describe('Error Handling', () => {
        it('should handle navigation to non-existent routes', () => {
            (window as any).location.pathname = '/non-existent';
            router.navigate('/non-existent');
            expect(router.getCurrentPath()).toBe('/non-existent');
            expect(router.getCurrentRoute()).toBeNull();
        });

        it('should handle empty routes array', () => {
            (router as any).routes = [];
            (window as any).location.pathname = '/test';
            router.navigate('/test');
            expect(router.getCurrentRoute()).toBeNull();
        });

        it('should handle malformed paths', () => {
            (window as any).location.pathname = '';
            router.navigate('');
            expect(router.getCurrentPath()).toBe('');

            (window as any).location.pathname = '//double-slash';
            router.navigate('//double-slash');
            expect(router.getCurrentPath()).toBe('//double-slash');
        });
    });

    describe('Performance Considerations', () => {
        it('should not navigate to same path repeatedly', () => {
            mockPushState.mockClear();

            (window as any).location.pathname = '/create';
            router.navigate('/create');
            router.navigate('/create');
            router.navigate('/create');

            expect(mockPushState).toHaveBeenCalledTimes(1);
        });

        it('should efficiently handle many listeners', () => {
            const listeners = Array.from({ length: 100 }, () => vi.fn());
            listeners.forEach(listener => router.addRouteChangeListener(listener));

            (router as any).handleRouteChange();

            listeners.forEach(listener => {
                expect(listener).toHaveBeenCalledTimes(1);
            });
        });
    });
});
