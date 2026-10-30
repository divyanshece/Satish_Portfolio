/**
 * The UFIS diagram's artwork manifest, and the one check the diagram makes
 * at build time: whether a tile has a video sitting next to its still.
 *
 * Every file under public/ufis/ is a piece of the RAFT group's own slide,
 * cropped exactly as the slide crops it (research/ufis/gen-assets.mjs does
 * the cutting). Sizes are the files' pixel sizes, for width/height attributes.
 *
 * Videos: drop `<key>.mp4` into public/ufis/video/ and that tile plays it —
 * muted, looping, the still as its poster. No code change needed. Keys are
 * the file names below (weather, hydro, geospatial, satellite, …).
 */
import fs from "node:fs";
import path from "node:path";

export const ART: Record<string, readonly [number, number]> = {
  "satellite": [239, 203],
  "aws": [146, 194],
  "hydromet": [187, 230],
  "phone-frame": [142, 249],
  "app-shot-a": [115, 225],
  "varshamitra": [142, 264],
  "community": [244, 240],
  "phone-black": [268, 299],
  "facebook": [91, 102],
  "bluesky": [103, 118],
  "x": [75, 84],
  "whatsapp": [84, 94],
  "linkedin": [96, 107],
  "geospatial": [279, 276],
  "weather": [470, 450],
  "hydro": [288, 234],
  "ai-network": [432, 326],
  "book-gears": [245, 245],
  "ai-head": [222, 222],
  "map-rain": [260, 193],
  "map-uhi": [273, 198],
  "map-risk": [264, 198],
  "flood-map": [169, 122],
  "phone-frame-2": [176, 308],
  "app-shot-a-2": [143, 280],
  "phone-frame-3": [176, 308],
  "app-shot-b": [147, 288],
  "telegram": [144, 144],
  "whatsapp-2": [156, 156],
  "alert-phone": [232, 285],
  "dashboard": [314, 299],
  "disaster": [144, 142],
  "mitigation": [200, 174],
  "stakeholders": [307, 224],
};

// `astro build` runs from site/, so this resolves to site/public/ufis/video.
const VIDEO_DIR = path.resolve(process.cwd(), "public/ufis/video");

export function videoFor(id: string): string | null {
  return fs.existsSync(path.join(VIDEO_DIR, `${id}.mp4`)) ? `/ufis/video/${id}.mp4` : null;
}
