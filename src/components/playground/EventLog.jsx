import React from "react";
export default function EventLog({ entries }) {
  return (
    <div className="event-log">
      <span className="log-label">EVENT STREAM</span>
      <div role="log" aria-live="polite" aria-relevant="additions">
        {entries.slice(-3).map((entry) => (
          <span key={entry.id}>
            <span className="log-time">{entry.time}</span> {entry.text}
          </span>
        ))}
      </div>
    </div>
  );
}
