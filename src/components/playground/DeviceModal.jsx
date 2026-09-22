import React, { useEffect, useRef } from "react";
import Brand from "../Brand";
export default function DeviceModal({ open, onClose, onSimulator, message }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement,
      element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      className="device-modal"
      ref={dialog}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      aria-labelledby="device-title"
    >
      <div className="modal-heading">
        <Brand compact />
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close device dialog"
        >
          ×
        </button>
      </div>
      <h2 id="device-title">Muse 2 connection</h2>
      <p role="status">{message}</p>
      <button
        className="button secondary"
        onClick={() => {
          onSimulator();
          onClose();
        }}
      >
        Continue with simulation
      </button>
    </dialog>
  );
}
