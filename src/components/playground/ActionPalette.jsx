import React, { useRef, useState } from "react";
import { ACTIONS } from "./registry";

/** Pointer dragging works with mouse, pen, and touch. Click/Enter is the equivalent shortcut. */
export default function ActionPalette({
  selected,
  onSelect,
  dropTarget,
  onDragOverChange,
}) {
  const [ghost, setGhost] = useState(null);
  const drag = useRef(null);
  const lastDrag = useRef(0);
  const isOverTarget = (x, y) => {
    const rect = dropTarget.current?.getBoundingClientRect();
    return (
      rect &&
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  };
  const cancel = () => {
    drag.current = null;
    setGhost(null);
    onDragOverChange(false);
  };

  return (
    <div className="action-library">
      <p id="drag-instructions">
        Drag an action into <strong>DO</strong>. Or just tap one.
      </p>
      <div className="action-chips" aria-label="Action blocks">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            className="action-chip"
            data-action-id={action.id}
            aria-label={`Use ${action.name} action`}
            aria-pressed={selected === action.id}
            aria-describedby="drag-instructions"
            onClick={() => {
              if (Date.now() - lastDrag.current > 300) onSelect(action.id);
            }}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = {
                action,
                x: e.clientX,
                y: e.clientY,
                moved: false,
              };
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              if (
                Math.hypot(
                  e.clientX - drag.current.x,
                  e.clientY - drag.current.y,
                ) > 6
              )
                drag.current.moved = true;
              if (!drag.current.moved) return;
              setGhost({ action, x: e.clientX, y: e.clientY });
              onDragOverChange(Boolean(isOverTarget(e.clientX, e.clientY)));
            }}
            onPointerUp={(e) => {
              if (drag.current?.moved) {
                lastDrag.current = Date.now();
                if (isOverTarget(e.clientX, e.clientY))
                  onSelect(drag.current.action.id);
              }
              cancel();
            }}
            onPointerCancel={cancel}
            onLostPointerCapture={cancel}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
            }}
          >
            <span aria-hidden="true">{action.icon}</span>
            {action.name}
            <span className="drag-handle" aria-hidden="true">
              ⠿
            </span>
          </button>
        ))}
      </div>
      {ghost && (
        <div
          className="drag-ghost"
          aria-hidden="true"
          style={{ left: ghost.x, top: ghost.y }}
        >
          {ghost.action.icon} {ghost.action.name}
        </div>
      )}
    </div>
  );
}
