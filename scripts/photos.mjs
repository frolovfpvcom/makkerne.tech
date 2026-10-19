// Fetches every Unsplash photo the example sites use and stores it in public/examples/photos/ in
// a few widths, so the pages serve them as plain files instead of resizing them on each first visit.
// Photos already there are skipped. lib/photos.json lists the ones that are; a photo not in it still
// works, through the image optimiser (see Img in components/examples/shared.tsx).
// Run: node scripts/photos.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";

// Keep in step with PHOTO_WIDTHS in components/examples/shared.tsx.
const WIDTHS = [480, 828, 1200, 1600, 2048];
const OUT = "public/examples/photos";
const DIR = "components/examples";

const ids = new Set();
for (const file of await readdir(DIR)) {
  const text = await readFile(`${DIR}/${file}`, "utf8");
  for (const m of text.matchAll(/"(\d{10,13}-[0-9a-f]{12})"/g)) ids.add(m[1]);
}

await mkdir(OUT, { recursive: true });
const done = [];
for (const id of [...ids].sort()) {
  if (WIDTHS.every((w) => existsSync(`${OUT}/${id}-${w}.webp`))) {
    done.push(id);
    continue;
  }
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=${WIDTHS.at(-1)}&q=90&fm=jpg`);
  if (!res.ok) {
    console.warn("skip", id, res.status);
    continue;
  }
  const source = Buffer.from(await res.arrayBuffer());
  for (const w of WIDTHS) {
    await sharp(source).resize({ width: w, withoutEnlargement: true }).webp({ quality: 70 }).toFile(`${OUT}/${id}-${w}.webp`);
  }
  done.push(id);
  console.log("photo", id);
}
await writeFile("lib/photos.json", JSON.stringify(done, null, 2) + "\n");
