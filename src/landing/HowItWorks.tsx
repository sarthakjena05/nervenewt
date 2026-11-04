import { Container, SectionHeading } from "./ui";

const STEPS = [
  {
    n: "01",
    title: "Connect a device",
    body: "Pair a supported headset over Bluetooth. NerveNewt handles the stream, sampling and channel layout.",
  },
  {
    n: "02",
    title: "Build a workflow",
    body: "Chain blocks visually: input, filter, detect, act. Tune thresholds against your own live signal.",
  },
  {
    n: "03",
    title: "Integrate into your app",
    body: "Subscribe to clean, named events like blink in your code. No signal processing required.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading id="how-title" eyebrow="How it works" title="From raw signal to app event in three steps." />
        <ol className="mx-auto mt-16 grid max-w-[1000px] gap-12 text-center md:grid-cols-3 md:gap-10">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col items-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/12 font-mono text-[13px] font-medium text-orange-ink">
                {s.n}
              </span>
              <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.015em] text-ink">{s.title}</h3>
              <p className="mt-2 max-w-[300px] text-[15.5px] leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
