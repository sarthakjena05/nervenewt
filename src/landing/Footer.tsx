import { Container, DOCS_URL, Logo, focusRing } from "./ui";

export function Footer() {
  return (
    <footer className="py-14">
      <Container className="flex flex-col items-center gap-4 text-center">
        <Logo />
        <p className="text-[14px] text-muted">Building the interface between biology and software.</p>
        <div className="flex items-center gap-6 text-[14px] text-muted">
          <a href={DOCS_URL} className={`rounded hover:text-ink ${focusRing}`}>
            Docs
          </a>
          <a href="https://github.com/sarthakjena05/nervenewt" className={`rounded hover:text-ink ${focusRing}`}>
            GitHub
          </a>
        </div>
        <p className="text-[13px] text-subtle">© 2026 NerveNewt</p>
      </Container>
    </footer>
  );
}
