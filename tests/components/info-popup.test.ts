import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InfoPopup, type InfoPopupOptions } from '../../src/components/popups/info-popup';

// Import the component
import '../../src/components/popups/info-popup';

describe('InfoPopup', () => {
    let element: InfoPopup;

    beforeEach(() => {
        element = document.createElement('info-popup') as InfoPopup;
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
        // Clean up any event listeners
        document.removeEventListener('keydown', (element as any)._onKeyDown);
    });

    describe('Component Initialization', () => {
        it('should render properly', () => {
            expect(element).toBeInstanceOf(InfoPopup);
            expect(element.shadowRoot).toBeTruthy();
        });

        it('should have default properties', () => {
            expect(element.open).toBe(false);
            expect(element.title).toBe('');
            expect(element.message).toBe('');
            expect(element.okText).toBeTruthy(); // Will have default from i18n
            expect(element.type).toBe('info');
        });

        it('should not be open initially', () => {
            expect(element.open).toBe(false);
        });
    });

    describe('Property Management', () => {
        it('should update open property', async () => {
            element.open = true;
            await element.updateComplete;
            expect(element.open).toBe(true);

            element.open = false;
            await element.updateComplete;
            expect(element.open).toBe(false);
        });

        it('should update title property', async () => {
            element.title = 'Information';
            await element.updateComplete;
            expect(element.title).toBe('Information');
        });

        it('should update message property', async () => {
            element.message = 'This is an informational message';
            await element.updateComplete;
            expect(element.message).toBe('This is an informational message');
        });

        it('should update okText property', async () => {
            element.okText = 'Got it';
            await element.updateComplete;
            expect(element.okText).toBe('Got it');
        });

        it('should update type property', async () => {
            element.type = 'warning';
            await element.updateComplete;
            expect(element.type).toBe('warning');

            element.type = 'error';
            await element.updateComplete;
            expect(element.type).toBe('error');

            element.type = 'success';
            await element.updateComplete;
            expect(element.type).toBe('success');

            element.type = 'info';
            await element.updateComplete;
            expect(element.type).toBe('info');
        });
    });

    describe('Show Method', () => {
        it('should show popup with provided options', () => {
            const options: InfoPopupOptions = {
                title: 'Success',
                message: 'Operation completed successfully!',
                okText: 'Great',
                type: 'success'
            };

            element.show(options);

            expect(element.open).toBe(true);
            expect(element.title).toBe('Success');
            expect(element.message).toBe('Operation completed successfully!');
            expect(element.okText).toBe('Great');
            expect(element.type).toBe('success');
        });

        it('should show popup with minimal options', () => {
            const options: InfoPopupOptions = {
                title: 'Info',
                message: 'This is information'
            };

            element.show(options);

            expect(element.open).toBe(true);
            expect(element.title).toBe('Info');
            expect(element.message).toBe('This is information');
            expect(element.type).toBe('info'); // Should default to 'info'
        });

        it('should show popup with custom ok text only', () => {
            const options: InfoPopupOptions = {
                title: 'Warning',
                message: 'This is a warning message',
                okText: 'Understood'
            };

            element.show(options);

            expect(element.open).toBe(true);
            expect(element.title).toBe('Warning');
            expect(element.message).toBe('This is a warning message');
            expect(element.okText).toBe('Understood');
            expect(element.type).toBe('info'); // Should default to 'info'
        });

        it('should show popup with all popup types', () => {
            const types: Array<'info' | 'warning' | 'error' | 'success'> = ['info', 'warning', 'error', 'success'];

            types.forEach(type => {
                const options: InfoPopupOptions = {
                    title: `${type} title`,
                    message: `${type} message`,
                    type
                };

                element.show(options);

                expect(element.open).toBe(true);
                expect(element.type).toBe(type);

                element.hide(); // Reset for next iteration
            });
        });
    });

    describe('Hide Method', () => {
        it('should hide popup', () => {
            element.open = true;
            element.hide();
            expect(element.open).toBe(false);
        });

        it('should hide popup when already closed', () => {
            element.open = false;
            element.hide();
            expect(element.open).toBe(false);
        });
    });

    describe('Event Handling', () => {
        it('should emit ok event when ok button is clicked', () => {
            let okEventFired = false;
            element.addEventListener('ok', () => {
                okEventFired = true;
            });

            element.open = true;
            (element as any).handleOk();

            expect(okEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should emit ok event when close button is clicked', () => {
            let okEventFired = false;
            element.addEventListener('ok', () => {
                okEventFired = true;
            });

            element.open = true;
            (element as any).handleOk();

            expect(okEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should emit ok event when overlay is clicked', () => {
            let okEventFired = false;
            element.addEventListener('ok', () => {
                okEventFired = true;
            });

            element.open = true;

            // Simulate overlay click (target === currentTarget)
            const mockEvent = {
                target: element,
                currentTarget: element
            } as unknown as Event;

            (element as any).handleOverlayClick(mockEvent);

            expect(okEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should not emit ok event when clicking inside popup', () => {
            let okEventFired = false;
            element.addEventListener('ok', () => {
                okEventFired = true;
            });

            element.open = true;

            // Simulate click inside popup (target !== currentTarget)
            const mockEvent = {
                target: document.createElement('div'),
                currentTarget: element
            } as unknown as Event;

            (element as any).handleOverlayClick(mockEvent);

            expect(okEventFired).toBe(false);
            expect(element.open).toBe(true);
        });
    });

    describe('Keyboard Navigation', () => {
        it('should handle Escape key to close', () => {
            let okEventFired = false;
            element.addEventListener('ok', () => {
                okEventFired = true;
            });

            element.open = true;

            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            (element as any)._onKeyDown(escapeEvent);

            expect(okEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should handle Enter key to close', () => {
            let okEventFired = false;
            element.addEventListener('ok', () => {
                okEventFired = true;
            });

            element.open = true;

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            (element as any)._onKeyDown(enterEvent);

            expect(okEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should ignore keyboard events when popup is closed', () => {
            let okEventFired = false;

            element.addEventListener('ok', () => {
                okEventFired = true;
            });

            element.open = false;

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });

            (element as any)._onKeyDown(enterEvent);
            (element as any)._onKeyDown(escapeEvent);

            expect(okEventFired).toBe(false);
        });

        it('should ignore other keyboard keys', () => {
            let okEventFired = false;

            element.addEventListener('ok', () => {
                okEventFired = true;
            });

            element.open = true;

            const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
            const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });

            (element as any)._onKeyDown(spaceEvent);
            (element as any)._onKeyDown(tabEvent);

            expect(okEventFired).toBe(false);
            expect(element.open).toBe(true);
        });
    });

    describe('Icon Rendering', () => {
        it('should render info icon for info type', () => {
            element.type = 'info';
            const iconHtml = (element as any).renderIcon();
            expect(iconHtml.strings.join('')).toContain('icon info');
        });

        it('should render warning icon for warning type', () => {
            element.type = 'warning';
            const iconHtml = (element as any).renderIcon();
            expect(iconHtml.strings.join('')).toContain('icon warning');
        });

        it('should render error icon for error type', () => {
            element.type = 'error';
            const iconHtml = (element as any).renderIcon();
            expect(iconHtml.strings.join('')).toContain('icon error');
        });

        it('should render success icon for success type', () => {
            element.type = 'success';
            const iconHtml = (element as any).renderIcon();
            expect(iconHtml.strings.join('')).toContain('icon success');
        });

        it('should render info icon as default for unknown type', () => {
            (element as any).type = 'unknown';
            const iconHtml = (element as any).renderIcon();
            expect(iconHtml.strings.join('')).toContain('icon info');
        });
    });

    describe('Event Bubbling', () => {
        it('should emit ok event with bubbles and composed flags', () => {
            let eventDetails: CustomEvent | null = null;
            element.addEventListener('ok', (e) => {
                eventDetails = e as CustomEvent;
            });

            (element as any).handleOk();

            expect(eventDetails).toBeTruthy();
            expect(eventDetails!.bubbles).toBe(true);
            expect(eventDetails!.composed).toBe(true);
        });
    });

    describe('Lifecycle Management', () => {
        it('should add keydown event listener on connect', () => {
            const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

            // Create a new element to test connectedCallback
            const newElement = document.createElement('info-popup') as InfoPopup;
            document.body.appendChild(newElement);

            expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

            document.body.removeChild(newElement);
            addEventListenerSpy.mockRestore();
        });

        it('should remove keydown event listener on disconnect', () => {
            const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

            // Create and remove element to test disconnectedCallback
            const newElement = document.createElement('info-popup') as InfoPopup;
            document.body.appendChild(newElement);
            document.body.removeChild(newElement);

            expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

            removeEventListenerSpy.mockRestore();
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', async () => {
            element.open = true;
            await element.updateComplete;

            const popup = element.shadowRoot?.querySelector('.popup');
            expect(popup?.getAttribute('role')).toBe('dialog');
            expect(popup?.getAttribute('aria-modal')).toBe('true');
            expect(popup?.getAttribute('aria-labelledby')).toBe('ip-title');
        });

        it('should have accessible close button', async () => {
            element.open = true;
            await element.updateComplete;

            const closeButton = element.shadowRoot?.querySelector('.close');
            expect(closeButton?.getAttribute('aria-label')).toBeTruthy();
        });

        it('should have proper CSS classes for different types', async () => {
            const types: Array<'info' | 'warning' | 'error' | 'success'> = ['info', 'warning', 'error', 'success'];

            for (const type of types) {
                element.type = type;
                element.open = true;
                await element.updateComplete;

                const popup = element.shadowRoot?.querySelector('.popup');
                expect(popup?.classList.contains(type)).toBe(true);

                element.open = false;
            }
        });
    });

    describe('Component Methods', () => {
        it('should have show method', () => {
            expect(typeof element.show).toBe('function');
        });

        it('should have hide method', () => {
            expect(typeof element.hide).toBe('function');
        });

        it('should have renderIcon method', () => {
            expect(typeof (element as any).renderIcon).toBe('function');
        });

        it('should have private event handlers', () => {
            expect(typeof (element as any).handleOk).toBe('function');
            expect(typeof (element as any).handleOverlayClick).toBe('function');
        });
    });

    describe('Type Safety', () => {
        it('should only accept valid popup types', () => {
            const validTypes: Array<'info' | 'warning' | 'error' | 'success'> = ['info', 'warning', 'error', 'success'];

            validTypes.forEach(type => {
                element.type = type;
                expect(element.type).toBe(type);
            });
        });

        it('should handle type in show options', () => {
            const options: InfoPopupOptions = {
                title: 'Test',
                message: 'Test message',
                type: 'error'
            };

            element.show(options);
            expect(element.type).toBe('error');
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete workflow', () => {
            // Initial state
            expect(element.open).toBe(false);

            // Show popup
            const options: InfoPopupOptions = {
                title: 'Test Workflow',
                message: 'Testing complete workflow',
                type: 'success',
                okText: 'Continue'
            };

            element.show(options);

            // Verify popup is shown with correct data
            expect(element.open).toBe(true);
            expect(element.title).toBe('Test Workflow');
            expect(element.message).toBe('Testing complete workflow');
            expect(element.type).toBe('success');
            expect(element.okText).toBe('Continue');

            // Verify event emission
            let okEventFired = false;
            element.addEventListener('ok', () => {
                okEventFired = true;
            });

            // Close popup
            (element as any).handleOk();

            // Verify final state
            expect(element.open).toBe(false);
            expect(okEventFired).toBe(true);
        });

        it('should handle multiple show/hide cycles', () => {
            for (let i = 0; i < 3; i++) {
                const options: InfoPopupOptions = {
                    title: `Test ${i}`,
                    message: `Message ${i}`,
                    type: i % 2 === 0 ? 'info' : 'warning'
                };

                element.show(options);
                expect(element.open).toBe(true);
                expect(element.title).toBe(`Test ${i}`);

                element.hide();
                expect(element.open).toBe(false);
            }
        });
    });
});
