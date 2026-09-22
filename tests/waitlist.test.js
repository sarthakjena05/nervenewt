import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/waitlist.js";
function response() {
  return {
    code: 0,
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.code = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}
const valid = {
  email: "Developer@Example.com",
  hardware: "Muse 2",
  projectType: "Accessibility",
};
const request = (body) => ({
  method: "POST",
  headers: { origin: "https://www.nervenewt.com", host: "www.nervenewt.com" },
  body,
});
test("reject invalid fields, bot honeypot and foreign origin", async () => {
  for (const body of [
    { ...valid, email: "bad" },
    { ...valid, hardware: "" },
    { ...valid, projectType: "Unknown" },
    { ...valid, projectType: "" },
    { ...valid, website: "bot" },
  ]) {
    const r = response();
    await handler(request(body), r);
    assert.equal(r.code, 400);
  }
  const r = response();
  await handler(
    {
      ...request(valid),
      headers: { origin: "https://other.example", host: "www.nervenewt.com" },
    },
    r,
  );
  assert.equal(r.code, 403);
});
test("missing storage never claims success", async () => {
  delete process.env.WAITLIST_WEBHOOK_URL;
  const r = response();
  await handler(request(valid), r);
  assert.equal(r.code, 503);
});
test("success follows durable endpoint acknowledgement; failures remain retryable", async () => {
  const original = globalThis.fetch;
  process.env.WAITLIST_WEBHOOK_URL = "https://storage.example/waitlist";
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, process.env.WAITLIST_WEBHOOK_URL);
      const body = JSON.parse(options.body);
      assert.equal(body.email, "developer@example.com");
      assert.equal(body.hardware, "Muse 2");
      assert.equal(body.projectType, "Accessibility");
      return { ok: true };
    };
    let r = response();
    await handler(request(valid), r);
    assert.equal(r.code, 201);
    globalThis.fetch = async () => ({ ok: false });
    r = response();
    await handler(request(valid), r);
    assert.equal(r.code, 502);
  } finally {
    globalThis.fetch = original;
    delete process.env.WAITLIST_WEBHOOK_URL;
  }
});

test("new project types pass validation and reach storage unchanged", async () => {
  const original = globalThis.fetch;
  const endpoint = process.env.WAITLIST_WEBHOOK_URL;
  process.env.WAITLIST_WEBHOOK_URL = "https://storage.example/waitlist";
  try {
    for (const projectType of ["Health & Wellness", "Other"]) {
      let received;
      globalThis.fetch = async (_url, options) => {
        received = JSON.parse(options.body);
        return { ok: true };
      };
      const r = response();
      await handler(request({ ...valid, projectType }), r);
      assert.equal(r.code, 201);
      assert.equal(received.projectType, projectType);
    }
  } finally {
    globalThis.fetch = original;
    if (endpoint === undefined) delete process.env.WAITLIST_WEBHOOK_URL;
    else process.env.WAITLIST_WEBHOOK_URL = endpoint;
  }
});

test("email-only signup sends notifications to both founders", async () => {
  const original = globalThis.fetch;
  process.env.RESEND_API_KEY = "test-key";
  process.env.WAITLIST_FROM = "verified@example.com";
  try {
    let message;
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      message = JSON.parse(options.body);
      return { ok: true };
    };
    let r = response();
    await handler(
      request({ email: valid.email, signupType: "early-access" }),
      r,
    );
    assert.equal(r.code, 201);
    assert.deepEqual(message.to, [
      "sarthak@nervenewt.com",
      "taban@nervenewt.com",
    ]);
    assert.equal(message.reply_to, "developer@example.com");
    globalThis.fetch = async () => ({ ok: false });
    r = response();
    await handler(
      request({ email: valid.email, signupType: "early-access" }),
      r,
    );
    assert.equal(r.code, 502);
  } finally {
    globalThis.fetch = original;
    delete process.env.RESEND_API_KEY;
    delete process.env.WAITLIST_FROM;
  }
});
