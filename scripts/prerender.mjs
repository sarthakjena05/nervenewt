import { readFile, writeFile, mkdir } from "node:fs/promises";
import { render } from "../.prerender/entry-server.js";
const template = await readFile("dist/index.html", "utf8");
const urlFor = (path) =>
  path === "/docs/" ? "https://docs.nervenewt.com/" : "https://www.nervenewt.com" + path;
const pages = [
  [
    "/",
    "NerveNewt — Build apps that respond to the human body",
    "Connect biosignal devices, build visual workflows, and turn live signals into actions in your apps. Request early access.",
  ],
  [
    "/docs/",
    "NerveNewt Docs — Quick start and browser event API",
    "Run the simulator, connect a Muse 2, and handle blink and alpha events. Honest hardware status, source-level API reference, and prototype limitations.",
  ],
  [
    "/demo/",
    "NerveNewt Demo — Muse 2 prototype and browser simulator",
    "Try the NerveNewt browser simulator or connect a Muse 2 over Web Bluetooth to see blink events drive a small game.",
  ],
];
for (const [path, title, description] of pages) {
  const canonical = urlFor(path);
  const meta = `<link rel="canonical" href="${canonical}" />\n<meta property="og:type" content="website" />\n<meta property="og:site_name" content="NerveNewt" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:url" content="${canonical}" />\n<meta property="og:image" content="https://www.nervenewt.com/social-card.png" />\n<meta property="og:image:width" content="1200" />\n<meta property="og:image:height" content="630" />\n<meta property="og:image:alt" content="NerveNewt: Build apps that respond to the human body." />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${description}" />\n<meta name="twitter:image" content="https://www.nervenewt.com/social-card.png" />`;
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace("</head>", meta + "\n</head>")
    .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`);
  const directory = path === "/" ? "dist" : "dist" + path.slice(0, -1);
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
      .map(([path]) => `<url><loc>${urlFor(path)}</loc></url>`)
      .join("") +
    "</urlset>",
);
console.log("Prerendered /, /docs/ and /demo/ with social metadata.");
