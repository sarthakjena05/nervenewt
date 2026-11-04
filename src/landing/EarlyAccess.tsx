import { useState, type FormEvent } from "react";
import { Container, Eyebrow, focusRing } from "./ui";

// Must match TYPES in api/waitlist.js.
const TYPES = ["Gaming", "Accessibility", "Research", "XR", "Health & Wellness", "Other"];
type Status = "idle" | "sending" | "success";

const field =
  "h-11 w-full rounded-lg border border-line-2 bg-white px-3.5 text-[15px] text-ink placeholder:text-subtle transition-colors hover:border-subtle focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/40";

export function EarlyAccess() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const fields = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, signupType: "early-access" }),
      });
      const data = await response
        .json()
        .catch(() => ({ error: "Signup is temporarily unavailable. Please try again later." }));
      if (!response.ok) throw new Error(data.error || "Please try again.");
      form.reset();
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
      setStatus("idle");
    }
  }

  return (
    <section id="early-access" aria-labelledby="access-title" className="scroll-mt-20 bg-paper-2 py-24 sm:py-32">
      <Container>
        <div className="mx-auto flex max-w-[480px] flex-col items-stretch gap-10">
          <div className="text-center">
            <Eyebrow>Early access</Eyebrow>
            <h2 id="access-title" className="mt-4 text-[36px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[52px]">
              Build with us from the start.
            </h2>
            <p className="mx-auto mt-5 max-w-[440px] text-[17px] leading-relaxed text-muted">
              We're onboarding a small group of developers. Tell us what you'd build and we'll reach out as access opens.
            </p>
          </div>

          {status === "success" ? (
            <div role="status" className="rounded-xl bg-white p-6 text-center">
              <p className="text-[17px] font-semibold text-ink">You're on the list.</p>
              <p className="mt-2 text-[15px] text-muted">Thanks. We'll be in touch when early access opens.</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className={`mt-4 rounded text-[14px] font-medium text-ink underline underline-offset-4 ${focusRing}`}
              >
                Add another email
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="ea-email" className="mb-1.5 block text-[14px] font-medium text-ink">
                  Email
                </label>
                <input id="ea-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@company.com" className={field} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ea-hardware" className="mb-1.5 block text-[14px] font-medium text-ink">
                    Device <span className="font-normal text-subtle">(optional)</span>
                  </label>
                  <input id="ea-hardware" name="hardware" type="text" maxLength={120} placeholder="e.g. Muse 2" className={field} />
                </div>
                <div>
                  <label htmlFor="ea-type" className="mb-1.5 block text-[14px] font-medium text-ink">
                    Building for <span className="font-normal text-subtle">(optional)</span>
                  </label>
                  <select id="ea-type" name="projectType" defaultValue="" className={field}>
                    <option value="">Select…</option>
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="access-trap" aria-hidden="true">
                <input name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className={`inline-flex h-11 w-full items-center justify-center rounded-full bg-orange px-5 text-[15px] font-semibold text-paper transition-colors hover:bg-orange-ink disabled:opacity-60 ${focusRing}`}
              >
                {status === "sending" ? "Sending…" : "Get early access"}
              </button>
              {error && (
                <p role="alert" className="text-center text-[14px] text-[#b42318]">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
