import React from "react";
import Brand from "./Brand";
import { CTAButtons } from "./Hero";
export function BodyInput() {
  return (
    <section className="body-section section" id="overview">
      <div>
        <div className="eyebrow">BEYOND THE KEYBOARD</div>
        <h2>Your body is an input.</h2>
        <p>
          Software understands clicks, taps, keyboards and controllers.
          NerveNewt lets it understand physiological signals too.
        </p>
      </div>
      <div
        className="body-diagram"
        aria-label="Human to EEG, ECG and PPG to NerveNewt to any application"
      >
        <span className="human-icon" aria-hidden="true">
          ◎
        </span>
        <span>Human</span>
        <i>↓</i>
        <span className="mono muted">EEG · ECG · PPG</span>
        <i>↓</i>
        <Brand />
        <i>↓</i>
        <span>
          Any Application <span className="orange">↗</span>
        </span>
      </div>
    </section>
  );
}
export function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="eyebrow">THREE STEPS. ENDLESS POSSIBILITIES.</div>
      <h2>From signal to behavior in minutes.</h2>
      <div className="steps">
        {[
          ["01", "Connect", "Connect a supported biosensor."],
          [
            "02",
            "Define",
            "Choose the physiological event your application should understand.",
          ],
          ["03", "Build", "Connect it to application behavior."],
        ].map(([n, title, body]) => (
          <div key={n}>
            <span className="step-number">{n}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
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
