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

const SNIPPET = `const stream = new MuseProvider();

stream.subscribe((event) => {
  if (event.name === "blink") game.jump();
});

await stream.connect();`;

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 border-t border-line py-24 sm:py-32">
      <Container>
        <SectionHeading id="how-title" eyebrow="How it works" title="From raw signal to app event in three steps." />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <ol className="space-y-10">
            {STEPS.map((s) => (
              <li key={s.n} className="grid grid-cols-[40px_1fr] gap-4">
                <span className="pt-0.5 font-mono text-[13px] text-orange-ink">{s.n}</span>
                <div>
                  <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">{s.title}</h3>
                  <p className="mt-2 max-w-[440px] text-[16px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="min-w-0 self-start overflow-hidden rounded-xl border border-line bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 font-mono text-[12px] text-muted">
              <span>app.js</span>
              <span>Prototype API · subject to change</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[13.5px] leading-[1.75] text-ink">
              <code>{SNIPPET}</code>
            </pre>
          </div>
        </div>
      </Container>
    </section>
  );
}
