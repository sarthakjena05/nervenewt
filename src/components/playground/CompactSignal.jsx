import React, { useEffect, useRef } from "react";
export default function CompactSignal({ samples, live, paused, triggered }) {
  const canvas = useRef(null);
  const range = Math.max(75, Math.ceil(Math.max(0, ...samples.map(Math.abs)) / 25) * 25);
  useEffect(() => {
    const element = canvas.current, ctx = element.getContext('2d');
    if (!ctx) return;
    const width = 600, height = 70, scale = window.devicePixelRatio || 1;
    element.width = width * scale;
    element.height = height * scale;
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = triggered ? '#c37547' : '#829783';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const size = live ? 256 : 480;
    samples.forEach((value, i) => {
      const x = (size - samples.length + i) * width / (size - 1);
      const y = 35 - value * 30 / range;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [samples, live, triggered, range]);
  return <div className="compact-signal">
    <div><span>{live ? 'Live EEG · AF7 · 256 Hz' : 'Recorded EEG · AF7 · 160 Hz'}</span><span>{paused ? 'Paused' : triggered ? 'Signal detected' : live ? 'Listening' : 'Playback'}</span></div>
    <canvas ref={canvas} role="img" aria-label={`${live ? 'Live' : 'Recorded'} AF7 EEG waveform in microvolts`} />
    <div><span>{live ? '1 second' : '3 seconds'} · ±{range} µV</span>{!live && <a href="https://physionet.org/content/eegmmidb/1.0.0/" target="_blank" rel="noreferrer">Recording: PhysioNet / Schalk ↗</a>}</div>
  </div>;
}
