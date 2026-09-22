import React, { useState } from "react";
export default function DeveloperAccess() {
  const [state, setState] = useState("idle"),
    [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({
        error: "Signup is temporarily unavailable. Please try again later.",
      }));
      if (!response.ok)
        throw new Error(
          result.error || "Could not save your request. Please try again.",
        );
      setState("success");
      form.reset();
    } catch (error) {
      setError(error.message);
      setState("idle");
    }
  }
  return (
    <section
      className="developer-access section"
      id="developer-access"
      aria-labelledby="access-title"
    >
      <div className="access-heading">
        <div className="eyebrow">BUILD WITH NERVENEWT</div>
        <h2 id="access-title">Get developer access.</h2>
        <p>
          Tell us what you’re building and which hardware you use. Help shape
          the next integration.
        </p>
      </div>
      {state === "success" ? (
        <div className="access-success" role="status">
          <h3>You’re on the list.</h3>
          <p>Your hardware and project preferences have been saved.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="access-form">
          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              maxLength={254}
              required
            />
          </label>
          <label>
            Primary hardware
            <input
              name="hardware"
              placeholder="Muse 2, EMG wristband, Polar H10…"
              maxLength={120}
              required
            />
          </label>
          <label>
            Project type
            <select name="projectType" defaultValue="" required>
              <option value="" disabled>
                Select your project
              </option>
              {[
                "Gaming",
                "Accessibility",
                "Research",
                "XR",
                "Health & Wellness",
                "Other",
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <div className="access-trap" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <button className="button primary" disabled={state === "sending"}>
            {state === "sending" ? "Saving…" : "Join developer waitlist"}
          </button>
          <p className="access-privacy">
            We’ll use these details to contact you about developer access and
            relevant hardware integrations. No EEG data is submitted.
          </p>
          {error && (
            <p className="access-error" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
