// Fetches every page in Murerfirmaet Brøbech's menu, so the demo at /demo/brobechv2 can have the same pages
// with their own words. Saves each page's HTML to scripts/brobech-source/ (read by Claude, then deleted)
// and stores every uploaded photo and video the pages use in public/demo/brobech/ under "src-<file name>".
// The sandbox Claude works in can't reach their site, so this runs in the "Brøbech site" workflow.
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const SITE = "https://murerfirma-brobech.dk";
const PAGES = [
  "/", "/kontakt/", "/viden/",
  "/facaderenovering-med-armeringsmoertel-og-silikatpuds/", "/omfugning/", "/skorsten/", "/sokkel/", "/trapper/", "/tag/",
  "/viden/omfugning-af-murvaerk-og-villaer/", "/viden/eksklusiv-facaderenovering-af-villaer/",
  "/viden/reparation-af-udendoers-betontrapper/", "/viden/facaderenovering-til-udlejningsejendomme/",
  "/viden/renovering-af-skadet-murvaerk-og-saetningsskader/",
  "/facaderenovering-aarhus/", "/facaderenovering-ry/", "/omfugning-i-aarhus/",
];
const OUT = "public/demo/brobech";
const SRC = "scripts/brobech-source";
const UA = { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36" } };

await mkdir(SRC, { recursive: true });
await mkdir(OUT, { recursive: true });
const media = new Set();
for (const path of PAGES) {
  const res = await fetch(SITE + path, UA);
  const html = await res.text();
  const slug = path === "/" ? "forside" : path.replace(/^\/|\/$/g, "").replace(/\//g, "__");
  await writeFile(`${SRC}/${slug}.html`, html);
  console.log("page", path, res.status, html.length);
  // Their images are served lazily through a CDN whose URLs contain the original path, so match the path anywhere.
  for (const m of html.matchAll(/murerfirma-brobech\.dk\/wp-content\/uploads\/[^"'\s)<>,]+?\.(?:jpe?g|png|webp|mp4)/gi)) {
    media.add("https://" + m[0].replace(/-\d+x\d+(\.\w+)$/, "$1"));
  }
}

const list = [];
for (const url of media) {
  const base = url.split("/").pop().replace(/\.\w+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const name = `src-${base}`;
  if (/\.mp4$/i.test(url)) {
    list.push({ url, name: `${name}.mp4` });
    if (existsSync(`${OUT}/${name}.mp4`)) continue;
    const res = await fetch(url, UA);
    if (!res.ok) { console.warn("skip", url, res.status); continue; }
    const raw = `/tmp/${name}-raw.mp4`;
    await writeFile(raw, Buffer.from(await res.arrayBuffer()));
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", raw, "-vf", "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'", "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "96k", `${OUT}/${name}.mp4`]);
    execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "1", "-i", raw, "-frames:v", "1", `/tmp/${name}.png`]);
    await sharp(`/tmp/${name}.png`).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`${OUT}/${name}-poster.webp`);
    await unlink(raw);
    continue;
  }
  list.push({ url, name });
  if ([640, 1280].every((w) => existsSync(`${OUT}/${name}-${w}.webp`))) continue;
  const res = await fetch(url, UA);
  if (!res.ok) { console.warn("skip", url, res.status); continue; }
  const source = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(source).metadata();
  if ((meta.width ?? 0) < 300) { console.log("small", url, meta.width); continue; }
  for (const w of [640, 1280, 1920]) {
    await sharp(source).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`${OUT}/${name}-${w}.webp`);
  }
  console.log("photo", name, meta.width, meta.height);
}
await writeFile(`${SRC}/media.json`, JSON.stringify(list, null, 1));
