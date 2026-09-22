import React, { useState } from "react";
import Brand from "./components/Brand";
import Hero from "./components/Hero";
import FAQ from "./components/FAQ";
import {
  DeveloperPipeline,
  Examples,
  DeveloperSection,
  Integrations,
  Validation,
  FinalCTA,
} from "./components/Sections";
import Playground from "./components/playground/Playground";
import DeviceModal from "./components/playground/DeviceModal";
import { SimulatorProvider } from "./providers/SimulatorProvider";
import "./styles/site.css";
import "./styles/playground.css";

export default function App() {
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [provider, setProvider] = useState(
    () => new SimulatorProvider({ autoplay: true }),
  );
  const [session, setSession] = useState(0);
  const openDevices = () => setDeviceOpen(true);
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
        <a className="contact-link" href="mailto:founders@nervenewt.com">
          Let’s talk <span>↗</span>
        </a>
      </header>
      <main className="container">
        <Hero onConnect={openDevices} />
        <Playground key={session} provider={provider} onConnect={openDevices} />
        <DeveloperPipeline />
        <Examples />
        <DeveloperSection />
        <Integrations />
        <Validation />
        <FAQ />
        <FinalCTA onConnect={openDevices} />
      </main>
      <footer className="site-footer container">
        <a href="#top" aria-label="NerveNewt home">
          <Brand />
        </a>
        <span>Building the interface between biology and software.</span>
        <a href="mailto:founders@nervenewt.com">Get in touch ↗</a>
        <small>© 2026 NerveNewt</small>
      </footer>
      <DeviceModal
        open={deviceOpen}
        onClose={() => setDeviceOpen(false)}
        onSimulator={() => {
          setProvider(new SimulatorProvider({ autoplay: true }));
          setSession((previous) => previous + 1);
          window.location.hash = "playground";
        }}
      />
    </>
  );
}
