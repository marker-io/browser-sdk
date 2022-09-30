
export type LoadWidgetParams = {
  destination: string;
  reporter: MarkerSdkReporter;
  customShimUrl: string;
  customData: Record<string, string>;
  silent: boolean;
  source: string;
  ssr: Record<string, string>;
  extension: boolean | Record<string, string>;
  keyboardShortcuts: boolean;
}

export type MarkerSdkReporter = {
  email: string;
  fullName: string;
}

type MarkerEventName = 'load' | 'loaderror' | 'beforeunload' | 'show' | 'hide' | 'capture'
  | 'feedbackbeforesend' | 'feedbacksent' | 'feedbackerror' | 'feedbackdiscarded';

export type MarkerSdk = {
  show: () => void;
  hide: () => void;
  isVisible: () => boolean;
  capture: (mode: 'fullscreen' | 'advanced') => Promise<void>;
  cancelCapture: () => void;
  isExtensionInstalled: () => Promise<boolean>;
  setReporter: (reporter: MarkerSdkReporter) => void;
  unload: () => void;
  on: (eventName: MarkerEventName, listener: () => void) => void;
}

export type MarkerSdkLoader = {
  loadWidget: (LoadWidgetParams) => Promise<MarkerSdk>;
}

declare const markerSDK: MarkerSdkLoader;
export default markerSDK;
