#!/usr/bin/env node
/**
 * Build the river network drawing from Natural Earth.
 *
 *   node scripts/rivers.mjs            # writes src/data/rivers.json
 *
 * Run by hand, never in the build: `npm run build` does not touch the network
 * and the committed JSON is what the site draws. The source is Natural Earth
 * 10m rivers + lake centrelines, which is public domain — "no permission is
 * needed to use Natural Earth" — and is credited on the page anyway, because
 * every other figure on this site names where it came from.
 *
 * What comes out is not a chart. It is a map: real surveyed channels, drawn at
 * a width that follows how much water each one carries, tapering from source
 * to mouth the way a cartographer draws a river rather than the way a plotting
 * library draws a line.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const SRC = process.env.RIVERS_SRC ?? path.join(ROOT, ".cache", "ne_10m_rivers.geojson");
const URL_NE =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson";
const SRC_URBAN = path.join(ROOT, ".cache", "ne_10m_urban_areas.geojson");
const URL_URBAN =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_urban_areas.geojson";

/* The maps this site draws, all from the one dataset and all in the same
   drawing language, so they read as a family rather than as six clip-arts.
   Each zooms in one step on the last.

     india     — the whole network; the four rivers his record names pulse
     godavari  — his river alone, with its two big tributaries

   `box` is the window in degrees. `only` restricts the map to named channels.
   `pulse` names the channels that carry a flood wave. `weight` scales every
   line for that map, because a basin holding three rivers needs a heavier
   stroke than a country holding ninety to read at the same column width. */
const MAPS = {
  india: {
    box: [68.0, 7.8, 90.6, 31.2],
    pulse: ["Godävari", "Krishna", "Narmada", "Brahmaputra"],
    weight: 1,
    city: [78.4867, 17.3850],   // Hyderabad
  },
  /* The Deccan rather than the Godavari alone: Natural Earth carries only three
     channels of that basin, and three lines is not a map. This window holds the
     Godavari with the Krishna, Bhima, Wainganga, Indravati, Tapi and Narmada —
     the peninsular rivers the record is about — and his own river is the one
     that runs. Zoomed in, so it is simplified less and the pulse moves faster
     to cross a shorter distance in about the same time. */
  /* Hyderabad's built-up footprint — the actual shape of the city SnapFlood
     reports come from and the Urban Flood Information System is built for.
     An outline, not a channel: no taper, no pulse, no source-to-mouth. */
  hyderabad: {
    kind: "outline",
    box: [78.15, 17.15, 78.82, 17.66],
    weight: 3.2,
    city: [78.4867, 17.3850],
  },
  deccan: {
    box: [72.8, 15.4, 83.4, 23.0],
    pulse: ["Godävari"],
    weight: 1.45,
    eps: 0.014,
    speed: 78,
    city: [78.4867, 17.3850],
  },
};

/* Natural Earth stores a few of these mouth-first. Checked one by one against
   which way the river actually runs, because a taper on a reversed line is a
   river that gets thinner as it reaches the sea. */
const REVERSED = new Set(["Sutlej", "Tungabhadra", "Indravati", "Mahi"]);

/* scalerank is Natural Earth's own idea of how major a river is; it stands in
   for stream order, which this dataset does not carry. Widths are in viewBox
   units against a 1000-wide box, so they are far larger than they look. */
const WIDTH_FOR_RANK = { 2: 10, 3: 9, 4: 8, 5: 7, 6: 6, 7: 4.8, 8: 4, 9: 3.2, 10: 2.6 };

const EPS = 0.028;       // simplification tolerance, degrees (~3 km)
const CHUNKS_MAX = 14;   // taper steps on the longest rivers

/* ---- geometry ---------------------------------------------------------- */

/** Perpendicular distance from p to the segment ab. */
function segDist(p, a, b) {
  let x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
  if (dx || dy) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = b[0]; y = b[1]; }
    else if (t > 0) { x += dx * t; y += dy * t; }
  }
  return Math.hypot(p[0] - x, p[1] - y);
}

/** Douglas–Peucker, iterative so a 1600-point river cannot blow the stack. */
function simplify(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [lo, hi] = stack.pop();
    let far = -1, best = eps;
    for (let i = lo + 1; i < hi; i++) {
      const d = segDist(pts[i], pts[lo], pts[hi]);
      if (d > best) { best = d; far = i; }
    }
    if (far !== -1) { keep[far] = 1; stack.push([lo, far], [far, hi]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/* ---- source ------------------------------------------------------------ */

if (!fs.existsSync(SRC)) {
  console.log(`  fetching ${URL_NE}`);
  const res = await fetch(URL_NE);
  if (!res.ok) throw new Error(`Natural Earth returned ${res.status}`);
  fs.mkdirSync(path.dirname(SRC), { recursive: true });
  fs.writeFileSync(SRC, Buffer.from(await res.arrayBuffer()));
}
const gj = JSON.parse(fs.readFileSync(SRC, "utf8"));

/* ---- one map ----------------------------------------------------------- */

const SPEED = 38;      // viewBox units per second
const PULSE = 110;     // length of the travelling head, in those same units

function build(key, cfg) {
  const BOX = cfg.box;
  const inBox = (c) => c[0] >= BOX[0] && c[0] <= BOX[2] && c[1] >= BOX[1] && c[1] <= BOX[3];

  /** Split a line wherever it leaves the box, so nothing is bridged across it. */
  function runsInBox(line) {
    const out = [];
    let cur = [];
    for (const c of line) {
      if (inBox(c)) cur.push(c);
      else { if (cur.length > 1) out.push(cur); cur = []; }
    }
    if (cur.length > 1) out.push(cur);
    return out;
  }

  const rivers = [];
  for (const f of gj.features) {
    const g = f.geometry;
    if (!g) continue;
    const name = f.properties.name || "";
    if (cfg.only && !cfg.only.includes(name)) continue;
    const rank = f.properties.scalerank ?? 10;
    const lines = g.type === "LineString" ? [g.coordinates] : g.coordinates;
    for (const line of lines) {
      for (let run of runsInBox(line)) {
        run = simplify(run, cfg.eps ?? EPS);
        if (run.length < 2) continue;
        if (REVERSED.has(name)) run = run.slice().reverse();
        rivers.push({ name, rank, pts: run, his: cfg.pulse.includes(name) });
      }
    }
  }
  if (!rivers.length) throw new Error(`map "${key}" matched no channels`);

  /* Equirectangular, x squeezed by cos(latitude) so the country is not stretched. */
  const all = rivers.flatMap((r) => r.pts);
  const lon0 = Math.min(...all.map((c) => c[0])), lon1 = Math.max(...all.map((c) => c[0]));
  const lat0 = Math.min(...all.map((c) => c[1])), lat1 = Math.max(...all.map((c) => c[1]));
  const K = Math.cos(((lat0 + lat1) / 2) * Math.PI / 180);
  const W = 1000;
  const S = W / ((lon1 - lon0) * K);
  const H = Math.round((lat1 - lat0) * S);
  const px = (c) => [(c[0] - lon0) * K * S, (lat1 - c[1]) * S];
  const r1 = (n) => Math.round(n * 10) / 10;

  const toPath = (pts) =>
    pts.map((c, i) => { const [x, y] = px(c); return `${i ? "L" : "M"}${r1(x)} ${r1(y)}`; }).join("");

  function lengthOf(pts) {
    let L = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = px(pts[i - 1]), b = px(pts[i]);
      L += Math.hypot(b[0] - a[0], b[1] - a[1]);
    }
    return L;
  }

  /* A river is drawn as a short run of segments whose width climbs from source
     to mouth. Each segment repeats its predecessor's last point, so no seam. */
  const segments = [];
  for (const r of rivers) {
    const full = (WIDTH_FOR_RANK[r.rank] ?? 0.9) * cfg.weight;
    const L = lengthOf(r.pts);
    const chunks = Math.max(1, Math.min(CHUNKS_MAX, Math.round(L / 45)));
    const step = Math.max(2, Math.ceil((r.pts.length - 1) / chunks));
    for (let i = 0, k = 0; i < r.pts.length - 1; i += step - 1, k++) {
      const seg = r.pts.slice(i, i + step);
      if (seg.length < 2) break;
      const t = chunks === 1 ? 1 : Math.min(1, (k + 1) / chunks);
      segments.push({ d: toPath(seg), w: r1(full * (0.5 + 0.5 * t)), his: r.his });
    }
  }

  /* The pulse runs the whole channel, so it is kept unbroken and separate. */
  const flows = rivers
    .filter((r) => r.his && lengthOf(r.pts) > 120)
    .map((r) => ({ name: r.name === "Godävari" ? "Godavari" : r.name, d: toPath(r.pts), len: Math.round(lengthOf(r.pts)) }))
    .sort((a, b) => b.len - a.len);

  let city = null;
  if (cfg.city && inBox(cfg.city)) {
    const [cx, cy] = px(cfg.city);
    city = { x: r1(cx), y: r1(cy) };
  }

  return { key, w: W, h: H, segments, flows, city, channels: rivers.length, points: all.length };
}

/* ---- one outline ------------------------------------------------------- */

/* Urban areas arrive as polygons. Each ring is drawn as a closed path at one
   width: a city boundary has no upstream end to taper from. */
function buildOutline(key, cfg) {
  if (!fs.existsSync(SRC_URBAN)) {
    throw new Error(`missing ${SRC_URBAN} — fetch ${URL_URBAN}`);
  }
  const src = JSON.parse(fs.readFileSync(SRC_URBAN, "utf8"));
  const B = cfg.box;
  const inBox = (c) => c[0] >= B[0] && c[0] <= B[2] && c[1] >= B[1] && c[1] <= B[3];

  const rings = [];
  for (const f of src.features) {
    const g = f.geometry;
    if (!g) continue;
    const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
    for (const poly of polys) {
      for (const ring of poly) {
        if (!ring.every(inBox)) continue;          // whole ring, or not at all
        const r = simplify(ring, cfg.eps ?? 0.0015);
        if (r.length > 8) rings.push(r);
      }
    }
  }
  if (!rings.length) throw new Error(`map "${key}" matched no outline`);

  const all = rings.flat();
  const lon0 = Math.min(...all.map((c) => c[0])), lon1 = Math.max(...all.map((c) => c[0]));
  const lat0 = Math.min(...all.map((c) => c[1])), lat1 = Math.max(...all.map((c) => c[1]));
  const K = Math.cos(((lat0 + lat1) / 2) * Math.PI / 180);
  const W = 1000;
  const S = W / ((lon1 - lon0) * K);
  const H = Math.round((lat1 - lat0) * S);
  const px = (c) => [(c[0] - lon0) * K * S, (lat1 - c[1]) * S];
  const r1 = (n) => Math.round(n * 10) / 10;

  const segments = rings.map((ring) => ({
    d: ring.map((c, i) => { const [x, y] = px(c); return `${i ? "L" : "M"}${r1(x)} ${r1(y)}`; }).join("") + "Z",
    w: cfg.weight,
    his: true,
  }));

  let city = null;
  if (cfg.city && inBox(cfg.city)) {
    const [cx, cy] = px(cfg.city);
    city = { x: r1(cx), y: r1(cy) };
  }
  return { key, w: W, h: H, segments, flows: [], city, channels: rings.length, points: all.length };
}

/* ---- build them all ---------------------------------------------------- */

const maps = {};
const css = [
  "/* generated by scripts/rivers.mjs — do not edit by hand */",
  "@keyframes rv-flow { from { stroke-dashoffset: var(--rv-dash); } to { stroke-dashoffset: -1000; } }",
  /* Both halves live here rather than in the component, because a scoped
     rule in RiverMap.astro outranks this one and the pulse never shows. */
  ".rv-flow { opacity: 0; }",
  "@media (prefers-reduced-motion: no-preference) { .rv-flow { opacity: 1; } }",
];

for (const [key, cfg] of Object.entries(MAPS)) {
  const m = cfg.kind === "outline" ? buildOutline(key, cfg) : build(key, cfg);
  maps[key] = { w: m.w, h: m.h, segments: m.segments, flows: m.flows, city: m.city };
  console.log(`  ${key.padEnd(10)} ${m.channels} channels, ${m.points} points, ` +
    `viewBox 0 0 ${m.w} ${m.h} (${(m.w / m.h).toFixed(2)}:1), ${m.segments.length} segments, ${m.flows.length} pulse`);
  m.flows.forEach((f, i) => {
    const head = Math.min(PULSE * (cfg.weight ?? 1), f.len * 0.4);
    const dash = Math.round(head / f.len * 1000);
    const dur = ((f.len + head) / (cfg.speed ?? SPEED)).toFixed(2);
    /* Negative, because an infinite loop is being given a phase rather than a
       wait: the drawing must never open with every river empty. */
    const delay = (-(i * 2.9) - 1.4).toFixed(2);
    css.push(
      `.rv-${key}-f${i} { --rv-dash: ${dash}; stroke-dasharray: ${dash} 1000; ` +
        `animation-name: rv-flow; animation-duration: ${dur}s; animation-delay: ${delay}s; ` +
        `animation-timing-function: linear; animation-iteration-count: infinite; }`
    );
    console.log(`      ${f.name.padEnd(13)} ${f.len} units, ${dur}s`);
  });
}

fs.mkdirSync(path.join(ROOT, "src", "data"), { recursive: true });
const dest = path.join(ROOT, "src", "data", "rivers.json");
fs.writeFileSync(dest, JSON.stringify(maps));
fs.writeFileSync(path.join(ROOT, "src", "styles", "rivers.css"), css.join("\n") + "\n");

console.log(`  wrote src/data/rivers.json — ${(fs.statSync(dest).size / 1024).toFixed(0)} KB`);
console.log(`  wrote src/styles/rivers.css — ${Object.keys(maps).length} maps at ${SPEED} units/s`);
