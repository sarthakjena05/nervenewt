import { useEffect, useState } from "react";
import { Container, Logo, focusRing } from "./ui";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#signals", label: "Signals" },
  { href: "#applications", label: "Applications" },
  { href: "/docs/", label: "Docs" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "border-line bg-paper/85 backdrop-blur-md" : "border-transparent bg-paper/0"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" aria-label="NerveNewt home" className={`rounded-md ${focusRing}`}>
          <Logo />
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`rounded text-[14px] text-muted transition-colors hover:text-ink ${focusRing}`}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href="/docs/" className={`rounded text-[14px] text-muted hover:text-ink md:hidden ${focusRing}`}>
            Docs
          </a>
          <a
            href="#early-access"
            className={`inline-flex h-9 items-center rounded-full bg-ink px-4 text-[14px] font-medium text-paper transition-colors hover:bg-ink-2 ${focusRing}`}
          >
            Get early access
          </a>
        </div>
      </Container>
    </header>
  );
}
