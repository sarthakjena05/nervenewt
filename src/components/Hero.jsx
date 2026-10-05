import React from "react";
export function CTAButtons({ onConnect }) {
  return (
    <div className="cta-buttons">
      <a className="button primary" href="#playground">
        Try the demo <span aria-hidden="true">↗</span>
      </a>
      <button className="button secondary" onClick={onConnect}>
        Connect a Device <span aria-hidden="true">＋</span>
      </button>
    </div>
  );
}
export default function Hero({ onConnect }) {
  return (
    <section className="hero" id="top">
      <div className="eyebrow">
        <span className="orange-dot" />
        Biosignals for everyone · Prototyping on Muse 2
      </div>
      <h1>
        Live signals.
        <br className="desktop-break" /> <span>Real app actions.</span>
      </h1>
      <p>
        Turn live EEG into blinks and closed-eye events your app can act on as
        signals arrive. We’re building a shared event interface across neurotech
        devices, starting with Muse 2.
      </p>
      <div className="hero-note">
        Connect Muse 2 to try blinks and closed eyes. Focus, Calm, and heartbeat events are
        planned.
      </div>
      <CTAButtons onConnect={onConnect} />
      <div className="hero-note">
        No signup. No headset needed.{" "}
        <a href="/docs/">Read the quick start →</a>
      </div>
      <div className="hero-note">
        You don’t need a neuroscience degree to build apps powered by your body.
      </div>
    </section>
  );
}
