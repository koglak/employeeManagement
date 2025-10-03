import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfirmPopup, type ConfirmPopupOptions } from '../../src/components/popups/confirm-popup';

// Import the component
import '../../src/components/popups/confirm-popup';

describe('ConfirmPopup', () => {
    let element: ConfirmPopup;

    beforeEach(() => {
        element = document.createElement('confirm-popup') as ConfirmPopup;
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
        // Clean up any event listeners
        document.removeEventListener('keydown', (element as any)._onKeyDown);
    });

    describe('Component Initialization', () => {
        it('should render properly', () => {
            expect(element).toBeInstanceOf(ConfirmPopup);
            expect(element.shadowRoot).toBeTruthy();
        });

        it('should have default properties', () => {
            expect(element.open).toBe(false);
            expect(element.title).toBe('');
            expect(element.message).toBe('');
            expect(element.confirmText).toBeTruthy(); // Will have default from i18n
            expect(element.cancelText).toBeTruthy(); // Will have default from i18n
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
            element.title = 'Test Title';
            await element.updateComplete;
            expect(element.title).toBe('Test Title');
        });

        it('should update message property', async () => {
            element.message = 'Test Message';
            await element.updateComplete;
            expect(element.message).toBe('Test Message');
        });

        it('should update confirmText property', async () => {
            element.confirmText = 'Confirm Action';
            await element.updateComplete;
            expect(element.confirmText).toBe('Confirm Action');
        });

        it('should update cancelText property', async () => {
            element.cancelText = 'Cancel Action';
            await element.updateComplete;
            expect(element.cancelText).toBe('Cancel Action');
        });
    });

    describe('Show Method', () => {
        it('should show popup with provided options', () => {
            const options: ConfirmPopupOptions = {
                title: 'Delete Item',
                message: 'Are you sure you want to delete this item?',
                confirmText: 'Delete',
                cancelText: 'Keep'
            };

            element.show(options);

            expect(element.open).toBe(true);
            expect(element.title).toBe('Delete Item');
            expect(element.message).toBe('Are you sure you want to delete this item?');
            expect(element.confirmText).toBe('Delete');
            expect(element.cancelText).toBe('Keep');
        });

        it('should show popup with minimal options', () => {
            const options: ConfirmPopupOptions = {
                title: 'Confirm',
                message: 'Are you sure?'
            };

            element.show(options);

            expect(element.open).toBe(true);
            expect(element.title).toBe('Confirm');
            expect(element.message).toBe('Are you sure?');
            // confirmText and cancelText should keep their defaults
        });

        it('should show popup with partial custom text', () => {
            const options: ConfirmPopupOptions = {
                title: 'Save Changes',
                message: 'Do you want to save your changes?',
                confirmText: 'Save'
                // cancelText not provided, should use default
            };

            element.show(options);

            expect(element.open).toBe(true);
            expect(element.title).toBe('Save Changes');
            expect(element.message).toBe('Do you want to save your changes?');
            expect(element.confirmText).toBe('Save');
            // cancelText should keep default value
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
        it('should emit confirm event when confirm button is clicked', () => {
            let confirmEventFired = false;
            element.addEventListener('confirm', () => {
                confirmEventFired = true;
            });

            element.open = true;
            (element as any).handleConfirm();

            expect(confirmEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should emit cancel event when cancel button is clicked', () => {
            let cancelEventFired = false;
            element.addEventListener('cancel', () => {
                cancelEventFired = true;
            });

            element.open = true;
            (element as any).handleCancel();

            expect(cancelEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should emit cancel event when close button is clicked', () => {
            let cancelEventFired = false;
            element.addEventListener('cancel', () => {
                cancelEventFired = true;
            });

            element.open = true;
            (element as any).handleCancel();

            expect(cancelEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should emit cancel event when overlay is clicked', () => {
            let cancelEventFired = false;
            element.addEventListener('cancel', () => {
                cancelEventFired = true;
            });

            element.open = true;

            // Simulate overlay click (target === currentTarget)
            const mockEvent = {
                target: element,
                currentTarget: element
            } as unknown as Event;

            (element as any).handleOverlayClick(mockEvent);

            expect(cancelEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should not emit cancel event when clicking inside popup', () => {
            let cancelEventFired = false;
            element.addEventListener('cancel', () => {
                cancelEventFired = true;
            });

            element.open = true;

            // Simulate click inside popup (target !== currentTarget)
            const mockEvent = {
                target: document.createElement('div'),
                currentTarget: element
            } as unknown as Event;

            (element as any).handleOverlayClick(mockEvent);

            expect(cancelEventFired).toBe(false);
            expect(element.open).toBe(true);
        });
    });

    describe('Keyboard Navigation', () => {
        it('should handle Escape key to cancel', () => {
            let cancelEventFired = false;
            element.addEventListener('cancel', () => {
                cancelEventFired = true;
            });

            element.open = true;

            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            (element as any)._onKeyDown(escapeEvent);

            expect(cancelEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should handle Enter key to confirm', () => {
            let confirmEventFired = false;
            element.addEventListener('confirm', () => {
                confirmEventFired = true;
            });

            element.open = true;

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            (element as any)._onKeyDown(enterEvent);

            expect(confirmEventFired).toBe(true);
            expect(element.open).toBe(false);
        });

        it('should ignore keyboard events when popup is closed', () => {
            let confirmEventFired = false;
            let cancelEventFired = false;

            element.addEventListener('confirm', () => {
                confirmEventFired = true;
            });
            element.addEventListener('cancel', () => {
                cancelEventFired = true;
            });

            element.open = false;

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });

            (element as any)._onKeyDown(enterEvent);
            (element as any)._onKeyDown(escapeEvent);

            expect(confirmEventFired).toBe(false);
            expect(cancelEventFired).toBe(false);
        });

        it('should ignore other keyboard keys', () => {
            let confirmEventFired = false;
            let cancelEventFired = false;

            element.addEventListener('confirm', () => {
                confirmEventFired = true;
            });
            element.addEventListener('cancel', () => {
                cancelEventFired = true;
            });

            element.open = true;

            const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
            const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });

            (element as any)._onKeyDown(spaceEvent);
            (element as any)._onKeyDown(tabEvent);

            expect(confirmEventFired).toBe(false);
            expect(cancelEventFired).toBe(false);
            expect(element.open).toBe(true);
        });
    });

    describe('Event Bubbling', () => {
        it('should emit confirm event with bubbles and composed flags', () => {
            let eventDetails: CustomEvent | null = null;
            element.addEventListener('confirm', (e) => {
                eventDetails = e as CustomEvent;
            });

            (element as any).handleConfirm();

            expect(eventDetails).toBeTruthy();
            expect(eventDetails!.bubbles).toBe(true);
            expect(eventDetails!.composed).toBe(true);
        });

        it('should emit cancel event with bubbles and composed flags', () => {
            let eventDetails: CustomEvent | null = null;
            element.addEventListener('cancel', (e) => {
                eventDetails = e as CustomEvent;
            });

            (element as any).handleCancel();

            expect(eventDetails).toBeTruthy();
            expect(eventDetails!.bubbles).toBe(true);
            expect(eventDetails!.composed).toBe(true);
        });
    });

    describe('Lifecycle Management', () => {
        it('should add keydown event listener on connect', () => {
            const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

            // Create a new element to test connectedCallback
            const newElement = document.createElement('confirm-popup') as ConfirmPopup;
            document.body.appendChild(newElement);

            expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

            document.body.removeChild(newElement);
            addEventListenerSpy.mockRestore();
        });

        it('should remove keydown event listener on disconnect', () => {
            const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

            // Create and remove element to test disconnectedCallback
            const newElement = document.createElement('confirm-popup') as ConfirmPopup;
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
            expect(popup?.getAttribute('aria-labelledby')).toBe('cp-title');
        });

        it('should have accessible close button', async () => {
            element.open = true;
            await element.updateComplete;

            const closeButton = element.shadowRoot?.querySelector('.close');
            expect(closeButton?.getAttribute('aria-label')).toBeTruthy();
        });
    });

    describe('Component Methods', () => {
        it('should have show method', () => {
            expect(typeof element.show).toBe('function');
        });

        it('should have hide method', () => {
            expect(typeof element.hide).toBe('function');
        });

        it('should have private event handlers', () => {
            expect(typeof (element as any).handleConfirm).toBe('function');
            expect(typeof (element as any).handleCancel).toBe('function');
            expect(typeof (element as any).handleOverlayClick).toBe('function');
        });
    });
});
