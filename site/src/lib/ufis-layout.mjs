/**
 * The geometry and the timing of the UFIS illustration, in one place.
 *
 * The board is a 1200 × 620 sheet. Everything on it — the four stage panels,
 * the tiles, the labels, the water between the panels — is expressed in
 * those units, and the story's clock is expressed as fractions of one loop.
 * Two consumers turn this into what they need:
 *
 *   - src/components/UfisDiagram.astro builds the SVG (channels, panels,
 *     hairlines, ripples, the return) from these exports;
 *   - scripts/ufis-coords.mjs writes src/styles/ufis-coords.css: the
 *     percentage boxes that place every HTML tile and label, and the
 *     keyframes that time every channel, ripple and panel from these numbers.
 *
 * Change a number here, run `node scripts/ufis-coords.mjs`, rebuild.
 *
 * Reading order is left to right: 1 Data Inputs → 2 Models & Forecasting →
 * 3 Tools: Products & Services → 4 Decision Support & Policy. Each stage is a
 * panel; water runs only in the gutters and tucks under the panel edges, so
 * it is seen to enter and leave. Two tributaries leave the inputs and
 * converge into one stem that enters the models (the pool); the outlet
 * divides into two distributaries that enter the tools; two channels leave
 * the tools and converge into one outfall that enters policy. One dashed
 * return runs back beneath, the slide's own up-arrow.
 */

export const BOARD = { w: 1200, h: 620 };

/** Stage panels [x, y, w, h]. Strokes sit wholly inside the sheet. */
export const PANELS = {
  s1: [1, 40, 319, 560],
  s2: [400, 40, 170, 560],
  s3: [640, 40, 280, 560],
  s4: [1020, 40, 179, 560],
};

/** The heading hairline: full panel width, at y. */
export const HAIRLINE = { y: 96 };

/** Row centres (y) the water meets each panel at. */
export const Y = {
  in: [167, 510],       // the upper and lower input rows
  tools: [141, 540],    // the maps row and the dashboards row
  merge: 345,           // the confluence, the pool inlet and outlet, the outfall
};

/**
 * Artwork boxes [x, y, w, h]. Heights follow each file's own aspect (see
 * src/lib/ufis.ts); groups take a width and keep their aspect-ratio.
 */
export const TILES = {
  satellite:      [26, 128, 92, 78],
  aws:            [140, 128, 59, 78],
  hydromet:       [214, 126, 63, 78],
  community:      [128, 292, 85, 84],
  geospatial:     [22, 462, 96, 95],
  weather:        [428, 108, 124, 119],
  hydro:          [428, 285, 124, 101],
  "map-rain":     [652, 112, 78, 58],
  "map-uhi":      [738, 112, 78, 57],
  "map-risk":     [824, 112, 78, 59],
  "flood-map":    [727, 234, 106, 76],
  dashboard:      [742, 504, 76, 72],
  disaster:       [1062, 116, 96, 95],
  mitigation:     [1062, 278, 96, 84],
  stakeholders:   [1050, 436, 120, 87],
};

/** Composite pieces of the slide that stay together: [x, y, w, aspect]. */
export const GROUPS = {
  snap:    [22, 292, 95, "149.21/131.68"],
  socials: [222, 287, 76, "133.90/165.50"],
  ai:      [434, 445, 112, "250.62/251.27"],
  phones:  [656, 364, 96, "182.00/154.91"],
  alerts:  [790, 362, 86, "161.19/167.48"],
};

/** Text boxes [x, y, w, size]; alignment and style come from the component's classes. */
export const TEXTS = {
  "hd-1":       [1, 58, 319, 18],
  "hd-2":       [400, 58, 170, 18],
  "hd-3":       [640, 58, 280, 18],
  "hd-4":       [1020, 58, 179, 18],
  "g-1":        [1, 106, 319, 15],
  "g-2":        [1, 271, 319, 15],
  "g-3":        [1, 436, 319, 15],
  "l-satellite":   [10, 211, 110, 15],
  "l-aws":         [122, 211, 80, 15],
  "l-hydromet":    [204, 211, 112, 15],
  "l-snap":        [10, 382, 119, 16],
  "list-geo":      [124, 458, 190, 15],
  "l-weather":     [410, 233, 150, 16],
  "l-hydro":       [410, 392, 150, 16],
  "l-ai":          [410, 563, 150, 16],
  "l-rain":        [645, 174, 92, 14],
  "l-uhi":         [731, 174, 92, 14],
  "l-risk":        [817, 174, 92, 14],
  "l-flood":       [700, 314, 160, 16],
  "l-phones":      [640, 456, 128, 16],
  "l-alerts":      [758, 456, 150, 15],
  "l-dash":        [705, 580, 150, 16],
  "l-disaster":    [1040, 217, 140, 15],
  "l-mitigation":  [1036, 368, 148, 15],
  "l-stakeholders": [1036, 529, 148, 15],
};

/** The bead's speed, in board units per second. Every channel's window is derived from it. */
export const SPEED = 230;

/**
 * The water between the panels. Each channel is one SVG path drawn four
 * times: the channel, a gliding glint, the bead that carries the pulse and
 * its halo. `arrive` is the fraction of the loop at which the bead reaches
 * the channel's end; the generator computes when it must leave from the
 * path's length, so parallel streams arrive together. `r` is the
 * scroll-reveal slot, `width` the stroke in board units. Channels start and
 * end a few units under a panel edge, so the water is seen to enter and
 * leave. Inside a panel the pulse is out of sight — in the pool, among the
 * tools — and the panel fills while it is there.
 */
export const CHANNELS = [
  // 1 → gap 1: two tributaries converge into the stem
  { id: "t1", d: "M312 167 C354 167 338 345 380 345", width: 6, arrive: 0.11, r: "g1" },
  { id: "t3", d: "M312 510 C354 510 338 345 380 345", width: 6, arrive: 0.11, r: "g1" },
  { id: "stem", d: "M380 345 H408", width: 9, arrive: 0.122, r: "g1" },
  // gap 2: the delta, two distributaries
  { id: "d1", d: "M562 345 C612 345 598 141 648 141", width: 6, arrive: 0.40, r: "g2" },
  { id: "d4", d: "M562 345 C612 345 598 540 648 540", width: 6, arrive: 0.40, r: "g2" },
  // gap 3: two channels converge into the outfall, which enters policy
  { id: "c1", d: "M912 141 C952 141 942 345 982 345", width: 6, arrive: 0.645, r: "g3" },
  { id: "c4", d: "M912 540 C952 540 942 345 982 345", width: 6, arrive: 0.645, r: "g3" },
  { id: "out", d: "M982 345 H1028", width: 9, arrive: 0.662, r: "g3" },
];

/** The slide's up-arrow: policy back to the tools, the one dashed, counter-current channel. */
export const RETURN = { id: "ret", d: "M1110 590 V614 H790 V602", chevron: "M783 609 L790 602 L797 609", width: 6, arrive: 0.95 };

/**
 * Ripples: a ring opens where the bead meets a panel edge — when it leaves
 * a channel's start or reaches its end. [x, y, channel, "start" | "end"].
 */
export const RIPPLES = [
  [320, 167, "t1", "start"], [320, 510, "t3", "start"],
  [400, 345, "stem", "end"],
  [570, 345, "d1", "start"],
  [640, 141, "d1", "end"], [640, 540, "d4", "end"],
  [920, 141, "c1", "start"], [920, 540, "c4", "start"],
  [1020, 345, "out", "end"],
];

/**
 * When the pulse is inside each stage, as fractions of the loop. The panel
 * fills with the pool tint, the numeral turns and the pictures move then.
 */
export const FOCUS = {
  s1: [0.0, 0.11],
  s2: [0.122, 0.30],
  s3: [0.40, 0.54],
  s4: [0.662, 0.80],
};

/** The loop, in seconds. */
export const LOOP = 12;
