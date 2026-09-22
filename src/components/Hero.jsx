import React from "react";
const sdkExample = `import { NerveNewt } from "@nervenewt/sdk";

const stream = new NerveNewt({ device: "auto" });

// Subscribe to normalized cross-hardware events
stream.on("blink", ({ confidence }) => triggerUI());
stream.on("alpha_power", ({ power }) => updateFocus(power));`;
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
      <figure className="hero-code">
        <figcaption>
          <span>Quick start</span>
          <span>TypeScript</span>
        </figcaption>
        <pre tabIndex={0} aria-label="NerveNewt SDK usage example">
          <code>{sdkExample}</code>
        </pre>
      </figure>
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
