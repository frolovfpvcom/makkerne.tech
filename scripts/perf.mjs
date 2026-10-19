// Times how fast the examples show up: each example page on its own, the phone on the front page
// and the browser window on /eksempelsider/. Every page gets a fresh browser with an empty cache,
// once on a plain connection and once on a phone-like 4G one.
// Run: BASE=https://makkerne-tech.vercel.app node scripts/perf.mjs
import { chromium } from "playwright";
import { appendFile } from "node:fs/promises";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const SLUGS = ["vvs", "tomrer", "maler", "tag", "el", "murer", "gulv", "fuger", "anlaeg", "smed"];
const PROFILES = {
  fast: null,
  "4g": { offline: false, latency: 80, downloadThroughput: (12 * 1024 * 1024) / 8, uploadThroughput: (4 * 1024 * 1024) / 8 },
};
const out = [];
const log = (line = "") => {
  console.log(line);
  out.push(line);
};
const ms = (n) => (n == null ? "–" : `${Math.round(n)}`);
const kb = (n) => `${Math.round(n / 1024)}`;

const browser = await chromium.launch();

async function fresh(profile, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: viewport.width < 500 ? 3 : 1 });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (PROFILES[profile]) await cdp.send("Network.emulateNetworkConditions", PROFILES[profile]);
  // Count every byte that crosses the wire, iframes included.
  let bytes = 0;
  cdp.on("Network.loadingFinished", (e) => (bytes += e.encodedDataLength));
  const images = [];
  page.on("requestfinished", async (req) => {
    if (!req.url().includes("/_next/image") && !/\/examples\/(shots|photos)\//.test(req.url())) return;
    const res = await req.response();
    const t = req.timing();
    images.push({ url: req.url(), ms: t.responseEnd, cache: res?.headers()["x-vercel-cache"] ?? "" });
  });
  await page.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  return { context, page, bytes: () => bytes, images };
}

async function examplePage(slug, profile) {
  const { context, page, bytes, images } = await fresh(profile, { width: 390, height: 844 });
  await page.goto(`${BASE}/examples/${slug}/`, { waitUntil: "load", timeout: 90_000 });
  await page.waitForTimeout(500);
  const nav = await page.evaluate(() => {
    const n = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    return { ttfb: n.responseStart, fcp: fcp?.startTime, lcp: window.__lcp, load: n.loadEventEnd };
  });
  const opt = images.filter((i) => i.url.includes("/_next/image"));
  const slowest = Math.max(0, ...images.map((i) => i.ms));
  const caches = [...new Set(opt.map((i) => i.cache))].join("/");
  await context.close();
  return { ...nav, kb: bytes(), imgs: images.length, slowest, caches };
}

/**
 * What the preview shows right now: the screenshot that has decoded and the live example whose page
 * has finished loading, if any. Only visible ones count, so hidden, preloaded examples don't.
 */
function state() {
  const seen = (el) => el.checkVisibility({ visibilityProperty: true }) && el.getBoundingClientRect().width > 0;
  const shot = [...document.querySelectorAll("img[data-shot]")].find((i) => seen(i) && i.complete && i.naturalWidth);
  const frame = [...document.querySelectorAll("iframe")].find((f) => {
    try {
      return seen(f) && f.contentWindow.__loadedAt;
    } catch {
      return false;
    }
  });
  return { shot: shot?.currentSrc ?? null, live: frame ? frame.src : null, at: frame ? frame.contentWindow.__loadedAt - performance.timeOrigin : null };
}

/** Time from t0 until a different example than `before` is on screen, and until it is live. */
async function waitFor(page, before, t0) {
  return page.evaluate(
    async ({ before, t0, state }) => {
      const read = new Function(`return (${state})()`);
      let shown = null;
      for (let i = 0; i < 1500; i++) {
        const s = read();
        const now = performance.now() - t0;
        if (shown == null && s.shot && s.shot !== before.shot) shown = now;
        if (s.live && s.live !== before.live) return { shown: shown ?? Math.max(0, s.at - t0), live: Math.max(0, s.at - t0) };
        await new Promise((r) => setTimeout(r, 20));
      }
      return { shown, live: null };
    },
    { before, t0, state: state.toString() },
  );
}

async function preview(path, next, profile, viewport, steps = 4) {
  const { context, page, bytes } = await fresh(profile, viewport);
  // Every example page notes when it has finished loading, so the top page can read it.
  await page.addInitScript(() => addEventListener("load", () => (window.__loadedAt = performance.timeOrigin + performance.now())));
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  // Bring the preview on screen, as a visitor would; a lazy frame below the fold never loads.
  await page.locator("iframe, img[data-shot]").first().scrollIntoViewIfNeeded({ timeout: 10_000 }).catch(() => {});
  const first = await waitFor(page, { shot: null, live: null }, 0);
  const flips = [];
  for (let i = 0; i < steps; i++) {
    await page.waitForTimeout(1500);
    const before = await page.evaluate(`(${state})()`);
    const t0 = await page.evaluate(() => performance.now());
    await page.locator(next).first().click();
    flips.push(await waitFor(page, before, t0));
  }
  await context.close();
  return { first, flips, kb: bytes() };
}

if (process.env.GITHUB_STEP_SUMMARY) log(`### Målt mod ${BASE}, ${new Date().toISOString()}`);

for (const profile of Object.keys(PROFILES)) {
  log();
  log(`#### Eksempelsider på mobil (${profile}), ms`);
  log("| side | TTFB | FCP | LCP | load | KB | billeder | langsomste billede | cache |");
  log("|---|---|---|---|---|---|---|---|---|");
  for (const slug of SLUGS) {
    const r = await examplePage(slug, profile);
    log(`| ${slug} | ${ms(r.ttfb)} | ${ms(r.fcp)} | ${ms(r.lcp)} | ${ms(r.load)} | ${kb(r.kb)} | ${r.imgs} | ${ms(r.slowest)} | ${r.caches} |`);
  }

  log();
  log(`#### Forsidens telefon og /eksempelsider/ (${profile}), ms til eksemplet vises · til den levende side er klar`);
  log("| sted | første | bladr 1 | bladr 2 | bladr 3 | bladr 4 | KB i alt |");
  log("|---|---|---|---|---|---|---|");
  const cases = [
    ["forside, telefon, 1280", "/", { width: 1280, height: 800 }],
    ["forside, telefon, 390", "/", { width: 390, height: 844 }],
    ["eksempelsider, 1280", "/eksempelsider/", { width: 1280, height: 800 }],
    ["eksempelsider, 390", "/eksempelsider/", { width: 390, height: 844 }],
  ];
  for (const [name, path, viewport] of cases) {
    try {
      const r = await preview(path, 'button[aria-label="Næste eksempel"]:visible', profile, viewport);
      const cell = (f) => `${ms(f.shown)} · ${ms(f.live)}`;
      log(`| ${name} | ${cell(r.first)} | ${r.flips.map(cell).join(" | ")} | ${kb(r.kb)} |`);
    } catch (err) {
      log(`| ${name} | fejl: ${String(err.message).split("\n")[0]} |`);
    }
  }
}

await browser.close();
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, out.join("\n") + "\n");
