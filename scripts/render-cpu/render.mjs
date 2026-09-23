/**
 * Renders the CPU scene (scene.html) to PNG frames with headless Chrome.
 *
 *   node scripts/render-cpu/render.mjs --out <dir> [--mode desktop|mobile]
 *        [--frames 300] [--samples 4] [--at 0,0.25,0.5]
 *        (--at renders only those t values)
 *
 * Frames are rendered at 2× the published size (2560×1440 landscape,
 * 1440×2560 portrait) and downscaled by encode.sh, which is what gives the
 * sequence its clean anti-aliasing.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const mode = arg("mode", "desktop");
const frames = Number(arg("frames", mode === "desktop" ? 300 : 200));
// Sub-frame samples per frame for motion blur (see renderFrame in scene.js).
const samples = Number(arg("samples", 4));
const out = path.resolve(arg("out", ""));
const at = arg("at", "");
if (!out) throw new Error("--out <dir> is required");
fs.mkdirSync(out, { recursive: true });

const [W, H] = mode === "desktop" ? [2560, 1440] : [1440, 2560];
const chrome =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

// Minimal static server over the project root (scene.html imports three
// straight from node_modules through an import map).
const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript" };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--ignore-gpu-blocklist", "--enable-gpu-rasterization"],
});
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.error("page error:", e.message));
  page.on("console", (m) => m.type() === "error" && console.error("console:", m.text()));
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${port}/scripts/render-cpu/scene.html?mode=${mode}`);
  await page.waitForFunction("window.__ready === true", { timeout: 60000 });

  const list = at
    ? at.split(",").map(Number)
    : Array.from({ length: frames }, (_, i) => i / (frames - 1));
  const started = Date.now();
  // Each frame's shutter spans exactly its own slice of the timeline.
  const span = at ? 0 : 1 / (frames - 1);
  for (const [i, t] of list.entries()) {
    await page.evaluate(
      (t, span, samples) =>
        new Promise((r) => {
          window.renderFrame(t, span, samples);
          requestAnimationFrame(() => r());
        }),
      t,
      span,
      samples,
    );
    const name = at ? `t${t.toFixed(3)}.png` : `${String(i).padStart(4, "0")}.png`;
    await page.screenshot({ path: path.join(out, name), type: "png" });
    if (i % 25 === 0) console.log(`${mode}: ${i + 1}/${list.length}`);
  }
  console.log(`${mode}: ${list.length} frames in ${((Date.now() - started) / 1000).toFixed(0)}s → ${out}`);
} finally {
  await browser.close();
  server.close();
}
