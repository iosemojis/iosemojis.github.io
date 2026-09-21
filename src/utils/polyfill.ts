/**
 * Global Polyfill for Environment & Third-party compatibility.
 * Ensures window.fetch has both getter and setter so external scripts (GTM, AdSense, browser extensions)
 * can safely wrap fetch without triggering 'TypeError: Cannot set property fetch of #<Window> which has only a getter'.
 */
(function initFetchPolyfill() {
  if (typeof window === 'undefined') return;

  try {
    const realFetch = window.fetch;
    if (realFetch) {
      const boundFetch = realFetch.bind(window);
      let currentFetch = boundFetch;

      const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
      if (!descriptor || descriptor.configurable) {
        Object.defineProperty(window, 'fetch', {
          configurable: true,
          enumerable: true,
          get() {
            return currentFetch;
          },
          set(fn: any) {
            currentFetch = typeof fn === 'function' ? fn : boundFetch;
          },
        });
      }

      const proto =
        Object.getPrototypeOf(window) ||
        (typeof Window !== 'undefined' ? Window.prototype : null);
      if (proto) {
        const protoDesc = Object.getOwnPropertyDescriptor(proto, 'fetch');
        if (protoDesc && protoDesc.configurable) {
          Object.defineProperty(proto, 'fetch', {
            configurable: true,
            enumerable: true,
            get() {
              return currentFetch;
            },
            set(fn: any) {
              currentFetch = typeof fn === 'function' ? fn : boundFetch;
            },
          });
        }
      }
    }
  } catch (e) {
    // Ignore polyfill errors
  }

  // Intercept and prevent unhandled 'fetch getter' exceptions from bubbling up
  window.addEventListener('error', (event) => {
    if (
      event &&
      event.message &&
      typeof event.message === 'string' &&
      event.message.includes('fetch') &&
      event.message.includes('getter')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
})();

export {};
