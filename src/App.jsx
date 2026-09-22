import React, { useState, useRef, useEffect } from "react";
import Brand from "./components/Brand";
import Hero from "./components/Hero";
import DeveloperAccess from "./components/DeveloperAccess";
import FAQ from "./components/FAQ";
import {
  DeveloperPipeline,
  Examples,
  DeveloperSection,
  Integrations,
  Validation,
  HardwareRoadmap,
} from "./components/Sections";
import Playground from "./components/playground/Playground";
import DeviceModal from "./components/playground/DeviceModal";
import { SimulatorProvider } from "./providers/SimulatorProvider";
import { MuseProvider } from "./providers/MuseProvider";
import "./styles/site.css";
import "./styles/playground.css";

export default function App() {
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [provider, setProvider] = useState(
    () => new SimulatorProvider({ autoplay: true }),
  );
  const [session, setSession] = useState(0);
  const [pairing, setPairing] = useState(false);
  const [deviceMessage, setDeviceMessage] = useState("");
  const liveRef = useRef(null);
  const pairingRef = useRef(false);
  const useSimulator = () => {
    liveRef.current?.disconnect();
    liveRef.current = null;
    setProvider(new SimulatorProvider({ autoplay: true }));
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
            message.reason || "Muse 2 disconnected. Simulation is running.",
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
          ? "Pairing cancelled. Simulation is running."
          : error.message ||
              "Could not connect to Muse 2. Simulation is running.",
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
        <a href="#top" aria-label="NerveNewt home">
          <Brand />
        </a>
        <nav aria-label="Primary">
          <a href="#playground">Playground</a>
          <a href="#how-it-works">How it works</a>
          <a href="#developers">Developers</a>
        </nav>
        <a className="contact-link" href="#developer-access">
          Developer access <span>↗</span>
        </a>
      </header>
      <main className="container">
        <Hero onConnect={openDevices} />
        <Playground
          key={session}
          provider={provider}
          onConnect={openDevices}
          pairing={pairing}
          onDisconnect={useSimulator}
        />
        <DeveloperPipeline />
        <Examples />
        <DeveloperSection />
        <HardwareRoadmap />
        <Integrations />
        <Validation />
        <FAQ />
        <DeveloperAccess />
      </main>
      <footer className="site-footer container">
        <a href="#top" aria-label="NerveNewt home">
          <Brand />
        </a>
        <span>Building the interface between biology and software.</span>
        <a href="#developer-access">Developer access ↗</a>
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
