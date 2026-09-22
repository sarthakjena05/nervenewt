import React, { useEffect, useRef } from "react";
import Brand from "../Brand";
export default function DeviceModal({ open, onClose, onSimulator }) {
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
      <div className="eyebrow">CHOOSE YOUR INPUT</div>
      <h2 id="device-title">Connect a device.</h2>
      <p>
        Start with simulated signals. Real hardware connections are on the way.
      </p>
      <h3>EEG</h3>
      <button
        className="device-option simulator-option"
        onClick={() => {
          onSimulator();
          onClose();
        }}
      >
        <span>
          <strong>Simulator</strong>
          <small>Explore the Muse 2 workflow with simulated EEG</small>
        </span>
        <span className="device-tag">Use simulator →</span>
      </button>
      {["Muse 2", "EMOTIV", "OpenBCI"].map((name) => (
        <div className="device-option" key={name}>
          <strong>{name}</strong>
          <span className="device-tag">Coming Soon</span>
        </div>
      ))}
      <h3>HEART</h3>
      <div className="device-option">
        <strong>Polar H10</strong>
        <span className="device-tag">Coming Soon</span>
      </div>
      <h3>OTHER</h3>
      <div className="device-option">
        <strong>Apple Health</strong>
        <span className="device-tag">Coming Soon</span>
      </div>
      <div className="modal-note">
        Simulator available now. No physical device is connected.
      </div>
    </dialog>
  );
}
