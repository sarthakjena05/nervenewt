import React, { useState, useRef, useEffect } from "react";
import Brand from "./components/Brand";
import Playground from "./components/playground/Playground";
import DeviceModal from "./components/playground/DeviceModal";
import { RecordingProvider } from "./providers/RecordingProvider";
import { MuseProvider } from "./providers/MuseProvider";

/** The original EEG playground (recorded playback + Web Bluetooth Muse 2), kept at /demo/. */
export default function DemoPage() {
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [provider, setProvider] = useState(
    () => new RecordingProvider(),
  );
  const [session, setSession] = useState(0);
  const [pairing, setPairing] = useState(false);
  const [deviceMessage, setDeviceMessage] = useState("");
  const liveRef = useRef(null);
  const pairingRef = useRef(false);
  const useSimulator = () => {
    liveRef.current?.disconnect();
    liveRef.current = null;
    setProvider(new RecordingProvider());
    setSession((previous) => previous + 1);
  };
  useEffect(() => () => liveRef.current?.disconnect(), []);
  const openDevices = async () => {
    if (pairingRef.current || liveRef.current?.connected) return;
    pairingRef.current = true;
    setPairing(true);
    const live = new MuseProvider();
    liveRef.current = live;
    try {
      await live.connect();
      live.subscribe((message) => {
        if (
          message.type === "status" &&
          message.status === "disconnected" &&
          liveRef.current === live
        ) {
          useSimulator();
          setDeviceMessage(
            message.reason || "Muse 2 disconnected. Recorded EEG playback is running.",
          );
          setDeviceOpen(true);
        }
      });
      setProvider(live);
      setSession((previous) => previous + 1);
    } catch (error) {
      useSimulator();
      setDeviceMessage(
        error.name === "NotFoundError"
          ? "Pairing cancelled. Recorded EEG playback is running."
          : error.message ||
              "Could not connect to Muse 2. Recorded EEG playback is running.",
      );
      setDeviceOpen(true);
    } finally {
      pairingRef.current = false;
      setPairing(false);
    }
  };
  return (
    <>
      <a className="skip-link" href="#playground">
        Skip to playground
      </a>
      <header className="site-header container">
        <a href="/" aria-label="NerveNewt home">
          <Brand />
        </a>
        <nav aria-label="Primary">
          <a href="/">Home</a>
          <a href="https://docs.nervenewt.com">Docs</a>
        </nav>
        <a className="contact-link" href="/#early-access">
          Early access <span>↗</span>
        </a>
      </header>
      <main className="container">
        <Playground
          key={session}
          provider={provider}
          onConnect={openDevices}
          pairing={pairing}
          onDisconnect={useSimulator}
        />
      </main>
      <footer className="site-footer container">
        <a href="/" aria-label="NerveNewt home">
          <Brand />
        </a>
        <span>Building the interface between biology and software.</span>
        <a href="/#early-access">Early access ↗</a>
        <small>© 2026 NerveNewt</small>
      </footer>
      <DeviceModal
        open={deviceOpen}
        onClose={() => setDeviceOpen(false)}
        message={deviceMessage}
        onSimulator={useSimulator}
      />
    </>
  );
}
