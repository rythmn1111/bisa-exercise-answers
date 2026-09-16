#!/usr/bin/env bun
/**
 * Render the whole Q&A site to a single PDF, with a working index.
 *
 * The index needs real page numbers, and page numbers are only known after
 * layout, so this renders twice:
 *
 *   pass 1  render /print (index shows em dashes) -> find every question's page
 *           by extracting the invisible `idxmark-…--` tokens with pdftotext
 *   pass 2  write .pagemap.json, re-render -> index now carries real pages
 *
 * The index sits at the BACK, and pass 1 already reserves its full length, so
 * filling in the numbers does not move any content page. The script verifies
 * that: it re-measures after pass 2 and re-renders again if anything shifted.
 *
 * Usage:
 *   bun run pdf
 *   bun run pdf --exclude session13
 *   bun run pdf --out ~/Desktop/answers.pdf
 *   bun run pdf --url http://localhost:3220     # reuse a running server
 */
import fs from "node:fs";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(import.meta.dir, "..");
const argv = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const PORT = Number(argOf("--port", "3220"));
const BASE = argOf("--url", `http://localhost:${PORT}`);
const EXCLUDE = argOf("--exclude", "");
const PAGEMAP = path.join(ROOT, ".pagemap.json");

const defaultName = EXCLUDE
  ? `BISA-Exercise-Answers-no-${EXCLUDE.replace(/[^a-z0-9]+/gi, "-")}.pdf`
  : "BISA-Exercise-Answers.pdf";
const OUT = path.resolve(argOf("--out", path.join(ROOT, defaultName)));

const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean).find((p) => fs.existsSync(p));

if (!CHROME) {
  console.error("No Chrome found. Set CHROME_PATH=/path/to/chrome");
  process.exit(1);
}

const HEADER = `<div style="width:100%;font-family:-apple-system,system-ui,sans-serif;font-size:7pt;color:#8a8a94;padding:0 15mm;display:flex;justify-content:space-between;"><span>Exercise Answers — Python, pandas, Matplotlib</span><span>Goa Institute of Management · BIFS 2026–27</span></div>`;
const FOOTER = `<div style="width:100%;font-family:-apple-system,system-ui,sans-serif;font-size:7pt;color:#8a8a94;padding:0 15mm;display:flex;justify-content:space-between;"><span class="date"></span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`;

async function isUp(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitFor(url, ms = 90000) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (await isUp(url)) return true;
    await new Promise((r) => setTimeout(r, 600));
  }
  return false;
}

/** Pull `idxmark-<kind>--<...>` tokens out of the rendered PDF, per page. */
function measure(pdfPath) {
  const text = execFileSync("pdftotext", ["-layout", pdfPath, "-"], {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  const pages = text.split("\f");
  const map = {};

  // Two patterns rather than one: set ids contain hyphens, so a single lazy
  // capture stops at the first "--" and loses the question number entirely.
  const SET = /idxmark-set--([A-Za-z0-9_-]+?)--/g;
  const Q = /idxmark-q--([A-Za-z0-9_-]+)--(Q[A-Za-z0-9]+)--/g;

  for (let i = 0; i < pages.length; i++) {
    const page = i + 1;
    for (const m of pages[i].matchAll(SET)) {
      const key = `set:${m[1]}`;
      if (map[key] === undefined) map[key] = page;
    }
    for (const m of pages[i].matchAll(Q)) {
      const key = `q:${m[1]}:${m[2]}`;
      if (map[key] === undefined) map[key] = page;
    }
  }
  return map;
}

let server = null;

try {
  if (await isUp(BASE)) {
    console.log(`Using the server already listening on ${BASE}`);
  } else {
    if (!fs.existsSync(path.join(ROOT, ".next", "BUILD_ID"))) {
      console.log("No production build found — running `next build` first…");
      await new Promise((resolve, reject) => {
        const b = spawn("bun", ["run", "build"], { cwd: ROOT, stdio: "inherit" });
        b.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`build exited ${code}`))));
      });
    }
    console.log(`Starting the production server on port ${PORT}…`);
    server = spawn("bunx", ["next", "start", "-p", String(PORT)], {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "inherit"],
    });
    if (!(await waitFor(BASE))) throw new Error("server did not come up");
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1240, height: 1754 });

  const url = `${BASE}/print${EXCLUDE ? `?exclude=${encodeURIComponent(EXCLUDE)}` : ""}`;

  async function render(target) {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 240000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    await page.emulateMediaType("print");
    await page.pdf({
      path: target,
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: HEADER,
      footerTemplate: FOOTER,
      margin: { top: "18mm", bottom: "19mm", left: "15mm", right: "15mm" },
      timeout: 240000,
    });
  }

  const probe = path.join(ROOT, ".pass1.pdf");

  // ---- pass 1: no page numbers, just to find where everything lands ----
  fs.rmSync(PAGEMAP, { force: true });
  console.log(`Pass 1 — rendering ${url} to locate every question…`);
  await render(probe);
  let map = measure(probe);
  console.log(`  found ${Object.keys(map).length} locators`);
  if (Object.keys(map).length === 0) throw new Error("no index locators found — is the print route emitting them?");

  // ---- pass 2: same layout, index filled in ----
  fs.writeFileSync(PAGEMAP, JSON.stringify(map, null, 0));
  console.log("Pass 2 — re-rendering with the index filled in…");
  await render(OUT);

  // ---- confirm the numbers we printed are the numbers that resulted ----
  const after = measure(OUT);
  const moved = Object.keys(map).filter((k) => map[k] !== after[k]);
  if (moved.length) {
    console.log(`  ${moved.length} item(s) shifted; rendering once more to settle…`);
    fs.writeFileSync(PAGEMAP, JSON.stringify(after, null, 0));
    await render(OUT);
    const final = measure(OUT);
    const still = Object.keys(after).filter((k) => after[k] !== final[k]);
    console.log(
      still.length
        ? `  warning: ${still.length} item(s) still shifting (e.g. ${still[0]}) — index may be off by a page there`
        : "  settled: every printed page number matches where the item actually is"
    );
  } else {
    console.log("  verified: every printed page number matches where the item actually is");
  }

  fs.rmSync(probe, { force: true });
  await browser.close();

  const pages = execFileSync("pdfinfo", [OUT], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)?.[1];
  console.log(`\nWrote ${OUT}`);
  console.log(`  ${pages} pages, ${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB`);
} catch (e) {
  console.error("PDF build failed:", e.message);
  process.exitCode = 1;
} finally {
  if (server) server.kill("SIGTERM");
}
