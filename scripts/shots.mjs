// Screenshots the ten example sites: the top of each for the front page's curved row, and the
// pictures the phone and the browser window show straight away while the live site loads.
// Needs the site running on BASE (default http://localhost:3000) and playwright installed.
// Run: node scripts/shots.mjs
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const SLUGS = ["vvs", "tomrer", "maler", "tag", "el", "murer", "gulv", "fuger", "anlaeg", "smed"];
const OUT = "public/examples/shots";

// What each preview shows, at the size the site is rendered in it (see live-site.tsx, phone-preview.tsx).
const VIEWS = [
  // The curved row on the front page.
  { dir: "", width: 1280, height: 720, scale: 1 },
  // The phone in the hero: the screen under the status bar and above the home indicator.
  { dir: "phone", width: 390, height: 727, scale: 2 },
  // The browser window on /eksempelsider/, wide and on a phone.
  { dir: "desktop", width: 1280, height: 800, scale: 1 },
  { dir: "mobile", width: 390, height: 607, scale: 2 },
];

/** The colour at the very bottom of the page, which the phone's home-indicator strip continues. */
function bottomColour() {
  let el = document.elementFromPoint(2, innerHeight - 2);
  while (el) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) return bg;
    el = el.parentElement;
  }
  return "rgb(255, 255, 255)";
}

const browser = await chromium.launch();
const chin = {};
for (const view of VIEWS) {
  const dir = view.dir ? `${OUT}/${view.dir}` : OUT;
  await mkdir(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: view.width, height: view.height }, deviceScaleFactor: view.scale, reducedMotion: "reduce" });
  for (const slug of SLUGS) {
    await page.goto(`${BASE}/examples/${slug}/`, { waitUntil: "networkidle" });
    // Lazy images below the fold don't matter; wait for the ones on screen and any fade-in.
    await page.evaluate((h) => Promise.all([...document.images].filter((i) => i.getBoundingClientRect().top < h).map((i) => i.decode().catch(() => {}))), view.height);
    await page.addStyleTag({ content: "html{scrollbar-width:none}html::-webkit-scrollbar{display:none}" });
    await page.waitForTimeout(1500);
    if (view.dir === "phone") chin[slug] = await page.evaluate(bottomColour);
    const png = await page.screenshot({ type: "png" });
    await writeFile(`${dir}/${slug}.webp`, await sharp(png).webp({ quality: 72 }).toBuffer());
    console.log("shot", view.dir || "row", slug);
  }
  await page.close();
}
await browser.close();
await writeFile("lib/chin.json", JSON.stringify(chin, null, 2) + "\n");
