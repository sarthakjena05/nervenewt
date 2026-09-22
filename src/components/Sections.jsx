import React from "react";

import { CTAButtons } from "./Hero";
export function DeveloperPipeline() {
  const steps = [
    {
      title: "01 / Auto-Discovery",
      body: "Connect over Web Bluetooth or serial with zero config.",
      code: 'const stream = await NerveNewt.connect("muse-2");',
    },
    {
      title: "02 / Normalized Events",
      body: "Subscribe to clean, standardized physiological states.",
      code: 'stream.on("alpha_burst", ({ power }) => ...);',
    },
    {
      title: "03 / App Logic",
      body: "Drive UI, game mechanics, or adaptive audio with zero latency.",
      code: "ui.setFocusState(power > 0.7);",
    },
  ];
  return (
    <section
      className="developer-pipeline section"
      id="how-it-works"
      aria-labelledby="pipeline-title"
    >
      <header className="pipeline-heading">
        <div className="eyebrow">DEVELOPER PIPELINE</div>
        <h2 id="pipeline-title">
          From raw signal to application event in 3 lines.
        </h2>
        <p>
          Skip device-specific serial parsers and Bluetooth boilerplate.
          NerveNewt ingests messy telemetry and emits clean, typed events.
        </p>
      </header>
      <div className="pipeline-grid">
        {steps.map((step) => (
          <article className="pipeline-card" key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <pre>
              <code>{step.code}</code>
            </pre>
          </article>
        ))}
      </div>
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
