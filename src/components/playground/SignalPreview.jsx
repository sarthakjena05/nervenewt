import React from "react";
const CHANNELS = ["TP9", "AF7", "AF8", "TP10"];
const COLORS = ["#5f99a2", "#ad87bb", "#d7a05b", "#79a484"];
export default function SignalPreview({
  channels,
  timestamp,
  alpha,
  detected,
  paused,
}) {
  const seconds = Math.floor(timestamp);
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return (
    <div className="eeg-monitor">
      <div className="eeg-header">
        <div>
          <strong>Muse 2</strong>
          <span className="eeg-source">Simulated stream</span>
        </div>
        <span className={`eeg-live ${paused ? "is-paused" : ""}`}>
          <i />
          {paused ? "PAUSED" : "LIVE DEMO"}
          <time>{clock}</time>
        </span>
      </div>
      <div
        className="eeg-traces"
        role="img"
        aria-label="Four scrolling simulated EEG channels: TP9, AF7, AF8 and TP10"
      >
        {CHANNELS.map((name, index) => {
          const samples = channels[index];
          const points = samples
            .map(
              (value, i) =>
                `${((768 - samples.length + i) * 480) / 767},${22 - value * 0.72}`,
            )
            .join(" ");
          return (
            <div
              className="eeg-channel"
              key={name}
              style={{ color: COLORS[index] }}
            >
              <span>{name}</span>
              <svg
                viewBox="0 0 480 44"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 22H480 M160 0V44 M320 0V44"
                  stroke="#e9edea"
                  strokeWidth="0.6"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                {samples.length > 0 && (
                  <circle
                    cx="480"
                    cy={22 - samples[samples.length - 1] * 0.72}
                    r="2"
                    fill="currentColor"
                  />
                )}
              </svg>
            </div>
          );
        })}
      </div>
      <div className="eeg-axis">
        <span>−3 s</span>
        <span>−2 s</span>
        <span>−1 s</span>
        <span>now</span>
      </div>
      <div className="eeg-footer">
        <span>4 channels · 256 Hz · synthetic µV</span>
        <span className={detected ? "eeg-detected" : ""}>
          {detected ? "Alpha burst → action" : "Streaming EEG"}
        </span>
      </div>
      <div
        className="eeg-alpha"
        aria-label={`Simulated alpha activity ${Math.round(alpha * 100)} percent`}
      >
        <i style={{ width: `${alpha * 100}%` }} />
      </div>
    </div>
  );
}
