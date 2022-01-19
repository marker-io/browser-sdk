/**
 * Marker.io - https://marker.io
 * Browser loader for the Marker.io SDK
 */
export default {
  loadWidget(params) {
    // Warn if unknown params are provided
    const knownParams = [
      'destination',
      'reporter',
      'customShimUrl',
      'customData',
      'silent',
      'source',
      'ssr',
      'extension',
      'keyboardShortcuts',
    ];

    Object.keys(params).forEach((paramName) => {
      if (!knownParams.includes(paramName)) {
        console.warn('(Marker.io SDK) unknown param "' + paramName + '" (need to upgrade?)');
      }
    });

    // Extract params
    const { destination, reporter, customData, silent, ssr, extension, keyboardShortcuts } = params;

    if (typeof destination !== 'string') {
      throw new Error('destination must be a string');
    }

    if ('customData' in params && typeof customData !== 'object') {
      throw new Error('customData must be an object');
    }

    if ('silent' in params && typeof silent !== 'boolean') {
      throw new Error('silent must be a boolean');
    }

    if ('ssr' in params && typeof ssr !== 'object') {
      throw new Error('ssr must be a boolean');
    }

    if ('extension' in params && typeof extension !== 'boolean' && typeof extension !== 'object') {
      throw new Error('extension must be a boolean/object');
    }

    if ('keyboardShortcuts' in params && typeof keyboardShortcuts !== 'boolean') {
      throw new Error('keyboardShortcuts must be a boolean');
    }

    if (window.Marker) {
      // Only one Marker.io widget can be loaded at a time
      window.Marker.unload();
    }

    window.markerConfig = {
      destination,
      reporter,
      customData,
      silent,
      ssr,
      extension,
      keyboardShortcuts,
      source: 'browser-sdk',
    };

    const __cs = [];
    const sdk = { __cs };

    for (const methodName of [
      'show',
      'hide',
      'isVisible',
      'capture',
      'cancelCapture',
      'unload',
      'reload',
      'isExtensionInstalled',
      'setReporter',
      'setCustomData',
      'on',
      'off',
    ]) {
      sdk[methodName] = function () {
        const t = Array.prototype.slice.call(arguments);
        t.unshift(methodName);
        __cs.push(t);
      };
    }

    window.Marker = sdk;

    const script = document.createElement('script');
    script.async = 1;
    script.src = params.customShimUrl || 'https://edge.marker.io/latest/shim.js';

    const anchorScript = document.getElementsByTagName('script')[0];
    anchorScript.parentNode.insertBefore(script, anchorScript);

    return new Promise((resolve, reject) => {
      sdk.on('load', () => {
        resolve(window.Marker);
      });

      sdk.on('loaderror', (error) => {
        reject(error);
      });

      script.onerror = (error) => reject(error);
    });
  },
};
