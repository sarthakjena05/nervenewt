import React from "react";
export default function Brand({ compact = false }) {
  return (
    <span className="brand">
      <img
        src="/nervenewt-icon.png"
        alt={compact ? "NerveNewt" : ""}
        width="36"
        height="36"
      />
      {!compact && <span>NerveNewt</span>}
    </span>
  );
}
