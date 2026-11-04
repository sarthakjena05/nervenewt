import { Container, SectionHeading } from "./ui";

const APPS = [
  {
    label: "Health & wellness",
    title: "Software that notices how you're doing.",
    body: "Focus, rest and recovery apps that adapt to physiological signals instead of self-reported check-ins.",
  },
  {
    label: "Interactive gaming",
    title: "Play with a blink, a breath, a heartbeat.",
    body: "New input channels for games and experiences, alongside the controller rather than replacing it.",
  },
  {
    label: "Wearable software",
    title: "The app layer for next-generation wearables.",
    body: "As biosensing moves into headphones, glasses and bands, developers need a simple way to build on it.",
  },
];

export function Applications() {
  return (
    <section id="applications" aria-labelledby="apps-title" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading id="apps-title" eyebrow="Applications" title="What you could build." />
        <div className="mx-auto mt-16 grid max-w-[1000px] gap-12 text-center md:grid-cols-3 md:gap-10">
          {APPS.map((a) => (
            <div key={a.label} className="flex flex-col items-center">
              <p className="font-mono text-[12px] tracking-[0.1em] text-orange-ink uppercase">{a.label}</p>
              <h3 className="mt-3 max-w-[280px] text-[20px] leading-snug font-semibold tracking-[-0.02em] text-balance text-ink">{a.title}</h3>
              <p className="mt-3 max-w-[300px] text-[15.5px] leading-relaxed text-muted">{a.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
