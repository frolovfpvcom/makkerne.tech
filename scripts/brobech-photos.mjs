// Fetches Murerfirmaet Brøbech's own photos from their current site and stores them in
// public/demo/brobech/ in a few widths, for the demo at /demo/brobech. Photos already there are skipped.
// The sandbox Claude works in can't reach their site, so this runs in the "Brøbech photos" workflow.
// Run: node scripts/brobech-photos.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

const WIDTHS = [640, 1280, 1920];
const OUT = "public/demo/brobech";
const BASE = "https://murerfirma-brobech.dk/wp-content/uploads/";
const FILES = {
  anders: "2026/06/Anders-scaled.jpg",
  "tag-udsigt": "2026/01/IMG_4949.jpg",
  "tag-sten": "2026/01/IMG_4948.jpg",
  "hvid-roedt-tag": "2026/01/98738a8d-3a40-4d52-a5ef-5228f4892db7.jpg",
  "facade-roed-aarhus": "2026/01/ny-facde-efter.jpg",
  "trappe-beton-lys": "2026/01/IMG_7420-1.jpeg",
  "trappe-hoejbjerg": "2026/01/IMG_7420-scaled.jpeg",
  "trappe-murvaerk": "2026/01/efter.trappe2.jpg",
  "skorsten-foer": "2026/01/IMG_4747.jpeg",
  "skorsten-efter": "2026/01/IMG_4757.jpeg",
  "etageejendom-roed": "2026/01/IMG_3929-1.jpeg",
  "skanderborg-sprosser": "2026/01/IMG_5199-1.jpeg",
  "trappe-brabrand": "2026/01/596778043_122190836324553617_593132509347590142_n.jpg",
  "trappe-klinker": "2026/01/trappe1.jpg",
  "trappe-sokkel": "2026/01/efter-trappe.jpg",
  "gavl-omfugning": "2024/11/c5a1de7c-0b76-4b16-839a-78d5f35f9e2f.jpeg",
  "villa-fuger": "2024/11/4d587f20-93ef-49f9-8d6a-7b11b258c7db.jpeg",
  "kvist-fuger": "2024/11/bf0d6a2a-6565-492f-a227-8df2913e286d.jpeg",
  "landejendom-skanderborg": "2024/11/a56ac3e7-2a7d-4afc-8815-ed26bbdea072.jpeg",
  "hvid-aarhus-skraa": "2024/11/874c8482-2f3d-4b7d-bee4-428ed666b526.jpeg",
  "netpuds-villa": "2024/11/P10120712-1024x768-1.jpg",
  "facade-taarn": "2025/12/facade-4.jpg",
  "stillads-ry": "2025/12/facade-1.jpg",
  "sprosser-skaade": "2025/12/facade-2.jpg",
  "klassisk-aarhus": "2025/12/facade-3.jpg",
  "gavl-ry": "2025/12/488910611_122146436132553617_2439067958735060523_n.jpg",
  logo: "2024/10/logo-brobech.png",
};

await mkdir(OUT, { recursive: true });
for (const [name, path] of Object.entries(FILES)) {
  if (WIDTHS.every((w) => existsSync(`${OUT}/${name}-${w}.webp`))) continue;
  const res = await fetch(BASE + path, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) {
    console.warn("skip", name, res.status);
    continue;
  }
  const source = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(source).metadata();
  console.log("photo", name, meta.width, meta.height);
  for (const w of WIDTHS) {
    await sharp(source).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`${OUT}/${name}-${w}.webp`);
  }
}
