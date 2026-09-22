import React from "react";
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
        <span className="orange-dot" /> DEVELOPER INFRASTRUCTURE FOR BIOSIGNALS
      </div>
      <h1>
        Build software that
        <br />
        responds to <span>you.</span>
      </h1>
      <p>
        Connect a biosensor. Define what you want to detect.{" "}
        <br className="desktop-break" /> Connect it to an action.
      </p>
      <CTAButtons onConnect={onConnect} />
      <div className="hero-note">
        A new kind of input. A familiar way to build.
      </div>
    </section>
  );
}
