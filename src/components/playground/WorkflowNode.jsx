import React from "react";

export default function WorkflowNode({
  label,
  icon,
  title,
  subtitle,
  active,
  dropRef,
  dropOver,
}) {
  return (
    <div className="flow-column">
      <span className="flow-label">{label}</span>
      <div
        ref={dropRef}
        className={`flow-block ${active ? "is-active" : ""} ${dropOver ? "is-drop-target" : ""}`}
        aria-label={
          label === "DO"
            ? `DO block: ${title}. Drop an action here.`
            : undefined
        }
      >
        <span className="flow-icon" aria-hidden="true">
          {icon}
        </span>
        <h3>{title}</h3>
        <span className="flow-subtitle">
          {dropOver ? "Drop here" : subtitle}
        </span>
      </div>
    </div>
  );
}

export function Connection({ sequence, delay = 0 }) {
  return (
    <div className="flow-connection" aria-hidden="true">
      <span>→</span>
      {sequence > 0 && (
        <i key={sequence} style={{ animationDelay: `${delay}ms` }} />
      )}
    </div>
  );
}
