import test from "node:test";
import assert from "node:assert/strict";
import { FIELD, createGame, applyAction, stepGame } from "./gameEngine.js";
import { SimulatorProvider } from "../../providers/SimulatorProvider.js";

test("autoplay EEG repeatedly flaps and scores without user input", () => {
  const provider = new SimulatorProvider({ autoplay: true });
  let game = createGame({ demo: true });
  let pulses = 0;
  let pending = Infinity;
  let minAlpha = 1;
  let maxAlpha = 0;
  provider.subscribe((message) => {
    if (message.type === "frame") {
      minAlpha = Math.min(minAlpha, message.alpha);
      maxAlpha = Math.max(maxAlpha, message.alpha);
    }
    if (message.name === "eyes_closed") {
      pulses++;
      pending = 0.35;
    }
  });
  for (let i = 0; i < 1500; i++) {
    if (i % 2 === 0) provider.tick();
    pending -= 0.02;
    if (pending <= 0) {
      game = applyAction(game, "jump");
      assert.equal(game.velocity, -145);
      pending = Infinity;
    }
    game = stepGame(game, 0.02);
    assert.ok(game.y > FIELD.radius && game.y < FIELD.floor - FIELD.radius);
  }
  assert.ok(pulses >= 24);
  assert.ok(minAlpha < 0.45 && maxAlpha > 0.65);
  assert.equal(game.status, "playing");
  assert.ok(game.score > 5);
});

test("waiting game stays still; flap starts flight and gravity eventually ends it", () => {
  let game = createGame();
  assert.equal(stepGame(game, 0.02).y, game.y);
  game = applyAction(game, "jump");
  assert.equal(game.status, "playing");
  assert.ok(stepGame(game, 0.02).y < game.y);
  for (let i = 0; i < 200; i++) game = stepGame(game, 0.02);
  assert.equal(game.status, "over");
  game = applyAction(game, "jump");
  assert.equal(game.status, "playing");
  assert.equal(game.score, 0);
});

test("pipes collide outside the gap and score once after a safe pass", () => {
  const base = { ...createGame(), status: "playing", velocity: 0 };
  const collision = stepGame(
    {
      ...base,
      y: 25,
      pipes: [{ x: FIELD.playerX, center: 155, passed: false }],
    },
    0.01,
  );
  assert.equal(collision.status, "over");
  const safe = {
    ...base,
    pipes: [
      {
        x: FIELD.playerX - FIELD.pipeWidth - FIELD.radius + 0.5,
        center: 148,
        passed: false,
      },
    ],
  };
  const scored = stepGame(safe, 0.02);
  assert.equal(scored.score, 1);
  assert.equal(scored.status, "playing");
  assert.equal(stepGame(scored, 0.02).score, 1);
});

test("alternative actions have distinct effects without mutating previous state", () => {
  const base = createGame();
  assert.equal(applyAction(base, "change_color").purple, true);
  assert.equal(base.purple, false);
  assert.equal(applyAction(base, "shoot").shots.length, 1);
  assert.equal(base.shots.length, 0);
  assert.ok(applyAction(base, "play_sound").sound > 0);
  assert.ok(applyAction(base, "boost").boost > 0);
  assert.ok(applyAction(base, "move_up").y < base.y);
});
