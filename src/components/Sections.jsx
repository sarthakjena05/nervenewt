import React from "react";

import { CTAButtons } from "./Hero";
export function DeveloperPipeline() {
  const steps = [
    {
      title: "01 / Connect",
      body: "Pair your headset over Bluetooth in one click, or use our in-browser simulator if you don’t own hardware yet.",
    },
    {
      title: "02 / Pick a Signal",
      body: "Choose high-level events your app cares about: Focus, Calm, Blinks, or Closed Eyes. Zero signal processing required.",
    },
    {
      title: "03 / Hook Up Your App",
      body: "Feed the event into your game, web app, or vibe-coding prompt (Cursor / Replit) with just a couple of lines.",
    },
  ];
  return (
    <section
      className="developer-pipeline section"
      id="how-it-works"
      aria-labelledby="pipeline-title"
    >
      <header className="pipeline-heading">
        <div className="eyebrow">HOW IT WORKS</div>
        <h2 id="pipeline-title">
          Connect. Pick a signal. Make something happen.
        </h2>
        <p>
          Start with a headset or the simulator. Bring your idea; we’ll handle
          the signals.
        </p>
      </header>
      <div className="pipeline-grid">
        {steps.map((step) => (
          <article className="pipeline-card" key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
      <p className="pipeline-note">
        Blinks and Closed Eyes work in the demo. Focus, Calm, and app
        integrations are the direction we’re building toward.
      </p>
    </section>
  );
}
export function Examples() {
  return (
    <section className="examples section">
      <div className="eyebrow">SMALL SIGNALS. NEW POSSIBILITIES.</div>
      <div className="example-list">
        {[
          ["Blink", "Shoot"],
          ["Focus", "Accelerate"],
          ["Heart Rate ↑", "Music changes"],
          ["Eyes Closed", "Jump"],
          ["Fatigue", "Interface adapts"],
        ].map(([input, action]) => (
          <div key={input}>
            <span>{input}</span>
            <span className="orange">→</span>
            <strong>{action}</strong>
          </div>
        ))}
      </div>
      <p className="small muted">
        Ideas to build toward. Try Eyes Closed in the simulator above.
      </p>
    </section>
  );
}
export function DeveloperSection() {
  return (
    <section className="developer-section section" id="developers">
      <div>
        <div className="eyebrow">MADE FOR BUILDERS</div>
        <h2>
          Prototype visually.
          <br />
          Ship with code.
        </h2>
        <p>
          Start with an interaction. Build toward an event your application can
          understand.
        </p>
        <span className="small muted">API concept · SDK in development</span>
      </div>
      <div className="code-window">
        <div className="code-title">
          <span>your-app.js</span>
          <span>JAVASCRIPT</span>
        </div>
        <pre>
          <code>
            <span className="code-muted">
              // Your next input isn't a button.
            </span>
            {"\n"}nervenewt.<span className="code-orange">on</span>(
            <span className="code-green">"eyes_closed"</span>,{"\n"} (
            {"{ confidence }"}) =&gt; {"{"}
            {"\n"} player.<span className="code-orange">jump</span>();{"\n"}{" "}
            {"}"}
            {"\n"});
          </code>
        </pre>
        <div className="code-foot">
          One event. Your application’s next move.
        </div>
      </div>
    </section>
  );
}
export function Integrations() {
  return (
    <section className="integrations section">
      <div>
        <div className="eyebrow">AN OPEN-ENDED ECOSYSTEM</div>
        <h2>Built toward your stack.</h2>
      </div>
      <div className="platform-list">
        {["Web", "Python", "Unity", "iOS", "Unreal"].map((name) => (
          <span key={name}>
            {name}
            <small>{name === "Web" ? "Browser demo" : "Planned"}</small>
          </span>
        ))}
      </div>
    </section>
  );
}
export function Validation() {
  return (
    <section className="validation section" aria-label="Early validation">
      {[
        ["40+", "Industry Conversations"],
        ["4", "Academic Lab Relationships"],
        ["5", "Signed Integration LOIs"],
      ].map(([n, label]) => (
        <div key={label}>
          <strong>{n}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
export function FinalCTA({ onConnect }) {
  return (
    <section className="final-cta section">
      <div className="eyebrow">LET’S BUILD SOMETHING HUMAN</div>
      <h2>
        What would you build if <br />
        software could understand you?
      </h2>
      <CTAButtons onConnect={onConnect} />
    </section>
  );
}
export function HardwareRoadmap() {
  return (
    <section
      className="hardware-roadmap section"
      aria-labelledby="roadmap-title"
    >
      <header className="pipeline-heading">
        <div className="eyebrow">EEG IS THE STARTING POINT</div>
        <h2 id="roadmap-title">Built toward the next wearable inputs.</h2>
        <p>
          The expansion path moves from consumer EEG into gesture control for XR
          and smart glasses, then continuous autonomic telemetry from everyday
          wearables.
        </p>
      </header>
      <div className="roadmap-grid">
        {[
          [
            "EEG",
            "Available in this demo",
            "Muse 2 signals → browser interactions. A concrete starting point for the event interface.",
          ],
          [
            "EMG",
            "Planned",
            "Muscle activity → gesture events for XR, smart glasses, and hands-free interaction.",
          ],
          [
            "ECG / PPG",
            "Planned",
            "Cardiac and optical signals → heart and recovery signals for apps that respond to you.",
          ],
        ].map(([name, status, body]) => (
          <article key={name}>
            <span className="roadmap-status">{status}</span>
            <h3>{name}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <p className="roadmap-note">
        EMG and ECG/PPG integrations are in the roadmap; device coverage and
        release dates are not yet committed.
      </p>
    </section>
  );
}
