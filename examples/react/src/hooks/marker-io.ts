import markerSDK, {
  type MarkerReporter,
  type MarkerSdk,
} from '@marker.io/browser';
import { useMemo, useState } from 'react';

export const useMarkerIo = () => {
  const [widget, setWidget] = useState<MarkerSdk | null>(null);
  const [eventLog, setEventLog] = useState('');
  const [projectId, setProjectId] = useState<string>(
    import.meta.env.VITE_MARKER_IO_PROJECT_ID as string
  );

  const [customDataObject, setCustomDataObject] = useState<
    Record<string, string>
  >({
    product: 'Marker.io',
    available: 'true',
  });
  const [customDataInvalid, setCustomDataInvalid] = useState(false);
  const [customDataRaw, setCustomDataRaw] = useState('');

  async function loadMarkerSDK() {
    const widget = await markerSDK.loadWidget({
      project: projectId,
    });
    setWidget(widget);

    const MarkerEventNames = [
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
    ] as const;

    type MarkerEventName = (typeof MarkerEventNames)[number];

    const events: MarkerEventName[] = [...MarkerEventNames];

    for (const eventName of events) {
      widget.on(eventName, () => {
        setEventLog((prev) => prev + `Event "${eventName}"\n`);
      });
    }
  }

  function unloadMarkerSDK() {
    widget?.unload();
    setWidget(null);
  }

  function updateReporterInfo(reporter: MarkerReporter) {
    widget?.setReporter(reporter);
  }

  function updateCustomData() {
    try {
      setCustomDataObject(JSON.parse(customDataRaw) as Record<string, string>);
      setCustomDataInvalid(false);
    } catch {
      setCustomDataInvalid(true);
    }
    widget?.setCustomData(customDataObject);
  }

  const loaded = useMemo(() => !!widget, [widget]);

  return {
    loadMarkerSDK,
    unloadMarkerSDK,
    updateReporterInfo,
    updateCustomData,
    setProjectId,
    projectId,
    eventLog,
    setCustomDataRaw,
    customDataInvalid,
    customDataRaw,
    loaded,
    widget,
  };
};
