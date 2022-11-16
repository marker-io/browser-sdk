/**
 * Marker.io - https://marker.io
 * Browser loader for the Marker.io SDK
 */

// * Typescript definitions
export type MarkerWidgetParams = {
  reporter?: MarkerReporter;
  customShimUrl?: string;
  customData?: Record<string, string>;
  silent?: boolean;
  source?: string;
  ssr?: Record<string, string>;
  extension?: boolean | Record<string, string>;
  keyboardShortcuts?: boolean;
  beta?: Object;
};

/**
 * @deprecated use "project" parameter instead
 */
export type MarkerDestinationWidgetParams = MarkerWidgetParams & {
  destination: string;
};

export type MarkerProjectWidgetParams = MarkerWidgetParams & {
  project: string;
};

export type MarkerReporter = {
  email: string;
  fullName: string;
};

type MarkerEventName =
  | 'load'
  | 'loaderror'
  | 'beforeunload'
  | 'show'
  | 'hide'
  | 'capture'
  | 'feedbackbeforesend'
  | 'feedbacksent'
  | 'feedbackerror'
  | 'feedbackdiscarded';

export type MarkerSdk = {
  show: () => void;
  hide: () => void;
  isVisible: () => boolean;
  capture: (mode: 'fullscreen' | 'advanced') => Promise<void>;
  cancelCapture: () => void;
  isExtensionInstalled: () => Promise<boolean>;
  setReporter: (reporter: MarkerReporter) => void;
  unload: () => void;
  on: (eventName: MarkerEventName, listener: () => void) => void;
};

export type MarkerSdkLoader = {
  loadWidget: (
    params: MarkerDestinationWidgetParams | MarkerProjectWidgetParams,
  ) => Promise<MarkerSdk>;
};

declare global {
  interface Window {
    Marker: MarkerSdk;
    markerConfig: MarkerProjectWidgetParams;
  }
}

// * SDK Loader implementation
const markerSDK: MarkerSdkLoader = {
  loadWidget(params: MarkerDestinationWidgetParams | MarkerProjectWidgetParams) {
    // Warn if unknown params are provided
    const knownParams = [
      'destination',
      'project',
      'reporter',
      'customShimUrl',
      'customData',
      'silent',
      'source',
      'ssr',
      'extension',
      'keyboardShortcuts',
      'beta',
    ];

    Object.keys(params).forEach((paramName) => {
      if (!knownParams.includes(paramName)) {
        console.warn('(Marker.io SDK) unknown param "' + paramName + '" (need to upgrade?)');
      }
    });

    // Extract params
    const { reporter, customData, silent, ssr, extension, keyboardShortcuts, beta } = params;

    const project =
      (params as MarkerProjectWidgetParams).project ||
      (params as MarkerDestinationWidgetParams).destination;

    if (typeof project !== 'string') {
      throw new Error('project must be a string');
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

    if ('beta' in params && typeof beta !== 'object') {
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
      project,
      reporter,
      customData,
      silent,
      ssr,
      extension,
      keyboardShortcuts,
      beta,
      source: 'browser-sdk',
    };

    const __cs: Array<any> = [];

    // @ts-ignore
    const sdk: MarkerSdk = { __cs };

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
      // @ts-ignore
      sdk[methodName] = function () {
        const t = Array.prototype.slice.call(arguments);
        t.unshift(methodName);
        __cs.push(t as never);
      };
    }

    window.Marker = sdk;

    const script = document.createElement('script');
    script.async = true;
    script.src = params.customShimUrl || 'https://edge.marker.io/latest/shim.js';

    const anchorScript = document.getElementsByTagName('script')[0];

    if (anchorScript.parentNode) {
      anchorScript.parentNode.insertBefore(script, anchorScript);
    } else {
      (document.body || document.head).appendChild(script);
    }

    return new Promise((resolve, reject) => {
      // @ts-ignore
      sdk.on('load', () => {
        resolve(window.Marker);
      });

      // @ts-ignore
      sdk.on('loaderror', (error) => {
        reject(error);
      });

      script.onerror = (error) => reject(error);
    });
  },
};

export default markerSDK;
