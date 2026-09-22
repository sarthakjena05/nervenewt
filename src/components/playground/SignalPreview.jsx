import React, { useEffect, useRef } from "react";
const CHANNELS = ["TP9", "AF7", "AF8", "TP10"];
const COLORS = ["#5f99a2", "#ad87bb", "#d7a05b", "#79a484"];
export default function SignalPreview({
  channels,
  timestamp,
  alpha,
  detected,
  paused,
  live = false,
  drop = 0,
}) {
  const canvas = useRef(null);
  useEffect(() => {
    const element = canvas.current,
      ctx = element.getContext("2d");
    if (!ctx) return;
    const width = 600,
      height = 176,
      scale = window.devicePixelRatio || 1;
    element.width = width * scale;
    element.height = height * scale;
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, width, height);
    CHANNELS.forEach((label, index) => {
      const center = index * 44 + 22;
      ctx.fillStyle = COLORS[index];
      ctx.font = "11px monospace";
      ctx.fillText(label, 0, center + 4);
      ctx.strokeStyle = "#e3e9e4";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(42, center);
      ctx.lineTo(width, center);
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.rect(42, index * 44, width - 42, 44);
      ctx.clip();
      ctx.strokeStyle = COLORS[index];
      ctx.lineWidth = 1;
      ctx.beginPath();
      const samples = channels[index],
        size = live ? 256 : 768,
        gain = live ? 0.14 : 0.72;
      samples.forEach((value, i) => {
        const x =
            42 + ((size - samples.length + i) * (width - 42)) / (size - 1),
          y = center - value * gain;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    });
  }, [channels, live]);
  const seconds = Math.floor(timestamp),
    clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return (
    <div className="eeg-monitor">
      <div className="eeg-header">
        <div>
          <strong>Muse 2</strong>
          <span className="eeg-source">
            ({live ? "Live Web Bluetooth" : "Simulated stream"})
          </span>
        </div>
        <span className={`eeg-live ${paused ? "is-paused" : ""}`}>
          <i />
          {paused ? "PAUSED" : live ? "LIVE" : "LIVE DEMO"}
          <time>{clock}</time>
        </span>
      </div>
      <canvas
        ref={canvas}
        className="eeg-canvas"
        role="img"
        aria-label={`Four ${live ? "live" : "simulated"} EEG channels: TP9, AF7, AF8 and TP10`}
      />
      <div className="eeg-axis">
        <span>{live ? "−1 s" : "−3 s"}</span>
        <span>{live ? "−0.5 s" : "−1.5 s"}</span>
        <span>now</span>
      </div>
      <div className="eeg-footer">
        <span>
          {live
            ? `TP9, AF7, AF8, TP10 · 256 Hz · ${drop} drop`
            : "4 channels · 256 Hz"}
        </span>
        <span className={detected ? "eeg-detected" : ""}>
          {detected
            ? "Signal → action"
            : live
              ? "µV · live EEG"
              : "synthetic µV"}
        </span>
      </div>
      <div
        className="eeg-alpha"
        aria-label={`${live ? "Live" : "Simulated"} relative alpha power ${Math.round(alpha * 100)} percent`}
      >
        <i style={{ width: `${alpha * 100}%` }} />
      </div>
    </div>
  );
}
