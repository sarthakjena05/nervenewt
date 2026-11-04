import { Container, SectionHeading } from "./ui";

const SIGNALS = [
  { name: "EEG", full: "Brain activity", devices: ["Headsets", "Headbands", "Earbuds"] },
  { name: "ECG", full: "Heart activity", devices: ["Smartwatches", "Chest straps", "Patches"] },
  { name: "EMG", full: "Muscle activity", devices: ["Armbands", "Wristbands", "Sleeves"] },
  { name: "PPG & more", full: "Pulse, skin, motion", devices: ["Smart rings", "Fitness bands", "Watches"] },
];

export function Signals() {
  return (
    <section id="signals" aria-labelledby="signals-title" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading id="signals-title" eyebrow="Signal types" title="One workflow model for every body signal." />
        <ul className="mx-auto mt-16 grid max-w-[1000px] grid-cols-2 gap-x-6 gap-y-12 text-center md:grid-cols-4">
          {SIGNALS.map((s) => (
            <li key={s.name} className="flex flex-col items-center">
              <p className="text-[30px] font-semibold tracking-[-0.03em] text-ink">{s.name}</p>
              <p className="mt-1 text-[14px] text-subtle">{s.full}</p>
              <ul className="mt-4 space-y-1 text-[15px] text-muted">
                {s.devices.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
