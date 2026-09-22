import { DeviceProvider } from "./DeviceProvider.js";
export class SimulatorProvider extends DeviceProvider {
  id = "simulator";
  alpha = 0.32;
  closed = false;
  detected = false;
  time = 0;
  timer = null;
  sampleIndex = 0;
  constructor({ autoplay = false } = {}) {
    super();
    this.autoplay = autoplay;
  }
  connect() {
    if (this.timer) return;
    this.emit({ type: "status", status: "connected", simulated: true });
    this.timer = setInterval(() => this.tick(), 40);
  }
  setEyesClosed(closed) {
    this.closed = closed;
  }
  tick() {
    this.time += 0.04;
    if (this.autoplay) this.closed = this.time % 1.2 < 0.5;
    this.alpha += ((this.closed ? 0.87 : 0.32) - this.alpha) * 0.17;
    const sample =
      Math.sin(this.time * 62.8) * this.alpha +
      Math.sin(this.time * 137) * (this.closed ? 0.06 : 0.19);
    // Dense synthetic EEG, sampled independently of the 25 Hz UI refresh.
    const channels = [0, 1, 2, 3].map((channel) => {
      const values = [];
      for (
        let index = this.sampleIndex;
        index < Math.floor(this.time * 256);
        index++
      ) {
        const t = index / 256;
        const phase = channel * 0.73;
        const envelope = 0.7 + 0.3 * Math.sin(t * 2.3 + phase);
        values.push(
          Math.sin(t * Math.PI * 2 * (9.6 + channel * 0.35) + phase) *
            this.alpha *
            19 *
            envelope +
            Math.sin(t * 2 * Math.PI * 5.3 + phase) * 4 +
            Math.sin(t * 2 * Math.PI * 21.7 + phase * 2) * 2.7 +
            Math.sin(t * 2 * Math.PI * 37.1 + phase) * 1.4 +
            Math.sin(t * 1.7 + phase) * 3,
        );
      }
      return values;
    });
    this.sampleIndex = Math.floor(this.time * 256);
    this.emit({
      type: "frame",
      timestamp: this.time,
      alpha: this.alpha,
      sample,
      channels,
    });
    // Hysteresis: one event per transition, without threshold chatter.
    if (this.alpha > 0.65 && !this.detected) {
      this.detected = true;
      this.emit({ type: "event", name: "eyes_closed", confidence: 0.96 });
    } else if (this.alpha < 0.45 && this.detected) {
      this.detected = false;
      this.emit({ type: "event", name: "eyes_open", confidence: 0.96 });
    }
  }
  disconnect() {
    clearInterval(this.timer);
    this.timer = null;
    this.closed = false;
    this.detected = false;
    this.alpha = 0.32;
    this.emit({ type: "status", status: "disconnected", simulated: true });
  }
}
