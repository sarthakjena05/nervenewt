import { useEffect, useRef, useState } from "react";
import { ACTIONS } from "./registry";
import { unlockAudio, playTone } from "./audio";

export default function useWorkflow(provider) {
  const [frame, setFrame] = useState({
    alpha: 0.32,
    samples: Array(100).fill(0),
    channels: Array.from({ length: 4 }, () => []),
    timestamp: 0,
  });
  const [detected, setDetected] = useState(false);
  const [actionActive, setActionActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [action, setAction] = useState(ACTIONS[0]);
  const [event, setEvent] = useState(null);
  const [sequence, setSequence] = useState(0);
  const [entries, setEntries] = useState([]);
  const actionRef = useRef(ACTIONS[0]);
  const pending = useRef(null);
  const nextId = useRef(0);

  useEffect(() => {
    setEntries([]);
    const log = (text) => {
      const entry = {
        id: ++nextId.current,
        text,
        time: new Date().toLocaleTimeString([], { hour12: false }),
      };
      setEntries((previous) => [...previous.slice(-5), entry]);
    };
    const unsubscribe = provider.subscribe((message) => {
      if (message.type === "frame")
        setFrame((previous) => ({
          alpha: message.alpha,
          samples: [...previous.samples.slice(1), message.sample],
          channels: previous.channels.map((channel, index) =>
            [...channel, ...(message.channels?.[index] ?? [])].slice(-768),
          ),
          timestamp: message.timestamp,
        }));
      if (message.type === "status")
        log(
          message.status === "connected"
            ? "Simulated EEG connected"
            : "Demo paused",
        );
      if (message.type === "event" && message.name === "eyes_open") {
        setDetected(false);
        setActionActive(false);
        log("Eyes open · back to baseline");
      }
      if (message.type === "event" && message.name === "eyes_closed") {
        setDetected(true);
        setActionActive(false);
        setSequence((previous) => previous + 1);
        log("Alpha increased · eyes_closed detected");
        const selected = actionRef.current;
        clearTimeout(pending.current);
        pending.current = setTimeout(() => {
          const soundPlayed = selected.id !== "play_sound" || playTone();
          setActionActive(true);
          setEvent({
            id: ++nextId.current,
            action: selected.id,
            name: selected.name,
          });
          log(
            soundPlayed
              ? `${selected.name} fired`
              : "Sound unavailable · visual feedback fired",
          );
        }, 350);
      }
    });
    provider.connect();
    return () => {
      clearTimeout(pending.current);
      unsubscribe();
      provider.disconnect();
    };
  }, [provider]);

  function selectAction(id) {
    const selected = ACTIONS.find((item) => item.id === id);
    if (!selected) return;
    actionRef.current = selected;
    setAction(selected);
    setActionActive(false);
    setEvent(null);
    if (id === "play_sound") unlockAudio();
  }
  function togglePause() {
    if (paused) provider.connect();
    else {
      clearTimeout(pending.current);
      provider.disconnect();
      setDetected(false);
      setActionActive(false);
      setFrame((previous) => ({ ...previous, alpha: 0.32 }));
    }
    setPaused((previous) => !previous);
  }
  return {
    frame,
    detected,
    actionActive,
    paused,
    action,
    event,
    sequence,
    entries,
    selectAction,
    togglePause,
  };
}
