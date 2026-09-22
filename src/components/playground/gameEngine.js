export const FIELD = {
  width: 480,
  height: 320,
  floor: 296,
  playerX: 112,
  radius: 11,
  pipeWidth: 42,
  gap: 158,
};

export function createGame({ demo = false } = {}) {
  return {
    status: demo ? "playing" : "ready",
    demo,
    y: 148,
    velocity: 0,
    score: 0,
    elapsed: 0,
    boost: 0,
    purple: false,
    sound: 0,
    shots: [],
    pipes: [
      { x: 400, center: 143, passed: false },
      { x: 650, center: 167, passed: false },
    ],
  };
}

export function applyAction(previous, action) {
  const game = previous.status === "over" ? createGame() : { ...previous };
  // Non-flight actions can be previewed before starting a run.
  if (action === "jump" || action === "boost" || action === "move_up") {
    game.status = "playing";
    game.velocity = action === "move_up" ? -105 : -145;
    if (action === "boost") game.boost = 1.2;
    if (action === "move_up") game.y = Math.max(25, game.y - 22);
  }
  if (action === "change_color") game.purple = !game.purple;
  if (action === "shoot")
    game.shots = [...game.shots, { x: FIELD.playerX + 25, y: game.y }];
  if (action === "play_sound") game.sound = 0.7;
  return game;
}

export function stepGame(previous, dt) {
  if (
    previous.status !== "playing" &&
    previous.sound === 0 &&
    previous.shots.length === 0
  )
    return previous;
  // Clamp stalls so a background tab cannot skip an entire obstacle on return.
  dt = Math.min(Math.max(dt, 0), 0.035);
  const game = {
    ...previous,
    sound: Math.max(0, previous.sound - dt),
    shots: previous.shots
      .map((shot) => ({ ...shot, x: shot.x + 290 * dt }))
      .filter((shot) => shot.x < FIELD.width),
  };
  if (game.status !== "playing") return game;
  game.elapsed += dt;
  game.boost = Math.max(0, game.boost - dt);
  // The self-running preview glides back to its flight path between signal impulses.
  // Manual mode retains gravity and collisions for isolated game tests.
  game.velocity += game.demo
    ? ((172 - game.y) * 4 - game.velocity * 2) * dt
    : 255 * dt;
  game.y += game.velocity * dt;
  const speed = game.boost > 0 ? 112 : 75;
  game.pipes = previous.pipes.map((pipe) => {
    const next = { ...pipe, x: pipe.x - speed * dt };
    if (next.x < -FIELD.pipeWidth) {
      next.x += 500;
      next.center = 148 + Math.sin(game.elapsed * 0.7) * 35;
      next.passed = false;
    }
    if (
      !next.passed &&
      next.x + FIELD.pipeWidth < FIELD.playerX - FIELD.radius
    ) {
      next.passed = true;
      game.score++;
    }
    return next;
  });
  const hitsPipe = game.pipes.some(
    (pipe) =>
      FIELD.playerX + FIELD.radius > pipe.x &&
      FIELD.playerX - FIELD.radius < pipe.x + FIELD.pipeWidth &&
      (game.y - FIELD.radius < pipe.center - FIELD.gap / 2 ||
        game.y + FIELD.radius > pipe.center + FIELD.gap / 2),
  );
  if (
    !game.demo &&
    (hitsPipe ||
      game.y + FIELD.radius >= FIELD.floor ||
      game.y - FIELD.radius <= 0)
  ) {
    game.status = "over";
    game.y = Math.max(
      FIELD.radius,
      Math.min(FIELD.floor - FIELD.radius, game.y),
    );
  }
  return game;
}
