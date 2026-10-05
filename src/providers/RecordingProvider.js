import { DeviceProvider } from './DeviceProvider.js';
import recording from '../data/eeg-recording.js';

/** Unmodified recorded microvolts, played at the original 160 Hz. */
export class RecordingProvider extends DeviceProvider {
  recorded = true;
  cursor = 0;
  elapsed = 0;
  emitted = 0;
  lastPeak = -Infinity;
  previous = 0;
  window = [];
  timer = null;
  connect() {
    if (this.timer !== null) return;
    this.emit({ type: 'status', status: 'connected' });
    let previousTime = performance.now();
    this.timer = setInterval(() => {
      const now = performance.now();
      // Background-tab gaps pause playback rather than flooding the game with old events.
      this.advance(Math.min(now - previousTime, 100));
      previousTime = now;
    }, 40);
  }
  advance(milliseconds) {
    this.elapsed += milliseconds;
    const target = Math.floor(this.elapsed * recording.sampleRate / 1000);
    while (this.emitted < target) {
      if (this.cursor === recording.samples.length) {
        this.cursor = 0;
        this.window = [];
        this.previous = 0;
      }
      const value = recording.samples[this.cursor++];
      this.window.push(value);
      if (this.window.length > recording.sampleRate * 3) this.window.shift();
      // Illustrative amplitude trigger, not a claim of detected blinks or mental state.
      if (Math.abs(value) > 60 && Math.abs(this.previous) <= 60 && this.emitted - this.lastPeak > recording.sampleRate * .7) {
        this.lastPeak = this.emitted;
        this.emit({ type: 'event', name: 'signal.peak' });
      }
      this.previous = value;
      this.emitted++;
    }
    this.emit({ type: 'frame', replace: true, channels: [[], [...this.window], [], []], timestamp: this.cursor / recording.sampleRate });
  }
  disconnect() {
    clearInterval(this.timer);
    this.timer = null;
    this.emit({ type: 'status', status: 'disconnected' });
  }
}
