import React from "react";
import Brand from "./components/Brand";
import "./styles/site.css";
export default function Docs() {
  return (
    <>
      <header className="site-header container">
        <a href="/" aria-label="NerveNewt home">
          <Brand />
        </a>
        <nav aria-label="Primary">
          <a href="/#playground">Try the demo</a>
          <a href="/docs/">Docs</a>
        </nav>
        <a className="contact-link" href="/#developer-access">
          Early access
        </a>
      </header>
      <main className="docs-page container">
        <div className="eyebrow">PROTOTYPE DOCUMENTATION</div>
        <h1>From a signal to your first action.</h1>
        <p>
          This reference describes the browser demo and the source modules in
          this repository. The hosted SDK, localhost:8080 bridge, and Calm/Focus
          events shown in concept examples are not released products.
        </p>
        <nav className="docs-toc" aria-label="Documentation sections">
          <a href="#quick-start">Quick start</a>
          <a href="#hardware">Hardware</a>
          <a href="#events">Events</a>
          <a href="#api">Provider API</a>
          <a href="#limits">Limits & privacy</a>
        </nav>
        <section id="quick-start">
          <h2>Try it in seconds.</h2>
          <ol>
            <li>
              <a href="/#playground">Open the playground</a>. The simulator
              starts automatically. No account or headset required.
            </li>
            <li>
              Watch the EEG waveform trigger the newt.
            </li>
            <li>
              Pause stops the game and waveform. Resume continues the demo.
            </li>
          </ol>
          <h3>Run the source locally</h3>
          <pre>
            <code>
              {
                "git clone https://github.com/sarthakjena05/nervenewt.git\ncd nervenewt\nnpm install\nnpm run dev"
              }
            </code>
          </pre>
          <p>
            <a href="https://github.com/sarthakjena05/nervenewt">
              View source on GitHub ↗
            </a>
          </p>
        </section>
        <section id="hardware">
          <h2>What works today.</h2>
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Browser simulator</td>
                <td>Available; synthetic EEG, no hardware.</td>
              </tr>
              <tr>
                <td>Muse 2</td>
                <td>
                  Web Bluetooth driver implemented; physical-headband
                  verification pending.
                </td>
              </tr>
              <tr>
                <td>OpenBCI, EMG, ECG/PPG</td>
                <td>Planned; no production adapters or release dates.</td>
              </tr>
            </tbody>
          </table>
          <p>
            To try Muse 2, use Chrome or Edge on HTTPS or localhost. Turn on the
            headset, click + Connect device, and choose it in the browser
            picker. If another app is connected, disconnect it first. Cancelling
            pairing or losing the stream returns to simulation.
          </p>
        </section>
        <section id="events">
          <h2>Events you can handle.</h2>
          <table>
            <thead>
              <tr>
                <th>Live event</th>
                <th>Meaning in this prototype</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>blink</code>
                </td>
                <td>
                  Forehead voltage excursion above 120 µV; 350 ms debounce.
                </td>
              </tr>
              <tr>
                <td>
                  <code>eyes.closed</code>
                </td>
                <td>Relative alpha exceeds 0.45 for over 400 ms.</td>
              </tr>
              <tr>
                <td>
                  <code>eyes.open</code>
                </td>
                <td>Alpha falls below the closed-eye threshold.</td>
              </tr>
            </tbody>
          </table>
          <p>
            The simulator emits <code>eyes_closed</code> and{" "}
            <code>eyes_open</code>. These are heuristic labels, not validated
            measurements of attention, emotion, or medical state.
          </p>
        </section>
        <section id="api">
          <h2>A working source-level example.</h2>
          <p>
            Use this inside the repository. Call connect from a click handler so
            the browser can open its Bluetooth picker.
          </p>
          <pre>
            <code>
              {
                'import { MuseProvider } from "./src/providers/MuseProvider.js";\n\nconst connectButton = document.querySelector("#connect"); // your button\nconst stream = new MuseProvider();\nconst unsubscribe = stream.subscribe(event => {\n  if (event.type === "event" && event.name === "blink") {\n    document.body.classList.toggle("blink-active");\n  }\n});\n\nconnectButton.addEventListener("click", async () => {\n  try { await stream.connect(); }\n  catch (error) { console.error(error.message); }\n});\n\n// When leaving the page or disposing the integration:\n// unsubscribe();\n// stream.disconnect();'
              }
            </code>
          </pre>
          <dl>
            <dt>
              <code>connect(): Promise&lt;void&gt;</code>
            </dt>
            <dd>
              Requests a device, subscribes to four EEG channels, and starts
              streaming. Rejects on cancellation or connection failure.
            </dd>
            <dt>
              <code>subscribe(listener): () =&gt; void</code>
            </dt>
            <dd>
              Receives status, frame, and event messages. Returns an unsubscribe
              function.
            </dd>
            <dt>
              <code>setPaused(boolean)</code>
            </dt>
            <dd>
              Pauses emitted frames and detections while keeping the Bluetooth
              connection.
            </dd>
            <dt>
              <code>disconnect()</code>
            </dt>
            <dd>
              Releases listeners, animation callbacks, buffers, and the GATT
              connection.
            </dd>
          </dl>
          <h3>Frame payload</h3>
          <pre>
            <code>
              {
                '{\n  type: "frame",\n  channels: [TP9, AF7, AF8, TP10], // µV arrays, up to 256 each\n  replace: true,\n  alpha: 0.52, // relative power, not attention confidence\n  timestamp: 3.2, // seconds since connection\n  drop: 0 // missing/malformed packets across channels\n}'
              }
            </code>
          </pre>
        </section>
        <section id="limits">
          <h2>Small, local, and explicit.</h2>
          <p>
            EEG samples stay in browser memory. Four channels stream at 256 Hz;
            spectral analysis runs at 10 Hz, waveform rendering at up to 25 Hz,
            and gameplay uses its own animation loop. End-to-end latency has not
            been benchmarked on physical hardware.
          </p>
          <p>
            Different hardware needs different adapters, calibration, and event
            validation. The shared provider interface is the current
            abstraction; broad device coverage is a roadmap, not a claim of
            compatibility. Hardware protocols can change.
          </p>
          <p>
            Early-access forms send contact information only when an intake or
            email service is configured. They do not submit EEG data.
          </p>
        </section>
      </main>
    </>
  );
}
