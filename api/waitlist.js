const TYPES = new Set([
  "Gaming",
  "Accessibility",
  "Research",
  "XR",
  "Health & Wellness",
  "Other",
]);
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST." });
  }
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host)
        return res.status(403).json({ error: "Invalid request origin." });
    } catch {
      return res.status(403).json({ error: "Invalid request origin." });
    }
  }
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid request." });
  }
  if (!body || typeof body !== "object")
    return res.status(400).json({ error: "Invalid request." });
  if (body.website)
    return res.status(400).json({ error: "Unable to accept this submission." });
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const hardware =
    typeof body.hardware === "string" ? body.hardware.trim() : "";
  const emailOnly = body.signupType === "early-access";
  if (
    email.length > 254 ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    (!emailOnly && !hardware) ||
    hardware.length > 120 ||
    (!emailOnly && !TYPES.has(body.projectType))
  )
    return res
      .status(400)
      .json({ error: "Enter a valid email, hardware, and project type." });
  if (process.env.RESEND_API_KEY && process.env.WAITLIST_FROM) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: process.env.WAITLIST_FROM,
          to: ["sarthak@nervenewt.com", "taban@nervenewt.com"],
          subject: "New NerveNewt early-access request",
          reply_to: email,
          text: [
            "Email: " + email,
            "Hardware: " + (hardware || "Not specified"),
            "Project: " +
              (TYPES.has(body.projectType)
                ? body.projectType
                : "Not specified"),
          ].join("\n"),
        }),
        signal: AbortSignal.timeout(8000),
        redirect: "error",
      });
      if (!response.ok) throw new Error("Email service unavailable");
      return res.status(201).json({ ok: true });
    } catch {
      return res
        .status(502)
        .json({ error: "Could not send your request. Please try again." });
    }
  }
  const endpoint = process.env.WAITLIST_WEBHOOK_URL;
  if (!endpoint)
    return res.status(503).json({
      error: "Developer signup is not available yet. Please try again later.",
    });
  try {
    if (new URL(endpoint).protocol !== "https:")
      throw new Error("Invalid endpoint");
    const headers = { "Content-Type": "application/json" };
    if (process.env.WAITLIST_WEBHOOK_TOKEN)
      headers.Authorization = `Bearer ${process.env.WAITLIST_WEBHOOK_TOKEN}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        hardware,
        projectType: TYPES.has(body.projectType) ? body.projectType : null,
        source: "nervenewt-developer-access",
        createdAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("Storage unavailable");
    return res.status(201).json({ ok: true });
  } catch {
    return res
      .status(502)
      .json({ error: "Could not save your request. Please try again." });
  }
}
