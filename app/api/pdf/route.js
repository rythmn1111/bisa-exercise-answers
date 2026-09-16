import fs from "node:fs";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

function findChrome() {
  return CANDIDATES.find((p) => {
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  });
}

const HEADER = `
<div style="width:100%;font-family:-apple-system,system-ui,sans-serif;font-size:7pt;color:#8a8a94;
            padding:0 15mm;display:flex;justify-content:space-between;">
  <span>Exercise Answers — Python, pandas, Matplotlib</span>
  <span>Goa Institute of Management · BIFS 2026–27</span>
</div>`;

const FOOTER = `
<div style="width:100%;font-family:-apple-system,system-ui,sans-serif;font-size:7pt;color:#8a8a94;
            padding:0 15mm;display:flex;justify-content:space-between;">
  <span class="date"></span>
  <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;

export async function GET(request) {
  const executablePath = findChrome();
  if (!executablePath) {
    return Response.json(
      {
        error: "no_chrome",
        message:
          "No Chrome/Chromium binary found. Set CHROME_PATH, or use the browser's own print dialog at /print?autoprint=1",
        looked: CANDIDATES,
      },
      { status: 503 }
    );
  }

  const origin = new URL(request.url).origin;
  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754 });
    await page.goto(`${origin}/print`, { waitUntil: "networkidle0", timeout: 180000 });
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
    });
    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: HEADER,
      footerTemplate: FOOTER,
      margin: { top: "18mm", bottom: "19mm", left: "15mm", right: "15mm" },
      timeout: 180000,
    });

    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(pdf.length),
        "Content-Disposition": 'attachment; filename="BISA-Exercise-Answers.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/pdf]", err);
    return Response.json({ error: "render_failed", message: String(err?.message || err) }, { status: 500 });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
