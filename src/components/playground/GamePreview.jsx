import React, { useEffect, useRef, useState } from "react";
import { FIELD, createGame, applyAction, stepGame } from "./gameEngine";

function Newt({ purple }) {
  return (
    <g fill={purple ? "#9881c7" : "#ee8651"}>
      <path d="M-9 3C-27 20-35 7-30-1C-26 11-18 0-12-4C-6-14 12-13 20-5C35-7 36 10 22 10L-3 11Z" />
      <path
        d="m-5-5-7-8m7 20-10 8m23-7 8 6"
        fill="none"
        stroke={purple ? "#9881c7" : "#ee8651"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="23" cy="-2" r="4" fill="white" />
      <circle cx="24" cy="-2" r="2" fill="#17252b" />
    </g>
  );
}

export default function GamePreview({ event, paused, signal, onTogglePause }) {
  const world = useRef(createGame({ demo: true }));
  const [game, setGame] = useState(world.current);
  const lastEvent = useRef(null);
  useEffect(() => {
    if (!event || lastEvent.current === event.id) return;
    lastEvent.current = event.id;
    world.current = applyAction(world.current, event.action);
    setGame(world.current);
  }, [event]);

  useEffect(() => {
    if (paused) return;
    let frameId;
    let previousTime;
    const animate = (time) => {
      const dt = previousTime === undefined ? 0 : (time - previousTime) / 1000;
      previousTime = time;
      world.current = stepGame(world.current, dt);
      setGame(world.current);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [paused]);

  return (
    <div className="flight-panel">
      <div className="flight-heading">
        <span>NEWT FLIGHT</span>
        <button
          onClick={onTogglePause}
          aria-label={paused ? "Resume demo" : "Pause demo"}
        >
          {paused ? "▶ Resume" : "Ⅱ Pause"}
        </button>
      </div>
      <div
        className="flight-stage"
        role="img"
        aria-label="Newt Flight automatically controlled by simulated EEG pulses"
      >
        <svg viewBox={`0 0 ${FIELD.width} ${FIELD.height}`} aria-hidden="true">
          <rect width="480" height="320" fill="#f5f8f4" />
          <path
            d="M35 62h48m-28-8h25M276 46h66m-44-9h34M344 222h54"
            stroke="#e2e9df"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {game.pipes.map((pipe, i) => (
            <g key={i} fill="#cfddbf" stroke="#aabd99" strokeWidth="1.5">
              <rect
                x={pipe.x}
                y="-8"
                width={FIELD.pipeWidth}
                height={pipe.center - FIELD.gap / 2 + 8}
                rx="3"
              />
              <rect
                x={pipe.x - 4}
                y={pipe.center - FIELD.gap / 2 - 13}
                width={FIELD.pipeWidth + 8}
                height="13"
                rx="2"
              />
              <rect
                x={pipe.x}
                y={pipe.center + FIELD.gap / 2}
                width={FIELD.pipeWidth}
                height={FIELD.height - pipe.center - FIELD.gap / 2}
                rx="3"
              />
              <rect
                x={pipe.x - 4}
                y={pipe.center + FIELD.gap / 2}
                width={FIELD.pipeWidth + 8}
                height="13"
                rx="2"
              />
            </g>
          ))}
          <rect y={FIELD.floor} width="480" height="24" fill="#e9eedf" />
          <path d="M0 296H480" stroke="#c6d4b8" strokeWidth="1.5" />
          <g
            transform={`translate(${FIELD.playerX} ${game.y}) rotate(${Math.max(-18, Math.min(30, game.velocity * 0.12))})`}
          >
            <Newt purple={game.purple} />
            {game.sound > 0 && (
              <text x="30" y="-20" fill="#ba693d" fontSize="20">
                ♫
              </text>
            )}
          </g>
          {game.shots.map((shot, i) => (
            <rect
              key={i}
              x={shot.x}
              y={shot.y}
              width="13"
              height="4"
              rx="2"
              fill="#ef8851"
            />
          ))}
          <text
            x="240"
            y="40"
            textAnchor="middle"
            fill="#76846b"
            fontSize="25"
            fontFamily="inherit"
          >
            {game.score}
          </text>
        </svg>
        {paused && (
          <span className="flight-overlay">
            <strong>Paused</strong>
          </span>
        )}
      </div>
      <div className="flight-instructions">
        <span>{paused ? "Paused" : "Autoplay · EEG controlled"}</span>
        <span>
          {event ? event.name + " triggered" : "Listening to the signal"}
        </span>
      </div>
    </div>
  );
}
