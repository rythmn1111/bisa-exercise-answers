#!/usr/bin/env bun
/**
 * Renders the whole book to BISA-Exercise-Answers.pdf from the command line.
 * Starts the production server itself if one is not already listening.
 *
 * Usage:
 *   bun run pdf                 # build (if needed), serve, render, stop
 *   bun run pdf --url http://localhost:3220
 *   bun run pdf --out ~/Desktop/guide.pdf
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(import.meta.dir, "..");
const argv = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const PORT = Number(argOf("--port", "3220"));
const BASE = argOf("--url", `http://localhost:${PORT}`);
const OUT = path.resolve(argOf("--out", path.join(ROOT, "BISA-Exercise-Answers.pdf")));

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

  console.log("Rendering /print in headless Chrome…");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1240, height: 1754 });
  page.on("console", (m) => m.type() === "error" && console.warn("  page error:", m.text()));

  await page.goto(`${BASE}/print`, { waitUntil: "networkidle0", timeout: 240000 });
  await page.evaluate(() => {
    document.querySelectorAll("details").forEach((d) => d.setAttribute("open", ""));
  });
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images)
        .filter((i) => !i.complete)
        .map((i) => new Promise((res) => {
          i.addEventListener("load", res, { once: true });
          i.addEventListener("error", res, { once: true });
        }))
    );
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.emulateMediaType("print");

  const header = `<div style="width:100%;font-family:-apple-system,system-ui,sans-serif;font-size:7pt;color:#8a8a94;padding:0 15mm;display:flex;justify-content:space-between;"><span>Exercise Answers — Python, pandas, Matplotlib</span><span>Goa Institute of Management · BIFS 2026–27</span></div>`;
  const footer = `<div style="width:100%;font-family:-apple-system,system-ui,sans-serif;font-size:7pt;color:#8a8a94;padding:0 15mm;display:flex;justify-content:space-between;"><span class="date"></span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`;

  await page.pdf({
    path: OUT,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: header,
    footerTemplate: footer,
    margin: { top: "18mm", bottom: "19mm", left: "15mm", right: "15mm" },
    timeout: 240000,
  });

  await browser.close();
  const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`\nWrote ${OUT} (${kb} KB)`);
} catch (e) {
  console.error("PDF build failed:", e.message);
  process.exitCode = 1;
} finally {
  if (server) server.kill("SIGTERM");
}
