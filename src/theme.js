// Shared visual constants for the Kraken Elite dashboard.
// ROG STRIX "white" aesthetic: brushed-silver surfaces, graphite text, chrome accents.

export const SCREEN = 640; // px, square stage CAM renders onto the round LCD

export const colors = {
  text: '#343b45', // graphite (cool, silver-leaning)
  textDim: '#98a0ac', // silver-gray
  track: '#d4d8e0', // light silver track
  accent: '#e23744', // ROG crimson — single flat accent used everywhere
  // Power-chart series: crimson (CPU) + graphite (GPU) so the two lines stay distinct.
  cpu: '#e23744',
  gpu: '#6b7280',
};

// Shared type scale — used across gauges, tiles, and the power label so every
// label / hero value / unit / detail is sized and weighted consistently.
export const type = {
  value: { size: '3.2rem', weight: 800 }, // hero numbers: temp °, load %
  label: { size: '1.45rem', weight: 700 }, // CPU / GPU / RAM / POWER
  unit: { size: '1.3rem', weight: 700 }, // °, %, W
  detail: { size: '1.3rem', weight: 600 }, // GHz / GB
};

// Faint grayscale film-grain (inline SVG) for a brushed/metal surface texture.
export const noise =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.05'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
