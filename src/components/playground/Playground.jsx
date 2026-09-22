import React, { useRef, useState } from "react";
import Brand from "../Brand";
import WorkflowNode, { Connection } from "./WorkflowNode";
import SignalPreview from "./SignalPreview";
import GamePreview from "./GamePreview";

import ActionPalette from "./ActionPalette";
import useWorkflow from "./useWorkflow";
import { INPUTS, DETECTORS } from "./registry";

export default function Playground({ provider, onConnect }) {
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
            <span className="demo-badge">Demo · Simulated EEG</span>
          </div>
          <button className="connect-device" onClick={onConnect}>
            ＋ Connect device
          </button>
        </div>
        <div className="simple-playground">
          <div className="flow-builder">
            <div className="builder-heading">
              <h3>A signal. An action.</h3>
              <p>The signal plays. The newt flaps.</p>
            </div>
            <div className="workflow">
              <WorkflowNode
                label="INPUT"
                icon="∿"
                title={INPUTS[0].name}
                subtitle="Simulated EEG"
              />
              <Connection sequence={flow.sequence} />
              <WorkflowNode
                label="WHEN"
                icon={flow.detected ? "◡" : "◎"}
                title={DETECTORS[0].name}
                subtitle={flow.detected ? "Detected" : "Listening"}
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
              Runs automatically. Each EEG pulse triggers your action.
            </p>
          </div>
          <GamePreview
            onTogglePause={flow.togglePause}
            event={flow.event}
            paused={flow.paused}
          />
          <div className="live-signal">
            <SignalPreview
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
