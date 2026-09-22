import test from "node:test";
import assert from "node:assert/strict";
import {
  decodeEEG,
  relativeAlpha,
  Detector,
  SERVICE,
  CONTROL,
  EEG,
} from "../lib/muse.js";
import { MuseProvider } from "./MuseProvider.js";
function packet(sequence = 1, raw = 2048) {
  const b = new Uint8Array(20);
  b[0] = sequence >> 8;
  b[1] = sequence & 255;
  for (let i = 2; i < 20; i += 3) {
    b[i] = raw >> 4;
    b[i + 1] = ((raw & 15) << 4) | (raw >> 8);
    b[i + 2] = raw & 255;
  }
  return new DataView(b.buffer);
}
const sine = (hz) =>
  Array.from(
    { length: 256 },
    (_, i) => 30 * Math.sin((2 * Math.PI * hz * i) / 256),
  );
test("12-bit packing, offset and microvolt scale", () => {
  assert.deepEqual(decodeEEG(packet(65535)).samples, Array(12).fill(0));
  assert.equal(decodeEEG(packet(65535)).sequence, 65535);
  assert.equal(decodeEEG(packet(1, 0)).samples[0], -1000);
  assert.equal(decodeEEG(packet(1, 4095)).samples[11], 999.51171875);
  assert.throws(() => decodeEEG(new DataView(new ArrayBuffer(19))));
});
test("alpha ratio distinguishes 10 Hz from 20 Hz, requires sustained power and rearms", () => {
  assert.ok(relativeAlpha(sine(10)) > 0.9);
  assert.ok(relativeAlpha(sine(20)) < 0.01);
  const d = new Detector(),
    high = [sine(10), [], [], sine(10)],
    low = [sine(20), [], [], sine(20)];
  for (const t of [0, 100, 200, 300, 400])
    assert.equal(d.spectral(high, t), null);
  assert.equal(d.spectral(high, 500), "eyes.closed");
  assert.equal(d.spectral(high, 600), null);
  assert.equal(d.spectral(low, 700), "eyes.open");
  assert.equal(relativeAlpha(Array(256).fill(50)), 0);
});
test("blink detects forehead excursions with shared 350 ms debounce", () => {
  const d = new Detector();
  d.blink(1, [0], 0);
  d.blink(2, [0], 0);
  assert.equal(d.blink(1, [150], 10), true);
  assert.equal(d.blink(2, [150], 100), false);
  assert.equal(d.blink(1, [-150], 360), true);
  assert.equal(d.blink(0, [500], 1000), false);
});
function mock() {
  const writes = [],
    chars = new Map(),
    frames = new Map();
  let time = 10000,
    id = 0,
    requests = 0;
  class Characteristic extends EventTarget {
    async startNotifications() {
      return this;
    }
    async writeValueWithResponse(bytes) {
      writes.push([...bytes]);
    }
    send(value) {
      this.value = value;
      this.dispatchEvent(new Event("characteristicvaluechanged"));
    }
  }
  for (const uuid of [CONTROL, ...EEG]) chars.set(uuid, new Characteristic());
  const device = new EventTarget();
  device.gatt = {
    connected: false,
    async connect() {
      this.connected = true;
      return this;
    },
    async getPrimaryService(uuid) {
      assert.equal(uuid, SERVICE);
      return { getCharacteristic: async (uuid) => chars.get(uuid) };
    },
    disconnect() {
      this.connected = false;
      device.dispatchEvent(new Event("gattserverdisconnected"));
    },
  };
  const provider = new MuseProvider({
    bluetooth: {
      async requestDevice(options) {
        requests++;
        assert.equal(options.filters[0].namePrefix, "Muse");
        return device;
      },
    },
    raf: (fn) => {
      frames.set(++id, fn);
      return id;
    },
    caf: (id) => frames.delete(id),
    now: () => time,
  });
  return {
    provider,
    writes,
    chars,
    device,
    frames,
    requests: () => requests,
    advance(ms) {
      time += ms;
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((fn) => fn());
    },
  };
}
test("BLE startup, channel decoding, wraparound/drop accounting, pause, disconnect cleanup", async () => {
  const m = mock(),
    messages = [];
  m.provider.subscribe((e) => messages.push(e));
  await m.provider.connect();
  await m.provider.connect();
  assert.equal(m.requests(), 1);
  assert.deepEqual(m.writes, [
    [2, 104, 10],
    [2, 115, 10],
    [4, 112, 50, 49, 10],
    [2, 100, 10],
  ]);
  for (let i = 0; i < 4; i++) m.chars.get(EEG[i]).send(packet(65535));
  m.chars.get(EEG[0]).send(packet(0));
  assert.equal(m.provider.drop, 0);
  m.chars.get(EEG[0]).send(packet(3));
  assert.equal(m.provider.drop, 2);
  m.chars.get(EEG[0]).send(packet(3));
  assert.equal(m.provider.drop, 2);
  m.advance(40);
  assert.ok(
    messages.some(
      (e) => e.type === "frame" && e.replace && e.channels.length === 4,
    ),
  );
  m.provider.setPaused(true);
  const count = messages.length;
  m.chars.get(EEG[1]).send(packet(0, 2400));
  m.advance(40);
  assert.equal(messages.length, count);
  m.provider.disconnect();
  assert.equal(m.device.gatt.connected, false);
  assert.equal(m.frames.size, 0);
  m.chars.get(EEG[0]).send(packet(4));
  assert.equal(m.provider.channels[0].length, 0);
});
test("unexpected loss reports disconnection and missing streams time out", async () => {
  const m = mock(),
    messages = [];
  m.provider.subscribe((e) => messages.push(e));
  await m.provider.connect();
  m.advance(5100);
  assert.equal(m.provider.connected, false);
  assert.equal(messages.at(-1).status, "disconnected");
});
test("cancelled selection and failed notification subscription clean up", async () => {
  const p = new MuseProvider({
    bluetooth: {
      requestDevice: async () => {
        throw new Error("cancelled");
      },
    },
  });
  await assert.rejects(p.connect(), /cancelled/);
  const m = mock();
  m.chars.get(EEG[2]).startNotifications = async () => {
    throw new Error("subscribe failed");
  };
  await assert.rejects(m.provider.connect(), /subscribe failed/);
  assert.equal(m.device.gatt.connected, false);
  assert.equal(m.provider.subscriptions.length, 0);
});
test("unsupported browsers reject clearly", async () => {
  await assert.rejects(
    new MuseProvider({ bluetooth: null }).connect(),
    /Web Bluetooth requires/,
  );
});
