<div align="center">
  <a href="https://marker.io" target="_blank"><img width="300" height="60" src="./marker.io-logo.svg" /></a>

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
    <a href="https://www.marker.io/">Website</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://help.marker.io/en/collections/2533894-widget">Docs</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://marker.io/blog">Blog</a>
  </h3>
</div>

<hr>

## Table of Contents

- [Examples](#examples)
- [Features](#features)
- [Installation](#installation)
- [API docs](#api)
- [Events](#events)
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
- Inject custom metadata in issues _(Coming soon)_

## Installation

1. First install the package from npm:

`npm install -s @marker.io/browser`

2. Setup the SDK in your code:

```javascript
import markerSDK from '@marker.io/browser';

const widget = await markerSDK.loadWidget({ destination: 'abcd1234567890' });
```

## API

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

## Events

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
  destination: "<DESTINATION ID>",

  reporter: {
    email: 'john@clientwebsite.com',
    fullName: 'John Smith',
  },
});
```

### Method 2: set reporter info using `widget.setReporter()`

```javascript
widget.setReporter({
  reporter: {
    email: 'john@clientwebsite.com',
    fullName: 'John Smith',
  },
});
```

## Support

Need help integrating Marker.io with your web app? Feel free to contact us via your Marker.io account.

For every bugs, improvements or feature requests related to this SDK, please report a [GitHub issue](https://github.com/marker-io/browser/issues/new).

## License

Released under the [MIT license](LICENSE.md).
