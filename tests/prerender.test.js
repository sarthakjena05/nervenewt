import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
for (const [file, heading, url] of [
  ["dist/index.html", "Live signals.", "https://www.nervenewt.com/"],
  [
    "dist/docs/index.html",
    "From a signal to your first action.",
    "https://www.nervenewt.com/docs/",
  ],
]) {
  test(`${file} contains readable HTML and page-specific metadata`, async () => {
    const html = await readFile(file, "utf8");
    assert.ok(html.includes(heading));
    assert.match(html, /<h1[ >]/);
    assert.ok(!html.includes('<div id="root"></div>'));
    assert.ok(html.includes(`rel="canonical" href="${url}"`));
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /type="module"/);
  });
}
test("docs contain actual provider contract; homepage omits unconfirmed traction", async () => {
  const docs = await readFile("dist/docs/index.html", "utf8"),
    home = await readFile("dist/index.html", "utf8");
  assert.ok(docs.includes("MuseProvider"));
  assert.ok(docs.includes("eyes.closed"));
  assert.ok(docs.includes("physical-headband verification pending"));
  assert.ok(!home.includes("Signed Integration LOIs"));
  assert.ok(home.includes('href="/docs/"'));
});
test("crawler assets cover both routes", async () => {
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  assert.ok(sitemap.includes("https://www.nervenewt.com/docs/"));
  assert.match(await readFile("dist/robots.txt", "utf8"), /Sitemap:/);
  const png = await readFile("dist/social-card.png");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
