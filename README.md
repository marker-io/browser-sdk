<div align="center">
  <a href="https://marker.io/?utm_source=npm" target="_blank"><img width="300" height="60" src="./marker.io-logo.svg" /></a>

  <p>
    <h3 align="center">
      Official Marker.io browser SDK 🚀
    </h3>
  </p>

  <a href="https://www.npmjs.com/package/@marker.io/browser">
    <img src="https://img.shields.io/npm/v/@marker.io/browser.svg?style=flat-square" alt="NPM version" />
  </a>

  <a href="https://npmjs.org/package/@marker.io/browser">
    <img src="https://img.shields.io/npm/dt/@marker.io/browser.svg?style=flat-square"
      alt="Download" />
  </a>
</div>

<div align="center">
  <h3>
    <a href="https://marker.io/?utm_source=npm">Website</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://help.marker.io/en/collections/2533894-widget?utm_source=npm">Docs</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://marker.io/blog?utm_source=npm">Blog</a>
  </h3>
</div>

<hr>

## Table of Contents

- [Examples](#examples)
- [Features](#features)
- [Installation](#installation)
- [API docs](#%EF%B8%8F-api)
- [Events](#-events)
- [Support](#support)
- [License](#license)

## Examples

- [Vue.js](https://github.com/marker-io/browser/tree/master/examples/vue)
- React _(Coming soon)_
- [Vanilla Javascript](https://github.com/marker-io/browser/tree/master/examples/javascript)

## Features

- Inject Marker.io widget in your web app
- Full control of the widget (hide / show, trigger captures, ...)
- Identify reporters ([Learn more](#%EF%B8%8F-identify-reporters))
- Inject custom metadata in issues ([Learn more](#%EF%B8%8F-custom-metadata))
- Silent mode ([Learn more](#-enabling-markerio-silent-mode))
- Delayed server-side capture ([Learn more](#-delayed-capture-using-server-side-capture))
- Disabling keyboard shortcuts ([Learn more](#%EF%B8%8F-disabling-keyboard-shortcuts))

## Installation

1. First install the package from npm:

`npm install -s @marker.io/browser`

2. Setup the SDK in your code:

```javascript
import markerSDK from '@marker.io/browser';

const widget = await markerSDK.loadWidget({ destination: 'abcd1234567890' });
```

## ⚙️ API

### `widget.show()`

Shows the Marker.io feedback widget.

### `widget.hide()`

Hides the Marker.io feedback widget.

### `widget.isVisible()`

Returns wether the feedback widget is currently visible or not.

### `widget.capture(mode)`

Captures a feedback on the current page.

- `mode`: Type of capture to trigger. Available modes: `fullscreen`, `advanced`.

  - `fullscreen` captures the entire visible area
  - `advanced` shows the advanced capture options: limited area, entire page and desktop.

<details>
  <summary>Example</summary>

```javascript
widget.capture(); // or
widget.capture('fullscreen');
widget.capture('advanced');
```

</details>

### `widget.cancelCapture()`

Cancels current capture.

### `widget.isExtensionInstalled()`

Returns a `Promise<Boolean>` that indicates if the Marker.io extension has been detected. Having the extension installed allows more accurate screen captures and provides more capture options.

<details>
  <summary>Example</summary>

```javascript
widget.isExtensionInstalled().then((installed) => {
  if (installed) {
    // ...
  } else {
    // show install Marker.io extension button
  }
});
```

</details>

### `widget.setReporter(reporterInfo)`

Sets the current reporter information given a `reporterInfo` object:

- `reporterInfo.email`: the email address of the reporter
- `reporterInfo.fullName`: the full name of the reporter

<details>
  <summary>Example</summary>

```javascript
widget.setReporter({
  email: 'client@website.com',
  fullName: 'Gabrielle Rose',
});
```

</details>

### `widget.unload()`

Unloads and cleans up Marker.io SDK and all used resources.

## 🚨 Events

Marker.io exposes a variety of events that can be listened to using the methods described below.

**Usage:**

```javascript
widget.on('eventName', function listener() {
  // event handler code
});
```

### `'load'`

Triggers once Marker.io is loaded.

### `'loaderror'`

Triggers if an error occurs while loading Marker.io.

### `'beforeunload'`

Triggers right before Marker.io unloads.

### `'show'`

Triggers when the feedback button becomes visible.

### `'hide'`

Triggers when the feedback button becomes hidden.

### `'capture'`

Triggers when a feedback is captured.

### `'feedbackbeforesend'`

Triggers before submitting the feedback, i.e. when the user clicks Submit feedback.

### `'feedbacksent'`

Triggers once the feedback is successfully submitted.

### `'feedbackerror'`

Triggers if an error occurs while submitting feedback.

### `'feedbackdiscarded'`

Triggers when the user discards a feedback by clicking on the "Close" button in the widget.

## 🙋‍♂️ Identify reporters

Whenever your application knows about your reporters' identity, you should provide that information through the Marker.io snippet code.

### Why?

The reporting experience will be much better for your guests as they will not be prompted to provide their contact information while reporting their issues.

### Method 1: passing reporter info while loading your widget

Identifying your reporters is dead-simple: all you need to do is to provide their reporter information in the configuration object of your snippet code.

```javascript
const widget = await markerSDK.loadWidget({
  destination: '<DESTINATION ID>',

  reporter: {
    email: 'john@clientwebsite.com',
    fullName: 'John Smith',
  },
});
```

### Method 2: set reporter info using `widget.setReporter()`

```javascript
widget.setReporter({
  email: 'john@clientwebsite.com',
  fullName: 'John Smith',
});
```

## ⚙️ Custom metadata

While Marker.io automatically captures various metadata about the issue (page URL, browser context, console logs, …), it is also possible to pass **custom metadata** to your issues using the SDK.

For example, this can be useful to help developers debug issues by **adding more details** about the current state of the application.

**Supported types** of custom metadata:

- number
- boolean
- strings
- arrays
- objects

### Method 1: passing custom metadata while loading your widget

```javascript
const widget = await markerSDK.loadWidget({
  destination: '<DESTINATION ID>',

  customData: {
    storeId: 123,
    storeName: 'Organic Fruits',
  },
});
```

### Method 2: set custom metadata using `widget.setCustomData()`

```javascript
widget.setCustomData({
  product: 'Orange Juice',
  price: 3.99,
  stock: 130,
});
```

## 👻 Enabling Marker.io silent mode

By default, Marker.io will log some useful information in the console to help you identify configuration problems and better understand how it functions.

However, in certain situations you may want to disable them all together so that it doesn't add noise to your recorded console logs.

To do so, you will need to enable silent mode directly inside your **snippet code configuration**:

```javascript
const widget = await markerSDK.loadWidget({
  destination: '<DESTINATION ID>',

  silent: true, // <~ Enable silent mode
});
```

## 🕒 Delayed capture using server-side capture

Delay the server-side capture so that your CSS animations can run before the screenshot is taken.

You can enable delayed capture adding a special parameter in your snippet code configuration:

```javascript
const widget = await markerSDK.loadWidget({
  destination: '<DESTINATION ID>',

  // Add the following to delay the server-side rendering
  ssr: {
    renderDelay: 3000, // 0 - 15000 (ms)
  },
});
```

## ⌨️ Disabling keyboard shortcuts

In some particular cases, our keyboard shortcuts may conflict with your web app, you can easily disable all our shortcuts by passing a specific property in the JavaScript snippet configuration:

```javascript
const widget = await markerSDK.loadWidget({
  destination: '<DESTINATION ID>',

  // Toggles off all keyboard shortcuts
  keyboardShortcuts: false,
});
```

## Support

Need help integrating Marker.io with your web app? Feel free to contact us via your Marker.io account.

For every bugs, improvements or feature requests related to this SDK, please report a [GitHub issue](https://github.com/marker-io/browser/issues/new).

## License

Released under the [MIT license](LICENSE.md).
