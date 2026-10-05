import { readFile, writeFile, mkdir } from "node:fs/promises";
import { render } from "../.prerender/entry-server.js";
const template = await readFile("dist/index.html", "utf8");
const pages = [
  [
    "/",
    "NerveNewt — Real-time biosignal events for your app",
    "Turn live EEG into app actions. Try the no-signup Muse 2 simulator, explore the Web Bluetooth prototype, and read the source-level event API.",
  ],
  [
    "/docs/",
    "NerveNewt Docs — Quick start and browser event API",
    "Run the simulator, connect a Muse 2, and handle blink and alpha events. Honest hardware status, source-level API reference, and prototype limitations.",
  ],
];
for (const [path, title, description] of pages) {
  const canonical = "https://www.nervenewt.com" + path;
  const meta = `<link rel="canonical" href="${canonical}" />\n<meta property="og:type" content="website" />\n<meta property="og:site_name" content="NerveNewt" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:url" content="${canonical}" />\n<meta property="og:image" content="https://www.nervenewt.com/social-card.png" />\n<meta property="og:image:width" content="1200" />\n<meta property="og:image:height" content="630" />\n<meta property="og:image:alt" content="NerveNewt: Live signals. Real app actions." />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${description}" />\n<meta name="twitter:image" content="https://www.nervenewt.com/social-card.png" />`;
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace("</head>", meta + "\n</head>")
    .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`);
  const directory = path === "/" ? "dist" : "dist/docs";
  await mkdir(directory, { recursive: true });
  await writeFile(directory + "/index.html", html);
}
await writeFile(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\nSitemap: https://www.nervenewt.com/sitemap.xml\n",
);
await writeFile(
  "dist/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    pages
      .map(([path]) => `<url><loc>https://www.nervenewt.com${path}</loc></url>`)
      .join("") +
    "</urlset>",
);
console.log("Prerendered / and /docs/ with social metadata.");
