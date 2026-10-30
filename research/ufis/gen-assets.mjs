import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("/Users/divyanshpandey/Desktop/Projects/Satish_Portfolio/site/package.json");
const sharp = require("sharp");
const SP = "/private/tmp/claude-501/-Users-divyanshpandey-Desktop-Projects-Satish-Portfolio/0a1055f9-5c56-40cc-9342-e71706b18fa9/scratchpad";
const OUT = "/Users/divyanshpandey/Desktop/Projects/Satish_Portfolio/site/public/ufis";
const PW = 1920, PH = 1080;
const design = JSON.parse(fs.readFileSync(`${SP}/canva/design.json`, "utf8"));
const html = fs.readFileSync(`${SP}/canva2.html`, "utf8");
const media = {};
for (const m of html.matchAll(/\{"type":"([A-Z_]+)","id":"([A-Za-z0-9_-]+)","version":(\d+),"files":\[(.*?)\]\}/g)) {
  const files = [...m[4].matchAll(/"url":"(_assets\/[^"]+)"[^}]*?"width":(\d+),"height":(\d+)/g)].map(f => ({ url: f[1], w: +f[2], h: +f[3] }));
  if (!files.length) continue;
  const best = files.sort((a, b) => b.w - a.w)[0];
  if (!media[m[2]] || best.w > media[m[2]].w) media[m[2]] = { type: m[1], file: best.url.split("/").pop(), w: best.w, h: best.h };
}
const KEY_BY_FILE = {
  "29385b70": "satellite", "4b755fa3": "aws", "461dbd80": "hydromet",
  "124033dd": "phone-frame", "af5f7597": "app-shot-a", "362d4bb3": "app-shot-b", "071f8553": "varshamitra", "73f4eb0a": "community",
  "01d5a1db": "phone-black", "cb60f174": "whatsapp", "5f54331e": "x", "076f50fa": "linkedin", "0433d589": "facebook", "659a6730": "bluesky",
  "3d6358da": "geospatial", "0b8a1e82": "weather", "09d6795d": "hydro", "cb13001b": "ai-network", "e71121d4": "book-gears", "01997aaa": "ai-head",
  "f49a4b50": "dashboard", "74c156b8": "flood-map", "cacbcb77": "map-rain", "73ddbd94": "map-uhi", "7ac93d12": "map-risk",
  "90af6655": "alert-phone", "817e2730": "telegram", 
  "aeecec48": "community", "2895ce7b": "weather", "167199ac": "ai-network", "bed646f9": "geospatial",
  "b6b6fa53": "stakeholders", "2afc75ef": "disaster", "25380f13": "mitigation",
};
const KEY_WHITE = new Set(["telegram", "stakeholders", "mitigation", "map-rain", "map-uhi", "map-risk", "weather", "hydro", "geospatial", "ai-network", "flood-map"]);
const KEY_BY_TEXT = [
  [/^URBAN FLOOD/, "title"], [/^Data Inputs/, "hd-inputs"], [/^Models & Forecasting/, "hd-models"], [/^Tools:/, "hd-tools"], [/^Decision Support/, "hd-decision"],
  [/^Observation/, "sec-observation"], [/^Community/, "sec-community"], [/^GeoSpatial/, "sec-geo"],
  [/^Satellite/, "lbl-satellite"], [/^Automatic/, "lbl-aws"], [/^Hydro-met/, "lbl-hydromet"], [/^Snapflood TM$/, "lbl-snapflood"], [/^Soil Map/, "list-geo"],
  [/^Weather Forecasting/, "lbl-weather"], [/^Hydrological/, "lbl-hydro"], [/^AI\/ML/, "lbl-ai"],
  [/^Rainfall Maps/, "lbl-rain"], [/^UHI Maps/, "lbl-uhi"], [/^Risk/, "lbl-risk"], [/^Flood Extents/, "lbl-flood"], [/^Snapflood TM Mobile/, "lbl-app"],
  [/^Alerts/, "lbl-alerts"], [/^Web Dashboards/, "lbl-dash"], [/^Disaster/, "lbl-disaster"], [/^Mitigation/, "lbl-mitigation"], [/^Stakeholders/, "lbl-stakeholders"],
];
const textOf = o => (o.a && o.a.C && Array.isArray(o.a.C.A)) ? o.a.C.A.join("").trim() : "";
const mediaIds = o => [...new Set([...JSON.stringify(o).matchAll(/"A\?":"d","A":"([A-Za-z0-9_-]+)"/g)].map(m => m[1]))];
const seen = {}; const uniq = k => { seen[k] = (seen[k] || 0) + 1; return seen[k] === 1 ? k : `${k}-${seen[k]}`; };
const pct = (v, base) => +(v / base * 100).toFixed(3);
const els = []; const jobs = [];
const boxCss = (k, x, y, w, h) => `.k-${k}{left:${pct(x,PW)}%;top:${pct(y,PH)}%;width:${pct(w,PW)}%;height:${pct(h,PH)}%}`;

function addImage(o, x, y, w, h, s, kind) {
  const ids = mediaIds(o); if (!ids.length) return;
  const mm = media[ids[0]]; if (!mm) { console.log("no media for", ids); return; }
  const base = KEY_BY_FILE[mm.file.slice(0, 8)]; if (!base) { console.log("unmapped media", mm.file, x, y); return; }
  const key = uniq(base);
  const src = `${SP}/canva/media/${mm.file}`;
  // Canva crop: image drawn at (x+offx, y+offy) with size (sw, sh) inside the window (x,y,w,h)
  let cr = (o.a && o.a.B && o.a.B.B) ? o.a.B.B : null;
  // crop record: A = top offset, B = left offset, D = scaled width, C = scaled height (same axes as element boxes)
  let img = cr && cr.D ? { x: x + cr.B * s, y: y + cr.A * s, w: cr.D * s, h: cr.C * s } : null;
  let vis, srcRect, cover = false;
  if (img) {
    vis = { x: Math.max(x, img.x), y: Math.max(y, img.y) };
    vis.w = Math.min(x + w, img.x + img.w) - vis.x; vis.h = Math.min(y + h, img.y + img.h) - vis.y;
    const fx = mm.w / img.w, fy = mm.h / img.h;
    srcRect = { left: (vis.x - img.x) * fx, top: (vis.y - img.y) * fy, width: vis.w * fx, height: vis.h * fy };
  } else if (kind === "frame") {
    // image fill in a shape: cover
    cover = true; vis = { x, y, w, h };
    const fa = w / h, ia = mm.w / mm.h;
    if (ia > fa) { const cw = mm.h * fa; srcRect = { left: (mm.w - cw) / 2, top: 0, width: cw, height: mm.h }; }
    else { const ch = mm.w / fa; srcRect = { left: 0, top: (mm.h - ch) / 2, width: mm.w, height: ch }; }
  } else { vis = { x, y, w, h }; srcRect = { left: 0, top: 0, width: mm.w, height: mm.h }; }
  const r = { left: Math.max(0, Math.round(srcRect.left)), top: Math.max(0, Math.round(srcRect.top)) };
  r.width = Math.min(mm.w - r.left, Math.round(srcRect.width)); r.height = Math.min(mm.h - r.top, Math.round(srcRect.height));
  const outW = Math.min(r.width, Math.round(vis.w * 2));
  els.push({ key, kind: "img", x: vis.x, y: vis.y, w: vis.w, h: vis.h, file: `${key}.webp`, src: mm.file, nat: [mm.w, mm.h], crop: r, outW, cover });
  jobs.push(async () => {
    const meta = await sharp(src).metadata();
    let p = sharp(src, { failOn: "none" }).extract(r).resize({ width: outW, withoutEnlargement: true });
    if (KEY_WHITE.has(base)) {
      // The slide pasted these in on white. On the site's paper that white would
      // show as a sticker edge, so near-white becomes transparent, feathered.
      const { data, info: ri } = await p.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      // Only white that touches the edge goes: flood-fill inward through
      // near-white, so a white cloud or a map's white interior stays put.
      const W = ri.width, H = ri.height, N = W * H;
      const lo = new Uint8Array(N); for (let i = 0; i < N; i++) lo[i] = Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
      const bg = new Uint8Array(N); const q = [];
      const push = i => { if (!bg[i] && lo[i] >= 228) { bg[i] = 1; q.push(i); } };
      for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); } for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
      while (q.length) { const i = q.pop(), x = i % W, y = (i - x) / W; if (x > 0) push(i - 1); if (x < W - 1) push(i + 1); if (y > 0) push(i - W); if (y < H - 1) push(i + W); }
      for (let i = 0; i < N; i++) {
        if (bg[i]) { data[i * 4 + 3] = 0; continue; }
        // one-pixel feather where art meets removed background
        const x = i % W, y = (i - x) / W;
        const touches = (x > 0 && bg[i - 1]) || (x < W - 1 && bg[i + 1]) || (y > 0 && bg[i - W]) || (y < H - 1 && bg[i + W]);
        if (touches && lo[i] >= 200) data[i * 4 + 3] = Math.round(data[i * 4 + 3] * (255 - lo[i]) / 55);
      }
      p = sharp(data, { raw: { width: W, height: H, channels: 4 } });
    }
    const info = await p.webp({ quality: 84, alphaQuality: 92, effort: 6 }).toFile(`${OUT}/${key}.webp`);
    return `${key.padEnd(16)} ${mm.file.slice(0,8)} ${meta.width}x${meta.height} → crop ${r.left},${r.top} ${r.width}x${r.height} → ${info.width}x${info.height} ${(info.size/1024).toFixed(0)}K alpha=${meta.hasAlpha}`;
  });
}
function addText(o, x, y, w, h, s) {
  const t = textOf(o); const hit = KEY_BY_TEXT.find(([re]) => re.test(t)); if (!hit) { console.log("unmapped text", JSON.stringify(t)); return; }
  const runs = (o.a.C.C || []).filter(r => r && typeof r === "object");
  const r0 = runs[0] || {};
  els.push({ key: hit[1], kind: "text", x, y, w, h, text: t, size: +(parseFloat(r0.G) * s).toFixed(2), color: r0.M, weight: r0.I, align: r0.c || "start", lines: o.a.C.A });
}
const page = design.page.A.A[3];
for (const o of page.E) {
  const t = o["A?"], x = o.B, y = o.A, w = o.D, h = o.C, rot = o.E || 0;
  if (t === "I") addImage(o, x, y, w, h, 1, "img");
  else if (t === "K") addText(o, x, y, w, h, 1);
  else if (t === "J") {
    const b = (o.b || [{}])[0]; const stroke = b.C && b.C.B, fill = b.B && b.B.C;
    if (mediaIds(o).length) addImage(o, x, y, w, h, 1, "frame");
    else if (stroke === "#ed7d31") { const key = x < 700 ? "fr-inputs" : x < 1100 ? "fr-models" : y < 500 ? "fr-tools" : "fr-decision"; els.push({ key, kind: "frame", x, y, w, h, stroke, dash: b.C.C, sw: b.C.A }); }
    else if (fill === "#4472c4") { // rotated block arrow: box after rotation about centre
      const cx = x + w / 2, cy = y + h / 2; const rw = Math.abs(rot) === 90 ? h : w, rh = Math.abs(rot) === 90 ? w : h;
      els.push({ key: w > 50 ? "ar-a" : "ar-b", kind: "arrow", x: cx - rw / 2, y: cy - rh / 2, w: rw, h: rh, dir: "right", fill, stroke: b.C.B, path: b.A, vb: [o.a.D, o.a.C] });
    } else console.log("unmapped J", x, y, w, h, JSON.stringify(b).slice(0, 80));
  }
  else if (t === "U") { const p1 = o.b.C, p2 = o.c.C; const key = uniq("ln"); els.push({ key, kind: "line", x1: p1.B, y1: p1.A, x2: p2.B, y2: p2.A, stroke: o.d, dash: o.e, sw: o.a }); }
  else if (t === "H") {
    const s = w / o.b;
    for (const c of o.c || []) {
      const ct = c["A?"], cx = x + c.B * s, cy = y + c.A * s, cw = c.D * s, ch = c.C * s;
      if (ct === "I") addImage(c, cx, cy, cw, ch, s, "img");
      else if (ct === "K") addText(c, cx, cy, cw, ch, s);
      else if (ct === "J") {
        const b = (c.b || [{}])[0];
        if (mediaIds(c).length) addImage(c, cx, cy, cw, ch, s, "frame");
        else if (b.B && b.B.C === "#4472c4") els.push({ key: Math.abs(c.E || 0) === 180 ? "ar-up" : "ar-down", kind: "arrow", x: cx, y: cy, w: cw, h: ch, dir: Math.abs(c.E || 0) === 180 ? "up" : "down", fill: b.B.C, stroke: b.C.B, path: b.A, vb: [c.a.D, c.a.C] });
        else console.log("unmapped child J", cx, cy);
      } else console.log("unmapped child", ct);
    }
  } else console.log("unmapped type", t, x, y, w, h);
}
const results = []; for (const j of jobs) results.push(await j());
results.forEach(r => console.log("  " + r));
fs.writeFileSync(`${SP}/canva/ufis-elements.json`, JSON.stringify(els, null, 1));
// Text boxes get 12% slack: Canva sizes a box to its text, and a browser's
// shaping of the same string runs a hair wider. Centred text keeps its centre.
const SLACK = 0.12; const tb = e => ({ x: e.align === "center" ? e.x - e.w * SLACK / 2 : e.x, w: e.w * (1 + SLACK) });
const GROUPS = { snap: ["phone-frame","app-shot-a","varshamitra"], socials: ["phone-black","whatsapp","x","linkedin","facebook","bluesky"],
  ai: ["ai-network","book-gears","ai-head"], maps: ["map-rain","map-uhi","map-risk","lbl-rain","lbl-uhi","lbl-risk"],
  phones: ["phone-frame-2","app-shot-a-2","phone-frame-3","app-shot-b"], alerts: ["telegram","whatsapp-2","alert-phone"], updown: ["ar-down","ar-up"] };
const byKey = Object.fromEntries(els.map(e => [e.key, e]));
const groupCss = [], memberOf = {};
for (const [g, keys] of Object.entries(GROUPS)) {
  const ms = keys.map(k => byKey[k]).filter(Boolean);
  const x0 = Math.min(...ms.map(m => m.x)), y0 = Math.min(...ms.map(m => m.y));
  const x1 = Math.max(...ms.map(m => m.x + m.w)), y1 = Math.max(...ms.map(m => m.y + (m.kind === "text" ? m.size * 1.2 * (m.text.split("\n").length) : m.h)));
  const gw = x1 - x0, gh = y1 - y0;
  groupCss.push(`.k-${g}{left:${pct(x0,PW)}%;top:${pct(y0,PH)}%;width:${pct(gw,PW)}%;aspect-ratio:${gw.toFixed(2)}/${gh.toFixed(2)}}`);
  for (const m of ms) { memberOf[m.key] = g;
    groupCss.push(m.kind === "text"
      ? `.k-${m.key}{left:${pct(tb(m).x-x0,gw)}%;top:${pct(m.y-y0,gh)}%;width:${pct(tb(m).w,gw)}%;font-size:calc(${m.size} * var(--px))}`
      : `.k-${m.key}{left:${pct(m.x-x0,gw)}%;top:${pct(m.y-y0,gh)}%;width:${pct(m.w,gw)}%;height:${pct(m.h,gh)}%}`); }
}
const css0 = els.filter(e => ["img", "frame", "arrow"].includes(e.kind)).map(e => boxCss(e.key, e.x, e.y, e.w, e.h))
  .concat(els.filter(e => e.kind === "text").map(e => `.k-${e.key}{left:${pct(tb(e).x,PW)}%;top:${pct(e.y,PH)}%;width:${pct(tb(e).w,PW)}%;font-size:calc(${e.size} * var(--px))}`))
  .concat(els.filter(e => e.kind === "line").map(e => e.x1 === e.x2
    ? `.k-${e.key}{left:${pct(e.x1,PW)}%;top:${pct(Math.min(e.y1,e.y2),PH)}%;height:${pct(Math.abs(e.y2-e.y1),PH)}%}`
    : `.k-${e.key}{left:${pct(e.x1,PW)}%;top:${pct(e.y1,PH)}%;width:${pct(e.x2-e.x1,PW)}%}`));
const css = ["/* board-relative */", ...css0.filter(l => !Object.keys(memberOf).some(k => l.startsWith(`.k-${k}{`))), "/* groups (board-relative) and their members (group-relative) */", ...groupCss];
fs.writeFileSync(`${SP}/canva/ufis-coords.css`, css.join("\n") + "\n");
const art = {}; for (const r of results) { const m = r.match(/^(\S+)\s.*→ (\d+)x(\d+) /); if (m) art[m[1]] = { w: +m[2], h: +m[3] }; }
fs.writeFileSync(`${SP}/canva/ufis-art.json`, JSON.stringify(art));
console.log(`\nelements: ${els.length} · images ${els.filter(e=>e.kind==="img").length} · texts ${els.filter(e=>e.kind==="text").length} · frames ${els.filter(e=>e.kind==="frame").length} · lines ${els.filter(e=>e.kind==="line").length} · arrows ${els.filter(e=>e.kind==="arrow").length}`);
for (const e of els.filter(e => e.kind === "text")) console.log(`  T ${e.key.padEnd(16)} ${e.size}px ${e.color} ${e.align.padEnd(6)} x=${e.x.toFixed(0)} y=${e.y.toFixed(0)} w=${e.w.toFixed(0)} :: ${JSON.stringify(e.text).slice(0,70)}`);
for (const e of els.filter(e => e.kind !== "text" && e.kind !== "img")) console.log(`  ${e.kind[0].toUpperCase()} ${e.key.padEnd(10)} ${JSON.stringify(e).slice(0, 150)}`);
