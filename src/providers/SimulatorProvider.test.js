import test from "node:test";
import assert from "node:assert/strict";
import { SimulatorProvider } from "./SimulatorProvider.js";

test("stream supplies four distinct dense EEG channels at 256 samples per second", () => {
  const provider = new SimulatorProvider({ autoplay: true });
  const channels = [[], [], [], []];
  provider.subscribe((frame) => {
    if (frame.type === "frame")
      frame.channels.forEach((values, index) =>
        channels[index].push(...values),
      );
  });
  for (let i = 0; i < 75; i++) provider.tick();
  for (const channel of channels) {
    assert.equal(channel.length, 768);
    assert.ok(channel.every(Number.isFinite));
    assert.ok(Math.max(...channel) > 10);
    assert.ok(Math.min(...channel) < -10);
  }
  assert.notDeepEqual(channels[0], channels[1]);
  assert.notDeepEqual(channels[2], channels[3]);
});

test("closed eyes raise alpha and emit once; open eyes rearm the detector", () => {
  const provider = new SimulatorProvider();
  const messages = [];
  provider.subscribe((message) => messages.push(message));
  const ticks = () => {
    for (let i = 0; i < 60; i++) provider.tick();
  };
  ticks();
  assert.ok(Math.abs(provider.alpha - 0.32) < 0.001);
  provider.setEyesClosed(true);
  ticks();
  assert.ok(provider.alpha > 0.85);
  assert.equal(messages.filter((m) => m.name === "eyes_closed").length, 1);
  ticks();
  assert.equal(messages.filter((m) => m.name === "eyes_closed").length, 1);
  provider.setEyesClosed(false);
  ticks();
  assert.ok(provider.alpha < 0.33);
  assert.equal(messages.filter((m) => m.name === "eyes_open").length, 1);
  provider.setEyesClosed(true);
  ticks();
  assert.equal(messages.filter((m) => m.name === "eyes_closed").length, 2);
  const frames = messages.filter((m) => m.type === "frame");
  assert.ok(
    frames.every(
      (m) => Number.isFinite(m.sample) && m.alpha >= 0 && m.alpha <= 1,
    ),
  );
});

test("connect is idempotent; disconnect stops frames; subscriptions clean up", async () => {
  const provider = new SimulatorProvider();
  const messages = [];
  const unsubscribe = provider.subscribe((message) => messages.push(message));
  try {
    provider.connect();
    const timer = provider.timer;
    provider.connect();
    assert.equal(provider.timer, timer);
    await new Promise((resolve) => setTimeout(resolve, 130));
    assert.ok(messages.some((m) => m.type === "frame"));
    provider.disconnect();
    const count = messages.length;
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(messages.length, count);
    assert.equal(provider.alpha, 0.32);
    unsubscribe();
    provider.tick();
    assert.equal(messages.length, count);
    assert.equal(provider.listeners.size, 0);
  } finally {
    provider.disconnect();
  }
});
