import { Container, Logo, focusRing } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <Logo />
          <p className="text-[14px] text-muted">Building the interface between biology and software.</p>
        </div>
        <div className="flex items-center gap-6 text-[14px] text-muted">
          <a href="/docs/" className={`rounded hover:text-ink ${focusRing}`}>
            Docs
          </a>
          <a href="https://github.com/sarthakjena05/nervenewt" className={`rounded hover:text-ink ${focusRing}`}>
            GitHub
          </a>
          <span>© 2026 NerveNewt</span>
        </div>
      </Container>
    </footer>
  );
}
