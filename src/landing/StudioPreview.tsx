import { motion, useReducedMotion } from "motion/react";

const NODES = [
  { kind: "Input", title: "EEG Input", detail: "Muse 2 · 4 ch · 256 Hz" },
  { kind: "Process", title: "Filter", detail: "Band-pass 0.5–10 Hz" },
  { kind: "Detect", title: "Blink Detection", detail: "Frontal channels" },
  { kind: "Action", title: "App Action", detail: "game.jump()" },
] as const;

/* Deterministic, periodic illustrative trace: low-amplitude noise plus three blink-shaped deflections. */
const W = 1200;
const H = 120;
const BLINKS = [250, 640, 1000];
function trace() {
  let d = "";
  for (let x = 0; x <= W; x += 4) {
    const t = (x / W) * Math.PI * 2;
    let y = Math.sin(t * 9) * 3 + Math.sin(t * 23 + 1.3) * 2.2 + Math.sin(t * 41 + 0.4) * 1.4;
    for (const b of BLINKS) y -= 46 * Math.exp(-((x - b) ** 2) / (2 * 14 ** 2));
    d += `${x === 0 ? "M" : "L"}${x},${(H * 0.62 + y).toFixed(1)}`;
  }
  return d;
}
const PATH = trace();

function Connector({ index }: { index: number }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative flex h-6 w-full items-center justify-center md:h-auto md:w-10 md:self-stretch">
      <div className="h-full w-px bg-white/15 md:h-px md:w-full" />
      {!reduce &&
        (["x", "y"] as const).map((axis) => (
          <motion.span
            key={axis}
            className={`absolute h-1.5 w-1.5 rounded-full bg-orange shadow-[0_0_10px_2px_rgba(241,107,50,0.55)] ${
              axis === "x" ? "hidden md:block" : "md:hidden"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0], [axis]: axis === "x" ? ["-16px", "16px"] : ["-10px", "10px"] }}
            transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 1.9, delay: 0.5 + index * 0.35, ease: "easeInOut" }}
          />
        ))}
    </div>
  );
}

export function StudioPreview() {
  return (
    <figure aria-labelledby="preview-caption" className="m-0">
      <div className="overflow-hidden rounded-2xl bg-ink text-paper shadow-[0_30px_80px_-30px_rgba(20,32,42,0.45)] ring-1 ring-ink/10">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div aria-hidden className="flex shrink-0 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>
            <span className="truncate font-mono text-[12px] text-white/60">NerveNewt Studio · blink-to-jump</span>
          </div>
          <span className="shrink-0 rounded-full border border-orange/50 px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-orange uppercase">
            Concept preview
          </span>
        </div>

        <div className="bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px] px-4 py-8 sm:px-8 sm:py-12">
          <ol aria-label="Example workflow" className="flex flex-col items-stretch md:flex-row">
            {NODES.map((n, i) => (
              <li key={n.title} className="contents">
                <div className={`flex-1 rounded-xl border bg-ink-2 px-4 py-3.5 ${n.kind === "Action" ? "border-orange/60" : "border-white/10"}`}>
                  <p className="font-mono text-[10.5px] tracking-[0.12em] text-white/45 uppercase">
                    {String(i + 1).padStart(2, "0")} · {n.kind}
                  </p>
                  <p className="mt-1.5 text-[15px] font-medium tracking-[-0.01em] text-paper">{n.title}</p>
                  <p className={`mt-0.5 font-mono text-[12px] ${n.kind === "Action" ? "text-orange" : "text-white/55"}`}>{n.detail}</p>
                </div>
                {i < NODES.length - 1 && <Connector index={i} />}
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl border border-white/10 bg-black/15">
            <div className="flex items-center justify-between px-4 pt-3 font-mono text-[11px] text-white/45">
              <span>AF7 · filtered</span>
              <span>Illustrative signal</span>
            </div>
            <div className="relative h-[120px] overflow-hidden" aria-hidden>
              <svg viewBox={`0 0 ${W * 2} ${H}`} preserveAspectRatio="none" className="nn-scroll absolute inset-y-0 left-0 h-full w-[200%]">
                {[0, W].map((dx) => (
                  <g key={dx} transform={`translate(${dx} 0)`}>
                    <path d={PATH} fill="none" stroke="rgba(251,250,246,0.7)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    {BLINKS.map((b) => (
                      <line key={b} x1={b} x2={b} y1={8} y2={H} stroke="#f16b32" strokeOpacity="0.55" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
                    ))}
                  </g>
                ))}
              </svg>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-ink to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink to-transparent" />
            </div>
            <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/55">
              <span aria-hidden className="w-3 border-t border-dashed border-orange" />
              detected blink → game.jump()
            </div>
          </div>
        </div>
      </div>
      <figcaption id="preview-caption" className="mt-4 text-[13px] text-muted">
        Concept preview of NerveNewt Studio. Illustrative only: not a live demo and not connected to a device.
      </figcaption>
    </figure>
  );
}
