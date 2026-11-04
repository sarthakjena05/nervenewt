import { Container, PrimaryButton, focusRing } from "./ui";
import { StudioPreview } from "./StudioPreview";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
      <Container>
        <div className="max-w-[820px]">
          <p className="nn-rise inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-3 py-1 font-mono text-[12px] text-muted">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange" />
            Early access · Prototyping on Muse 2
          </p>
          <h1
            id="hero-title"
            className="nn-rise mt-6 text-[44px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-ink [animation-delay:60ms] sm:text-[68px] lg:text-[80px]"
          >
            Build apps that respond to the human body.
          </h1>
          <p className="nn-rise mt-6 max-w-[580px] text-[18px] leading-relaxed text-pretty text-muted [animation-delay:120ms] sm:text-[20px]">
            Connect biosignal devices. Build visual workflows. Turn live signals into actions in your apps.
          </p>
          <div className="nn-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 [animation-delay:180ms]">
            <PrimaryButton href="#early-access">
              Get early access
              <span aria-hidden>→</span>
            </PrimaryButton>
            <a href="/docs/" className={`rounded text-[15px] font-medium text-ink underline-offset-4 hover:underline ${focusRing}`}>
              Read the docs
            </a>
          </div>
        </div>
        <div className="nn-rise mt-16 [animation-delay:260ms] sm:mt-20">
          <StudioPreview />
        </div>
      </Container>
    </section>
  );
}
