import { describe, it, expect } from 'vitest';
import { ConfirmPopup, InfoPopup } from '../../src/components/popups/index';
import type { ConfirmPopupOptions, InfoPopupOptions } from '../../src/components/popups/index';

// Import the components
import '../../src/components/popups/confirm-popup';
import '../../src/components/popups/info-popup';

describe('Popups Index', () => {
    describe('Exports', () => {
        it('should export ConfirmPopup class', () => {
            expect(ConfirmPopup).toBeTruthy();
            expect(typeof ConfirmPopup).toBe('function');
        });

        it('should export InfoPopup class', () => {
            expect(InfoPopup).toBeTruthy();
            expect(typeof InfoPopup).toBe('function');
        });

        it('should be able to create ConfirmPopup instance', () => {
            const confirmPopup = new ConfirmPopup();
            expect(confirmPopup).toBeInstanceOf(ConfirmPopup);
        });

        it('should be able to create InfoPopup instance', () => {
            const infoPopup = new InfoPopup();
            expect(infoPopup).toBeInstanceOf(InfoPopup);
        });
    });

    describe('Type Exports', () => {
        it('should have ConfirmPopupOptions type available', () => {
            const options: ConfirmPopupOptions = {
                title: 'Test',
                message: 'Test message',
                confirmText: 'Confirm',
                cancelText: 'Cancel'
            };

            expect(options.title).toBe('Test');
            expect(options.message).toBe('Test message');
            expect(options.confirmText).toBe('Confirm');
            expect(options.cancelText).toBe('Cancel');
        });

        it('should have InfoPopupOptions type available', () => {
            const options: InfoPopupOptions = {
                title: 'Info',
                message: 'Info message',
                okText: 'OK',
                type: 'info'
            };

            expect(options.title).toBe('Info');
            expect(options.message).toBe('Info message');
            expect(options.okText).toBe('OK');
            expect(options.type).toBe('info');
        });

        it('should support minimal ConfirmPopupOptions', () => {
            const options: ConfirmPopupOptions = {
                title: 'Minimal',
                message: 'Minimal message'
            };

            expect(options.title).toBe('Minimal');
            expect(options.message).toBe('Minimal message');
            expect(options.confirmText).toBeUndefined();
            expect(options.cancelText).toBeUndefined();
        });

        it('should support minimal InfoPopupOptions', () => {
            const options: InfoPopupOptions = {
                title: 'Minimal Info',
                message: 'Minimal info message'
            };

            expect(options.title).toBe('Minimal Info');
            expect(options.message).toBe('Minimal info message');
            expect(options.okText).toBeUndefined();
            expect(options.type).toBeUndefined();
        });

        it('should support all InfoPopup types', () => {
            const infoOptions: InfoPopupOptions = {
                title: 'Info',
                message: 'Info message',
                type: 'info'
            };

            const warningOptions: InfoPopupOptions = {
                title: 'Warning',
                message: 'Warning message',
                type: 'warning'
            };

            const errorOptions: InfoPopupOptions = {
                title: 'Error',
                message: 'Error message',
                type: 'error'
            };

            const successOptions: InfoPopupOptions = {
                title: 'Success',
                message: 'Success message',
                type: 'success'
            };

            expect(infoOptions.type).toBe('info');
            expect(warningOptions.type).toBe('warning');
            expect(errorOptions.type).toBe('error');
            expect(successOptions.type).toBe('success');
        });
    });

    describe('Integration', () => {
        it('should allow creating and using both popup types together', () => {
            const confirmPopup = new ConfirmPopup();
            const infoPopup = new InfoPopup();

            // Both should be instances of LitElement
            expect(confirmPopup.tagName.toLowerCase()).toBe('confirm-popup');
            expect(infoPopup.tagName.toLowerCase()).toBe('info-popup');

            // Both should have show/hide methods
            expect(typeof confirmPopup.show).toBe('function');
            expect(typeof confirmPopup.hide).toBe('function');
            expect(typeof infoPopup.show).toBe('function');
            expect(typeof infoPopup.hide).toBe('function');
        });

        it('should work with their respective options types', () => {
            const confirmPopup = new ConfirmPopup();
            const infoPopup = new InfoPopup();

            const confirmOptions: ConfirmPopupOptions = {
                title: 'Confirm Test',
                message: 'Are you sure?',
                confirmText: 'Yes',
                cancelText: 'No'
            };

            const infoOptions: InfoPopupOptions = {
                title: 'Info Test',
                message: 'This is information',
                type: 'info',
                okText: 'Got it'
            };

            // Should not throw errors
            expect(() => confirmPopup.show(confirmOptions)).not.toThrow();
            expect(() => infoPopup.show(infoOptions)).not.toThrow();
        });
    });
});
