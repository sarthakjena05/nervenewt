import { DeviceProvider } from "./DeviceProvider.js";
import { SERVICE, CONTROL, EEG, decodeEEG, Detector } from "../lib/muse.js";
export class MuseProvider extends DeviceProvider {
  id = "muse";
  live = true;
  constructor({
    bluetooth = globalThis.navigator?.bluetooth,
    raf = globalThis.requestAnimationFrame,
    caf = globalThis.cancelAnimationFrame,
    now = () => performance.now(),
  } = {}) {
    super();
    Object.assign(this, { bluetooth, raf, caf, now });
    this.channels = [[], [], [], []];
    this.lastSequence = [null, null, null, null];
    this.lastPacket = [0, 0, 0, 0];
    this.detector = new Detector();
    this.subscriptions = [];
    this.drop = 0;
    this.token = 0;
    this.paused = false;
  }
  connect() {
    if (this.connected) return Promise.resolve();
    if (this.connecting) return this.connecting;
    this.connecting = this.pair().finally(() => {
      this.connecting = null;
    });
    return this.connecting;
  }
  async pair() {
    if (!this.bluetooth)
      throw new Error(
        "Web Bluetooth requires Chrome, Edge, or Brave on desktop/Android. Falling back to simulation.",
      );
    const token = ++this.token;
    const check = () => {
      if (token !== this.token) throw new Error("Connection cancelled");
    };
    try {
      const device = await this.bluetooth.requestDevice({
        filters: [{ namePrefix: "Muse" }],
        optionalServices: [SERVICE, CONTROL],
      });
      check();
      this.device = device;
      this.onLost = () => {
        this.disconnect();
        this.emit({ type: "status", status: "disconnected", simulated: false });
      };
      device.addEventListener("gattserverdisconnected", this.onLost);
      const server = await device.gatt.connect();
      check();
      const service = await server.getPrimaryService(SERVICE);
      check();
      this.control = await service.getCharacteristic(CONTROL);
      check();
      for (let channel = 0; channel < 4; channel++) {
        const characteristic = await service.getCharacteristic(EEG[channel]);
        check();
        const listener = (e) => this.receive(channel, e.target.value);
        characteristic.addEventListener("characteristicvaluechanged", listener);
        this.subscriptions.push([characteristic, listener]);
        await characteristic.startNotifications();
        check();
      }
      for (const command of ["h", "s", "p21", "d"]) {
        const bytes = Uint8Array.from([
          command.length + 1,
          ...Array.from(command, (c) => c.charCodeAt(0)),
          10,
        ]);
        if (
          this.control.properties?.writeWithoutResponse &&
          !this.control.properties?.write
        )
          await this.control.writeValueWithoutResponse(bytes);
        else if (this.control.writeValueWithResponse)
          await this.control.writeValueWithResponse(bytes);
        else await this.control.writeValue(bytes);
        check();
      }
      this.connected = true;
      this.started = this.now();
      this.lastFrame = -Infinity;
      this.emit({ type: "status", status: "connected", simulated: false });
      const animate = () => {
        if (!this.connected) return;
        const now = this.now();
        if (
          now - this.started > 5000 &&
          this.lastPacket.some((t) => now - t > 5000)
        ) {
          this.disconnect();
          this.emit({
            type: "status",
            status: "disconnected",
            simulated: false,
            reason: "Muse EEG stream stopped. Returning to simulation.",
          });
          return;
        }
        if (!this.paused && this.dirty && now - this.lastFrame >= 40) {
          this.dirty = false;
          this.lastFrame = now;
          const event = this.detector.spectral(this.channels, now);
          if (event) this.emit({ type: "event", name: event });
          this.emit({
            type: "frame",
            channels: this.channels.map((c) => c.slice()),
            replace: true,
            alpha: this.detector.alpha,
            timestamp: (now - this.started) / 1000,
            drop: this.drop,
          });
        }
        this.frameId = this.raf(animate);
      };
      this.frameId = this.raf(animate);
    } catch (error) {
      this.disconnect();
      throw error;
    }
  }
  receive(channel, value) {
    let packet;
    try {
      packet = decodeEEG(value);
    } catch {
      this.drop++;
      return;
    }
    const previous = this.lastSequence[channel];
    const delta =
      previous === null ? 1 : (packet.sequence - previous + 65536) % 65536;
    if (delta === 0 || delta > 32768) return;
    if (delta > 1) {
      this.drop += delta - 1;
      this.channels[channel] = [];
      this.detector.highSince = null;
    }
    this.lastSequence[channel] = packet.sequence;
    this.lastPacket[channel] = this.now();
    this.channels[channel] = [
      ...this.channels[channel],
      ...packet.samples,
    ].slice(-256);
    this.dirty = true;
    if (
      !this.paused &&
      this.detector.blink(channel, packet.samples, this.now())
    )
      this.emit({ type: "event", name: "blink" });
  }
  setPaused(value) {
    this.paused = value;
    this.detector = new Detector();
  }
  disconnect() {
    ++this.token;
    this.connected = false;
    if (this.frameId !== undefined) this.caf(this.frameId);
    for (const [characteristic, listener] of this.subscriptions)
      characteristic.removeEventListener(
        "characteristicvaluechanged",
        listener,
      );
    this.subscriptions = [];
    if (this.device) {
      this.device.removeEventListener("gattserverdisconnected", this.onLost);
      if (this.device.gatt.connected) this.device.gatt.disconnect();
    }
    this.channels = [[], [], [], []];
    this.lastSequence = [null, null, null, null];
    this.lastPacket = [0, 0, 0, 0];
    this.detector = new Detector();
    this.drop = 0;
  }
}
