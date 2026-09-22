import React from "react";
import EarlyAccess from "./EarlyAccess";
import BuilderExample from "./BuilderExample";
export function CTAButtons({ onConnect }) {
  return (
    <div className="cta-buttons">
      <a className="button primary" href="#playground">
        Open Playground <span aria-hidden="true">↗</span>
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
        Add biological inputs
        <br className="desktop-break" /> to your app <span>in minutes.</span>
      </h1>
      <p>
        Building a meditation app, focus tool, or game? NerveNewt handles the
        messy hardware and signal math so you can trigger real actions from
        blinks, focus, and heartbeats.
      </p>
      <div className="hero-note">
        Try blinks and closed eyes today. Focus, Calm, and heartbeat events are
        planned.
      </div>
      <EarlyAccess />
      <BuilderExample />
      <div className="hero-note">
        You don’t need a neuroscience degree to build apps powered by your body.
      </div>
      <CTAButtons onConnect={onConnect} />
    </section>
  );
}
