import React, { useState } from "react";
export default function EarlyAccess() {
  const [status, setStatus] = useState("idle"),
    [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, signupType: "early-access" }),
      });
      const data = await response
        .json()
        .catch(() => ({
          error: "Signup is temporarily unavailable. Please try again later.",
        }));
      if (!response.ok) throw new Error(data.error || "Please try again.");
      setStatus("success");
      form.reset();
    } catch (error) {
      setError(error.message);
      setStatus("idle");
    }
  }
  return (
    <div className="early-access">
      {status === "success" ? (
        <p role="status">Thanks! Your early-access request is in.</p>
      ) : (
        <form onSubmit={submit}>
          <label className="sr-only" htmlFor="hero-email">
            Email address
          </label>
          <input
            id="hero-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email…"
            maxLength={254}
            required
          />
          <div className="access-trap" aria-hidden="true">
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-label="Website"
            />
          </div>
          <button className="button primary" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Get Early Access"}
          </button>
        </form>
      )}
      {error && (
        <p className="access-error" role="alert">
          {error}
        </p>
      )}
      <small>Updates about early access. No biosignal data shared.</small>
    </div>
  );
}
