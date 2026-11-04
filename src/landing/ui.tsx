import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1120px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[12px] font-medium tracking-[0.14em] text-orange-ink uppercase">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  id: string;
}) {
  return (
    <div className="max-w-[640px]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-4 text-[32px] leading-[1.08] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[44px]">
        {title}
      </h2>
      {intro && <p className="mt-4 text-[17px] leading-relaxed text-pretty text-muted">{intro}</p>}
    </div>
  );
}

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export function PrimaryButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={`inline-flex h-11 items-center gap-2 rounded-full bg-orange px-5 text-[15px] font-semibold text-ink transition-colors hover:bg-[#f5814f] ${focusRing} ${className}`}
    >
      {children}
    </a>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img src="/nervenewt-icon.png" alt="" width={28} height={28} className="h-7 w-7" />
      <span className="text-[16px] font-semibold tracking-[-0.02em] text-ink">NerveNewt</span>
    </span>
  );
}

export function StatusDot({ tone }: { tone: "live" | "planned" | "exploring" }) {
  const cls = tone === "live" ? "bg-orange" : tone === "planned" ? "border border-subtle bg-transparent" : "border border-dashed border-subtle bg-transparent";
  return <span aria-hidden className={`inline-block h-2 w-2 shrink-0 rounded-full ${cls}`} />;
}
