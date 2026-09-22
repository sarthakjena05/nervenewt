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

The default stream is synthetic. Click + Connect device to pair a physical Muse 2 using Web Bluetooth on HTTPS or localhost. Cancelled pairing, unsupported browsers, and lost/stalled streams return to simulation. Disconnect explicitly releases GATT. Live biosignal samples stay in browser memory; they are not uploaded.

The Muse driver subscribes to TP9/AF7/AF8/TP10, uses the h → s → p21 → d startup sequence, decodes 12-bit packets to microvolts, and keeps 256 samples per channel. A Hann-windowed Goertzel calculation measures 8–12 Hz power relative to 4–30 Hz at 10 Hz. Sustained alpha and debounced forehead voltage excursions trigger gameplay. These are illustrative heuristics, not validated physiological classifications. Physical-headband verification is still required; 60 FPS and latency depend on the browser and device.

## Structure

- `src/components/`: branding, hero, and concise marketing sections.
- `src/components/playground/`: workflow, live signal, game, device dialog, action registry, and audio.
- `src/providers/`: normalized provider interface, working simulator, and a Web Bluetooth Muse 2 adapter.
- `src/styles/site.css`: marketing styling and reduced-motion behavior.
- `src/styles/playground.css`: white builder, draggable blocks, and responsive game layout.

Providers expose `connect()`, `disconnect()`, and `subscribe(listener)`. They emit `{ type: 'status', status, simulated }`, `{ type: 'frame', timestamp, alpha, sample }`, and `{ type: 'event', name, confidence }`. The simulator uses `autoplay: true` for the public demo; `setEyesClosed(boolean)` remains available for manual provider tests. Muse frames supply a replacement one-second channel window and packet-drop count. Live events are `eyes.closed`, `eyes.open`, and `blink`. The demo's alpha threshold is illustrative, not a validated physiological detector.

## Verification

```bash
node --test src/providers/*.test.js src/components/playground/gameEngine.test.js
npm run build
```

Manually check automatic flight and visible waveform on load, dragging action chips, pause/resume, simulator reconnection, dialog Escape/focus behavior, and desktop/mobile layouts. The site uses a Google Fonts stylesheet with system font fallbacks.

The existing Vite 5 / esbuild development dependencies report one high and one moderate advisory in `npm audit`. A toolchain upgrade is a separate follow-up; the local preview is bound to loopback.

Hardware acceptance: pair a powered Muse 2; check all four traces move, blink/close eyes for action feedback, pause/resume, disconnect/reconnect, switch the headset off to check fallback, and reject the chooser to check cancellation. Protocol reference: https://github.com/urish/muse-js/blob/master/src/muse.spec.ts

## Developer access submissions

`api/waitlist.js` is a Vercel serverless POST endpoint. Configure `WAITLIST_WEBHOOK_URL` to an HTTPS endpoint that durably stores JSON records; optional `WAITLIST_WEBHOOK_TOKEN` adds a server-only Bearer header. Records contain email, hardware, projectType, source, and createdAt. No biosignal data is sent. The endpoint validates fields and same-origin requests and includes a honeypot. Configure durable rate limits/spam protection at the chosen intake service. The browser only shows success after that service acknowledges the record; absent configuration returns 503.

The endpoint is not served by plain Vite dev. Use the deployed Vercel function or Vercel dev for full form integration. Run `node --test tests/waitlist.test.js` for request validation and delivery-path tests. Before enabling signups, configure the intake service and verify an authorized test record appears in storage. Do not put intake credentials in VITE_* variables.

Email-first signup: configure server-only `RESEND_API_KEY` and `WAITLIST_FROM` (a verified sender) in Vercel to route notifications to sarthak@nervenewt.com and taban@nervenewt.com. When configured, Resend is the intake destination and receives the optional hardware/project answers too. Existing webhook intake remains the fallback when email delivery is not configured. No success is reported without provider acknowledgement. Email delivery has not been verified with live credentials. Reference: https://resend.com/docs/api-reference/emails/send-email
