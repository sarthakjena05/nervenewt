export const SERVICE = "0000fe8d-0000-1000-8000-00805f9b34fb";
export const CONTROL = "273e0001-4c4d-454d-96be-f03bac821358";
export const EEG = [3, 4, 5, 6].map(
  (n) => `273e000${n}-4c4d-454d-96be-f03bac821358`,
);
export function decodeEEG(view) {
  if (view.byteLength !== 20) throw new Error("Invalid Muse EEG packet");
  const samples = [];
  for (let i = 2; i < 20; i += 3) {
    samples.push(
      (((view.getUint8(i) << 4) | (view.getUint8(i + 1) >> 4)) - 2048) *
        0.48828125,
    );
    samples.push(
      ((((view.getUint8(i + 1) & 15) << 8) | view.getUint8(i + 2)) - 2048) *
        0.48828125,
    );
  }
  return { sequence: view.getUint16(0, false), samples };
}
// One-second Hann-windowed Goertzel spectrum; 27 bins, no FFT dependency.
export function relativeAlpha(samples) {
  if (samples.length < 256) return 0;
  const mean = samples.reduce((a, b) => a + b, 0) / 256;
  const window = samples.map(
    (v, i) => (v - mean) * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / 255)),
  );
  let alpha = 0,
    total = 0;
  for (let hz = 4; hz <= 30; hz++) {
    const c = 2 * Math.cos((2 * Math.PI * hz) / 256);
    let a = 0,
      b = 0;
    for (const v of window) {
      const next = v + c * a - b;
      b = a;
      a = next;
    }
    const power = Math.max(0, a * a + b * b - c * a * b);
    total += power;
    if (hz >= 8 && hz <= 12) alpha += power;
  }
  return total > 1e-8 ? alpha / total : 0;
}
export class Detector {
  constructor() {
    this.baseline = [null, null];
    this.lastBlink = -Infinity;
    this.highSince = null;
    this.closed = false;
    this.alpha = 0;
    this.lastSpectrum = -Infinity;
  }
  blink(channel, samples, now) {
    if (channel !== 1 && channel !== 2) return false;
    const index = channel - 1;
    let excursion = false;
    for (const v of samples) {
      if (this.baseline[index] === null) this.baseline[index] = v;
      if (Math.abs(v - this.baseline[index]) > 120) excursion = true;
      this.baseline[index] += 0.01 * (v - this.baseline[index]);
    }
    if (excursion && now - this.lastBlink >= 350) {
      this.lastBlink = now;
      return true;
    }
    return false;
  }
  spectral(channels, now) {
    if (now - this.lastSpectrum < 100) return null;
    this.lastSpectrum = now;
    if (channels[0].length < 256 || channels[3].length < 256) return null;
    this.alpha = (relativeAlpha(channels[0]) + relativeAlpha(channels[3])) / 2;
    if (this.alpha > 0.45) {
      this.highSince ??= now;
      if (!this.closed && now - this.highSince > 400) {
        this.closed = true;
        return "eyes.closed";
      }
    } else {
      this.highSince = null;
      if (this.closed) {
        this.closed = false;
        return "eyes.open";
      }
    }
    return null;
  }
}
