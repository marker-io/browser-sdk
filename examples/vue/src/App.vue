<template>
  <div id="app">
    <p>
      <img alt="Vue logo" src="./assets/logo.png" />
    </p>

    <strong>SDK demo for Vue.js</strong>

    <div class="row">
      <input type="text" placeholder="Destination ID" v-model="destinationId" />
      <button @click="loadMarkerSDK">Load SDK</button>
    </div>

    <div class="actions" v-if="loaded">
      <div class="panel">
        <button @click="widget.show">widget.show()</button>
        <button @click="widget.hide">widget.hide()</button>
        <button @click="() => widget.capture()">widget.capture()</button>
        <button @click="unloadMarkerSDK">widget.unload()</button>
      </div>

      <form class="form panel" @submit.prevent="updateReporterInfo">
        <label for="reporter-email">Email</label>
        <input id="reporter-email" type="email" required v-model="reporterInfo.email" />

        <label for="reporter-fullname">Full name</label>
        <input id="reporter-fullname" type="text" v-model="reporterInfo.fullName" />

        <button type="submit">widget.setReporter</button>
      </form>

      <form class="form panel" @submit.prevent="updateCustomData">
        <textarea class="code" v-model="customDataRaw" placeholder="Paste JSON"></textarea>

        <button type="submit">widget.setCustomData</button>

        <div class="error" v-if="customDataInvalid">
          Invalid JSON format
        </div>
      </form>

      <div class="form panel">
        <label for="event-log">Event log</label>
        <textarea id="event-log" readonly v-model="eventLog" class="event-log"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import markerSDK from '@marker.io/browser';

export default {
  name: 'App',

  data() {
    return {
      widget: null,

      // You can find your destination ID in your Marker.io account.
      // Learn mode: https://github.com/marker-io/browser-sdk/tree/master/examples/vue#getting-your-destination-id
      destinationId: '',

      reporterInfo: {
        email: null,
        fullName: null,
      },

      eventLog: '',

      customDataRaw: '',
      customDataObject: {},
      customDataInvalid: false,
    };
  },

  methods: {
    async loadMarkerSDK() {
      // Load widget using the Marker.io SDK
      this.widget = await markerSDK.loadWidget({
        destination: this.destinationId,
      });

      const events = [
        'load',
        'loaderror',
        'beforeunload',
        'show',
        'hide',
        'capture',
        'feedbackbeforesend',
        'feedbacksent',
        'feedbackerror',
        'feedbackdiscarded',
      ];

      for (const eventName of events) {
        this.widget.on(eventName, () => {
          this.eventLog += `Event "${eventName}"\n`;
        });
      }
    },

    unloadMarkerSDK() {
      this.widget.unload();
      this.widget = null;
    },

    updateReporterInfo() {
      this.widget.setReporter(this.reporterInfo);
    },

    updateCustomData() {
      try {
        this.customDataObject = JSON.parse(this.customDataRaw);
        this.customDataInvalid = false;
      } catch {
        this.customDataInvalid = true;
      }

      this.widget.setCustomData(this.customDataObject);
    },
  },

  computed: {
    loaded() {
      return !!this.widget;
    },
  },
};
</script>

<style lang="scss">
body {
  background: #edf2ff;
}

#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  * {
    box-sizing: border-box;
  }

  > * + * {
    margin-top: 20px;
  }
}

.row {
  display: flex;
  flex-direction: row;

  input {
    flex-grow: 1;
    height: 20px;
  }

  > * + * {
    margin-left: 10px;
  }
}

.actions {
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: 10px;
  }
}

.panel {
  border-radius: 6px;
  box-shadow: 0 2px 8px -3px #0006;
  background: white;
  padding: 15px;
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: 10px;
  }
}

.form {
  text-align: left;
  margin-top: 20px;

  label {
    font-weight: 600;
    font-size: 14px;
  }

  label + input {
    margin-top: 2px;
  }

  input + label {
    margin-top: 10px;
  }

  input + button {
    margin-top: 20px;
  }
}

.event-log {
  height: 300px;
}

.code {
  font-family: monospace;
}

.error {
  color: #f03e3e;
}
</style>
