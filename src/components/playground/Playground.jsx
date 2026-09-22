import React, { useRef, useState } from "react";
import Brand from "../Brand";
import WorkflowNode, { Connection } from "./WorkflowNode";
import SignalPreview from "./SignalPreview";
import FocusPreview from "./FocusPreview";
import GamePreview from "./GamePreview";

import ActionPalette from "./ActionPalette";
import useWorkflow from "./useWorkflow";
import { INPUTS, DETECTORS } from "./registry";

export default function Playground({
  provider,
  onConnect,
  pairing,
  onDisconnect,
}) {
  const flow = useWorkflow(provider);
  const dropTarget = useRef(null);
  const [dropOver, setDropOver] = useState(false);

  return (
    <section
      className="playground-wrap"
      id="playground"
      aria-labelledby="playground-title"
    >
      <div className="playground-intro">
        <span>LESS SETUP. MORE PLAY.</span>
        <span>No hardware needed</span>
      </div>
      <div className="playground">
        <div className="playground-toolbar">
          <div className="workspace-name">
            <Brand compact />
            <h2 id="playground-title">Your first flow</h2>
            <span className="demo-badge">
              {provider.live
                ? "Live Telemetry · Muse 2"
                : "Demo · Simulated EEG"}
            </span>
          </div>
          <div className="device-connection">
            {provider.live ? (
              <>
                <span className="connected-label">● Muse 2 Connected</span>
                <button className="connect-device" onClick={onDisconnect}>
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="connect-device"
                onClick={onConnect}
                disabled={pairing}
              >
                {pairing ? "Pairing Muse 2..." : "+ Connect device"}
              </button>
            )}
          </div>
        </div>
        <div className="simple-playground">
          <div className="flow-builder">
            <div className="builder-heading">
              <h3>A signal. An action.</h3>
              <p>One signal stream. Two application behaviors.</p>
            </div>
            <div className="workflow">
              <WorkflowNode
                label="INPUT"
                icon="∿"
                title={INPUTS[0].name}
                subtitle={
                  provider.live ? "Live Web Bluetooth" : "Simulated EEG"
                }
              />
              <Connection sequence={flow.sequence} />
              <WorkflowNode
                label="WHEN"
                icon={flow.detected ? "◡" : "◎"}
                title={DETECTORS[0].name}
                subtitle={flow.detected ? "Triggered!" : "Listening"}
                active={flow.detected}
              />
              <Connection sequence={flow.sequence} delay={175} />
              <WorkflowNode
                label="DO"
                icon={flow.action.icon}
                title={flow.action.name}
                subtitle="Drop an action"
                active={flow.actionActive && flow.detected}
                dropRef={dropTarget}
                dropOver={dropOver}
              />
            </div>
            <ActionPalette
              selected={flow.action.id}
              onSelect={flow.selectAction}
              dropTarget={dropTarget}
              onDragOverChange={setDropOver}
            />
            <p className="autoplay-note">
              {provider.live
                ? "Blink or close your eyes to trigger an action."
                : "Runs automatically. Each EEG pulse triggers your action."}
            </p>
          </div>
          <div className="application-previews">
            <GamePreview
              live={!!provider.live}
              onTogglePause={flow.togglePause}
              event={flow.event}
              paused={flow.paused}
            />
            <FocusPreview
              alpha={flow.frame.alpha}
              live={!!provider.live}
              paused={flow.paused}
            />
          </div>
          <div className="live-signal">
            <SignalPreview
              live={!!provider.live}
              drop={flow.frame.drop ?? 0}
              channels={flow.frame.channels}
              timestamp={flow.frame.timestamp}
              paused={flow.paused}
              alpha={flow.frame.alpha}
              detected={flow.detected}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
