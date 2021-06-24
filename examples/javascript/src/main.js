import markerSDK from '@marker.io/browser';

window.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const loadSDKForm = document.querySelector('.js-load-sdk-form');
  const destinationIdInput = document.querySelector('.js-destination-id-input');

  const sdkLoaded = document.querySelector('.js-sdk-loaded');

  const widgetShowButton = document.querySelector('.js-widget-show-btn');
  const widgetHideButton = document.querySelector('.js-widget-hide-btn');
  const widgetCaptureButton = document.querySelector('.js-widget-capture-btn');
  const widgetUnloadButton = document.querySelector('.js-widget-unload-btn');

  // Our widget SDK will be loaded in this variable
  let widget;

  // Handle SDK loading
  loadSDKForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    widget = await markerSDK.loadWidget({
      destination: destinationIdInput.value,

      customData: {
        storeId: 123,
        storeName: 'Green Fruits Store',
      },
    });

    sdkLoaded.classList.remove('hide');
    loadSDKForm.classList.add('hide');

    // Handle unloading properly
    widget.on('beforeunload', () => {
      widget = undefined;

      sdkLoaded.classList.add('hide');
      loadSDKForm.classList.remove('hide');
    });
  });

  // SDK Action buttons
  widgetShowButton.addEventListener('click', (event) => {
    event.preventDefault();
    widget.show();
  });

  widgetHideButton.addEventListener('click', (event) => {
    event.preventDefault();
    widget.hide();
  });

  widgetCaptureButton.addEventListener('click', (event) => {
    event.preventDefault();
    widget.capture();
  });

  widgetUnloadButton.addEventListener('click', (event) => {
    event.preventDefault();
    widget.unload();
  });
});
