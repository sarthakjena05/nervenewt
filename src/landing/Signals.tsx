import { Container, SectionHeading, StatusDot } from "./ui";

type Tone = "live" | "planned" | "exploring";
const SIGNALS: { name: string; full: string; use: string; status: string; tone: Tone }[] = [
  { name: "EEG", full: "Electroencephalography", use: "Blinks, eye state, attention-style rhythms", status: "In development · Muse 2", tone: "live" },
  { name: "ECG", full: "Electrocardiography", use: "Heart rate and heart-rate variability", status: "Planned", tone: "planned" },
  { name: "EMG", full: "Electromyography", use: "Muscle activation and gestures", status: "Planned", tone: "planned" },
  { name: "More", full: "EDA, PPG, IMU", use: "Arousal, pulse and motion", status: "Exploring", tone: "exploring" },
];

export function Signals() {
  return (
    <section id="signals" aria-labelledby="signals-title" className="scroll-mt-20 border-t border-line py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="signals-title"
          eyebrow="Signal types"
          title="One workflow model for every body signal."
          intro="We're starting with EEG on the Muse 2 and expanding from there. Here is exactly where each signal stands."
        />
        <ul className="mt-12 border-t border-line">
          {SIGNALS.map((s) => (
            <li
              key={s.name}
              className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-b border-line py-6 sm:grid-cols-[140px_1fr_220px]"
            >
              <p className="text-[22px] font-semibold tracking-[-0.02em] text-ink">{s.name}</p>
              <p
                className={`inline-flex items-center gap-2 justify-self-end font-mono text-[12px] sm:order-last ${
                  s.tone === "live" ? "text-ink" : "text-muted"
                }`}
              >
                <StatusDot tone={s.tone} />
                {s.status}
              </p>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[13px] text-subtle">{s.full}</p>
                <p className="text-[15px] text-muted">{s.use}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[13px] text-subtle">
          Only EEG on Muse 2 is being built today. Planned signals have no committed release date.
        </p>
      </Container>
    </section>
  );
}
