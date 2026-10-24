// Fetches Murerfirmaet Brøbech's own photos from their current site and stores them in
// public/demo/brobech/ in a few widths, for the demo at /demo/brobech. Photos already there are skipped.
// The sandbox Claude works in can't reach their site, so this runs in the "Brøbech photos" workflow.
// Run: node scripts/brobech-photos.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";

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
  "logo-hvid": "2024/10/logo-brobech-white.png",
  "sokkel-foer": "2026/01/sokkel.foer_.jpg",
  "sokkel-efter": "2026/01/sokkel.faerdig.jpg",
  "stillads-fugning": "2025/12/584013679_122187278378553617_7568936094939530136_n.jpg",
  "skorsten-pudset": "2025/12/faerdig.skortsten.jpg",
  "skorsten-risskov-efter": "2025/12/Skorsten.efter_.jpg",
  "skorsten-risskov-foer": "2025/12/Skorsten.foer_.jpg",
  "netpuds-aarhus-lang": "2025/12/492833762_122150988290553617_347228558779307204_n-1.jpg",
  "villa-fladt-tag": "2025/12/511197751_122161738628553617_4821675720006708515_n.jpg",
  "netpuds-stige": "2025/12/493039067_122150988320553617_3926140286844945276_n.jpg",
  "sprosser-egaa": "2025/12/488682789_122146436216553617_6208228102071179879_n.jpg",
  "klassisk-roed-omfuget": "2025/12/582881908_122186791694553617_4652373565728499686_n.jpg",
  "etage-aarhus": "2025/12/580945654_122186791688553617_2121197627081748114_n.jpg",
  "landvilla-risskov": "2025/12/561141853_122182465370553617_2371995229504941347_n.jpg",
  "omfug-efter": "2025/12/efter-omfug-1.jpg",
  "omfug-foer": "2025/12/for-omfug-1.jpg",
  "omfugning-fra-stillads": "2025/12/omfugning-3.jpg",
  "omfugning-skanderborg-gavl": "2025/12/omfugning-8.jpg",
  "omfugning-sprosser": "2025/12/omfugning-10.jpg",
  "ry-fuger-taet": "2024/11/Ry-omfuget-org.-lys.jpg",
  "fuger-taet": "2024/11/IMG_6448.jpg",
  "forbandt-risskov": "2024/11/IMG_6446.jpg",
  "hvidt-hus-faerdigt": "2024/11/Hvidt-hus-faerdigt.jpg",
  "lift-sokkel": "2024/11/IMG_3171.jpg",
};

// Their videos, cut down to 720p H.264 with a poster frame each.
const VIDEOS = {
  "video-tag": "2026/01/IMG_5940tag.mp4",
  "video-skorsten": "2025/12/skorsten.mp4",
  "video-magnus-1": "2026/05/Magnus_s-Video-May-12-2026-1.mp4",
  "video-magnus-2": "2026/05/Magnus_s-Video-May-12-2026-2.mp4",
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

for (const [name, path] of Object.entries(VIDEOS)) {
  if (existsSync(`${OUT}/${name}.mp4`)) continue;
  const res = await fetch(BASE + path, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) {
    console.warn("skip", name, res.status);
    continue;
  }
  const raw = `/tmp/${name}-raw.mp4`;
  await writeFile(raw, Buffer.from(await res.arrayBuffer()));
  console.log("video", name, execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height", "-of", "compact", raw]).toString());
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", raw, "-vf", "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'", "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "96k", `${OUT}/${name}.mp4`]);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "1", "-i", raw, "-frames:v", "1", `/tmp/${name}.png`]);
  await sharp(`/tmp/${name}.png`).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`${OUT}/${name}-poster.webp`);
  await unlink(raw);
}

// Their award from Anmeld Håndværker (a bronze statuette, "Anbefalet"), found by its alt text on the
// front page, since the file name isn't known. Kept with transparency for the demo at /demo/brobechv2.
if (!existsSync(`${OUT}/badge-anbefalet-480.png`)) {
  const html = await (await fetch("https://murerfirma-brobech.dk/", { headers: { "user-agent": "Mozilla/5.0" } })).text();
  const tags = html.match(/<img[^>]*>/gi) ?? [];
  const tag = tags.find((t) => /bronzestatuette|anbefalet/i.test(t));
  console.log("badge tag", tag);
  const url = tag?.match(/(?:data-src|data-lazy-src|src)="(https?:[^"]+)"/i)?.[1]
    ?? tag?.match(/srcset="(https?:[^"\s]+)/i)?.[1];
  if (url) {
    const source = Buffer.from(await (await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } })).arrayBuffer());
    console.log("badge", url, (await sharp(source).metadata()).width);
    await sharp(source).trim().resize({ width: 480, withoutEnlargement: true }).png().toFile(`${OUT}/badge-anbefalet-480.png`);
  } else {
    console.warn("badge not found");
  }
}
