import { Container, SectionHeading, StatusPill } from "./ui";

type Tone = "live" | "planned" | "exploring";
const SIGNALS: { name: string; full: string; use: string; status: string; tone: Tone }[] = [
  { name: "EEG", full: "Brain activity", use: "Blinks, eye state, attention-style rhythms", status: "In development · Muse 2", tone: "live" },
  { name: "ECG", full: "Heart activity", use: "Heart rate and heart-rate variability", status: "Planned", tone: "planned" },
  { name: "EMG", full: "Muscle activity", use: "Muscle activation and gestures", status: "Planned", tone: "planned" },
  { name: "More", full: "EDA, PPG, IMU", use: "Arousal, pulse and motion", status: "Exploring", tone: "exploring" },
];

export function Signals() {
  return (
    <section id="signals" aria-labelledby="signals-title" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="signals-title"
          eyebrow="Signal types"
          title="One workflow model for every body signal."
          intro="We're starting with EEG on the Muse 2 and expanding from there. Here is exactly where each signal stands."
        />
        <ul className="mx-auto mt-16 grid max-w-[1000px] grid-cols-2 gap-x-6 gap-y-12 text-center md:grid-cols-4">
          {SIGNALS.map((s) => (
            <li key={s.name} className="flex flex-col items-center">
              <p className={`text-[30px] font-semibold tracking-[-0.03em] ${s.tone === "live" ? "text-ink" : "text-ink/45"}`}>{s.name}</p>
              <p className="mt-1 text-[13px] text-subtle">{s.full}</p>
              <p className="mt-3 max-w-[200px] text-[14.5px] leading-snug text-muted">{s.use}</p>
              <div className="mt-4">
                <StatusPill tone={s.tone}>{s.status}</StatusPill>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
