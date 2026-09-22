# NerveNewt

Developer infrastructure for neural and physiological signals.

An interactive React + Vite website with a simulated EEG playground. The existing NerveNewt logo is used throughout.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Playground

The white playground starts automatically. Simulated EEG cycles through elevated alpha and baseline activity; each detected pulse travels through INPUT → WHEN → DO and triggers the selected action. The Flappy-style newt scene and live waveform run together without tapping, eye controls, or a start button. Pause freezes both; Resume continues them.

Drag action chips into DO with a mouse, pen, or touch, or select a chip with click/Enter. Jump is the default. Boost, Shoot, Move Up, Change Color, and Play Sound provide alternate feedback; audio requires an explicit selection. The scene uses assisted flight and continuous play so the demonstration never needs a restart.

All biosignal data is synthetic. No Bluetooth connection, physical device support, or production SDK is claimed. Device and platform roadmaps are explicitly labeled.

## Structure

- `src/components/`: branding, hero, and concise marketing sections.
- `src/components/playground/`: workflow, live signal, game, device dialog, action registry, and audio.
- `src/providers/`: normalized provider interface, working simulator, and a deliberately unavailable Muse adapter.
- `src/styles/site.css`: marketing styling and reduced-motion behavior.
- `src/styles/playground.css`: white builder, draggable blocks, and responsive game layout.

Providers expose `connect()`, `disconnect()`, and `subscribe(listener)`. They emit `{ type: 'status', status, simulated }`, `{ type: 'frame', timestamp, alpha, sample }`, and `{ type: 'event', name, confidence }`. The simulator uses `autoplay: true` for the public demo; `setEyesClosed(boolean)` remains available for manual provider tests. A future hardware adapter must normalize its stream to this contract and replace the simulation controls with real device state. The demo's alpha threshold is illustrative, not a validated physiological detector.

## Verification

```bash
node --test src/providers/SimulatorProvider.test.js src/components/playground/gameEngine.test.js
npm run build
```

Manually check automatic flight and visible waveform on load, dragging action chips, pause/resume, simulator reconnection, dialog Escape/focus behavior, and desktop/mobile layouts. The site uses a Google Fonts stylesheet with system font fallbacks.

The existing Vite 5 / esbuild development dependencies report one high and one moderate advisory in `npm audit`. A toolchain upgrade is a separate follow-up; the local preview is bound to loopback.
