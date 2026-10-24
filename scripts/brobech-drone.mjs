// Cuts the drone clip at the top of /demo/brobechv2 straight from Brøbech's original film, so it is
// encoded once at high quality (the copy in public/demo/brobech is already squeezed to 720p).
// The sandbox Claude works in can't reach their site, so this runs in the "Brøbech drone" workflow.
// Run: node scripts/brobech-drone.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const SRC = "https://murerfirma-brobech.dk/wp-content/uploads/2026/05/Magnus_s-Video-May-12-2026-1.mp4";
const OUT = "public/demo/brobechv2";
const START = "2", LENGTH = "24";
const raw = "/tmp/drone-raw.mp4";

const res = await fetch(SRC, { headers: { "user-agent": "Mozilla/5.0" } });
if (!res.ok) throw new Error(`download failed: ${res.status}`);
await writeFile(raw, Buffer.from(await res.arrayBuffer()));
console.log(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration,bit_rate:stream=codec_name,width,height,r_frame_rate,bit_rate", "-of", "compact", raw]).toString());

// No sound, H.264 high profile, faststart. CRF 23 with a bitrate cap keeps it sharp but light enough to autoplay.
for (const [h, max] of [[1080, "5M"], [720, "2.8M"]]) {
  execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", START, "-t", LENGTH, "-i", raw, "-an",
    "-vf", `scale=-2:'min(${h},ih)':flags=lanczos`, "-c:v", "libx264", "-crf", "23", "-maxrate", max, "-bufsize", `${parseFloat(max) * 2}M`, "-preset", "slower", "-tune", "film",
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${OUT}/drone-${h}.mp4`]);
  console.log(`drone-${h}.mp4`, execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=size,bit_rate:stream=width,height", "-of", "compact", `${OUT}/drone-${h}.mp4`]).toString());
}
execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", START, "-i", raw, "-frames:v", "1", "/tmp/drone-poster.png"]);
await sharp("/tmp/drone-poster.png").resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${OUT}/drone-poster.webp`);
