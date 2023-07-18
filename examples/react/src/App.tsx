import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useMarkerIo } from './hooks/maker-io';
import { useState } from 'react';

function App() {
  const [reporterInfo, setReporterInfo] = useState({
    email: '',
    fullName: '',
  });

  const {
    loadMarkerSDK,
    loaded,
    widget,
    unloadMarkerSDK,
    eventLog,
    setProjectId,
    projectId,
    updateCustomData,
    updateReporterInfo,
    customDataRaw,
    setCustomDataRaw,
    customDataInvalid,
  } = useMarkerIo();

  return (
    <>
      <div id="app">
        <div className="">
          <strong>Maker io SDK demo for React and Vite</strong>
          <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
        </div>

        <div className="col">
          <input
            type="text"
            style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <button onClick={() => void loadMarkerSDK()}>Load SDK</button>
        </div>

        {loaded && (
          <div className="actions">
            <div className="panel">
              <button onClick={() => widget?.show()}>widget.show()</button>
              <button onClick={() => widget?.hide()}>widget.hide()</button>
              <button onClick={() => void widget?.capture('fullscreen')}>
                widget.capture()
              </button>
              <button onClick={unloadMarkerSDK}>widget.unload()</button>
            </div>

            <form
              className="form panel"
              onSubmit={(e) => {
                e.preventDefault();

                updateReporterInfo({
                  email: reporterInfo.email,
                  fullName: reporterInfo.fullName,
                });
              }}
            >
              <label htmlFor="reporter-email">Email</label>
              <input
                id="reporter-email"
                type="email"
                required
                value={reporterInfo.email}
                onChange={(e) =>
                  setReporterInfo({ ...reporterInfo, email: e.target.value })
                }
              />

              <label htmlFor="reporter-fullname">Full name</label>
              <input
                id="reporter-fullname"
                type="text"
                value={reporterInfo.fullName}
                onChange={(e) =>
                  setReporterInfo({ ...reporterInfo, fullName: e.target.value })
                }
              />

              <button type="submit">widget.setReporter</button>
            </form>

            <form
              className="form panel"
              onSubmit={(e) => {
                e.preventDefault();
                updateCustomData();
              }}
            >
              <textarea
                className="code"
                value={customDataRaw}
                onChange={(e) => setCustomDataRaw(e.target.value)}
                placeholder="Paste JSON"
              ></textarea>

              <button type="submit">widget.setCustomData</button>

              {customDataInvalid && (
                <div className="error">Invalid JSON format</div>
              )}
            </form>

            <div className="form panel">
              <label htmlFor="event-log">Event log</label>
              <textarea
                id="event-log"
                readOnly
                value={eventLog}
                className="event-log"
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
