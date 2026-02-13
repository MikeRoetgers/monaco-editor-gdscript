import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
});

// Assign browser globals that Monaco Editor requires.
// These must be in place BEFORE Monaco is imported in any test.

const win = dom.window;

// Helper to safely assign a global, using Object.defineProperty when
// the property already exists as a non-writable / getter-only binding
// (e.g. `navigator` in newer Node.js versions).
function setGlobal(name: string, value: unknown): void {
    try {
        (globalThis as any)[name] = value;
    } catch {
        Object.defineProperty(globalThis, name, {
            value,
            writable: true,
            configurable: true,
        });
    }
}

setGlobal('window', win);
setGlobal('document', win.document);
setGlobal('navigator', win.navigator);
setGlobal('HTMLElement', win.HTMLElement);
setGlobal('Node', win.Node);
setGlobal('Element', win.Element);
setGlobal('Event', win.Event);
setGlobal('MouseEvent', win.MouseEvent);
setGlobal('KeyboardEvent', win.KeyboardEvent);
setGlobal('customElements', win.customElements);

setGlobal('CSS', {
    escape: (str: string) => str.replace(/([^\w-])/g, '\\$1'),
    supports: () => false,
});

const mockMatchMedia = function (): MediaQueryList {
    return {
        matches: false,
        media: '',
        onchange: null,
        addListener: function () {},
        removeListener: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
        dispatchEvent: function () {
            return true;
        },
    } as unknown as MediaQueryList;
};

setGlobal('matchMedia', mockMatchMedia);
(win as any).matchMedia = mockMatchMedia;

setGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    setTimeout(callback, 0));
setGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
