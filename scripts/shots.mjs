// Screenshots the top of each example site for the front page's curved row.
// Needs the site running on BASE (default http://localhost:3000) and playwright installed.
// Run: node scripts/shots.mjs
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const SLUGS = ["vvs", "tomrer", "maler", "tag", "el", "murer", "gulv", "fuger", "anlaeg", "smed"];
const OUT = "public/examples/shots";

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
for (const slug of SLUGS) {
  await page.goto(`${BASE}/examples/${slug}/`, { waitUntil: "networkidle" });
  // Lazy images below the fold don't matter; wait for the ones on screen and any fade-in.
  await page.evaluate(() => Promise.all([...document.images].filter((i) => i.getBoundingClientRect().top < 720).map((i) => i.decode().catch(() => {}))));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${slug}.jpg`, type: "jpeg", quality: 82 });
  console.log("shot", slug);
}
await browser.close();
