/**
 * Marker.io - https://marker.io
 * Browser loader for the Marker.io SDK
 */
module.exports = {
  loadWidget(params) {
    // Warn if unknown params are provided
    const knownParams = ['destination', 'reporter'];

    Object.keys(params).forEach((paramName) => {
      if (!knownParams.includes(paramName)) {
        console.warn('(Marker.io SDK) unknown param "' + paramName + '" (need to upgrade?)');
      }
    });

    // Extract params
    const { destination, reporter } = params;

    if (typeof destination !== 'string') {
      throw new Error('destination must be a string');
    }

    if (window.Marker) {
      return window.Marker;
    }

    window.markerConfig = {
      destination,
      reporter,
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
    script.src = 'https://edge.marker.io/latest/shim.js';

    const anchorScript = document.getElementsByTagName('script')[0];
    anchorScript.parentNode.insertBefore(script, anchorScript);

    return new Promise((resolve, reject) => {
      sdk.on('load', () => {
        resolve(window.Marker);
      });

      script.onerror = (err) => reject(err);
    });
  },
};
