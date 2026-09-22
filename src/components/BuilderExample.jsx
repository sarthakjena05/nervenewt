import React, { useState, useRef } from "react";
const prompt =
  "Connect to the NerveNewt stream at localhost:8080 and change the background color to green whenever 'calm' is triggered.";
const code =
  'stream.on("alpha_power", ({ power }) => updateFocusUI(power));\nstream.on("blink", () => triggerAction());';
export default function BuilderExample() {
  const [tab, setTab] = useState(0);
  const buttons = useRef([]);
  return (
    <figure className="hero-code builder-example">
      <div
        className="builder-tabs"
        role="tablist"
        aria-label="Ways to build"
        onKeyDown={(event) => {
          let next;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft")
            next = 1 - tab;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = 1;
          else return;
          event.preventDefault();
          setTab(next);
          buttons.current[next].focus();
        }}
      >
        {["Prompt for AI Builders (Cursor / Replit)", "Simple Code"].map(
          (label, index) => (
            <button
              ref={(element) => (buttons.current[index] = element)}
              key={label}
              id={`builder-tab-${index}`}
              role="tab"
              type="button"
              aria-selected={tab === index}
              aria-controls={`builder-panel-${index}`}
              tabIndex={tab === index ? 0 : -1}
              onClick={() => setTab(index)}
            >
              {label}
            </button>
          ),
        )}
      </div>
      <div
        id={`builder-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`builder-tab-${tab}`}
        tabIndex={0}
      >
        {tab === 0 ? (
          <p className="builder-prompt">{prompt}</p>
        ) : (
          <pre>
            <code>{code}</code>
          </pre>
        )}
      </div>
      <figcaption>
        Integration concept · Local stream and Calm events are planned.
      </figcaption>
    </figure>
  );
}
