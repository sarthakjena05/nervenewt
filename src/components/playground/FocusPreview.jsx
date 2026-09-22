import React from "react";
export default function FocusPreview({ alpha, live, paused }) {
  const active = alpha > 0.45;
  return (
    <section
      className={`focus-preview ${active ? "focus-active" : ""}`}
      aria-label="Adaptive reading interface prototype"
    >
      <div className="focus-heading">
        <span>ACCESSIBILITY PROTOTYPE</span>
        <span>{live ? "Live EEG" : "Simulated EEG"}</span>
      </div>
      <div className="focus-state">
        <h3>Adaptive reading mode</h3>
        <span>
          {paused ? "Paused" : active ? "Quiet view" : "Standard view"}
        </span>
      </div>
      <div className="focus-document">
        <div className="focus-context">Workspace / Reading</div>
        <h4>Make room for the next idea.</h4>
        <p>
          A signal can change how an interface responds. This prototype reduces
          secondary information when relative alpha rises.
        </p>
        <div className="focus-secondary" aria-hidden={active}>
          <span>Related notes</span>
          <span>Activity</span>
          <span>Suggestions</span>
        </div>
      </div>
      <div className="focus-metric">
        <span>
          Relative alpha <strong>{Math.round(alpha * 100)}%</strong>
        </span>
        <code>ui.setFocusState(alpha &gt; 0.45)</code>
      </div>
      <p className="focus-note">
        Interface behavior demo. Alpha power is not a measurement of attention
        or accessibility benefit.
      </p>
    </section>
  );
}
