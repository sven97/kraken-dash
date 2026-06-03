// Shared visual constants for the Kraken Elite dashboard.

export const SCREEN = 640; // px, square stage CAM renders onto the round LCD
export const INSCRIBED = Math.round(SCREEN / Math.SQRT2); // ~452px safe square inside the circle

export const colors = {
  bg: '#000000',
  panel: '#0c0e12',
  text: '#ffffff',
  textDim: '#8b9099',
  track: '#23272e',
  divider: '#2a2f37',
  cpu: '#3da9fc', // blue
  gpu: '#2bd576', // green
  ram: '#c084fc', // purple
  liquid: '#43d9d9', // teal
};

// Temperature -> color, matching the aviation reference thresholds.
export function tempColor(t) {
  if (t == null) return colors.textDim;
  if (t < 60) return '#2bd576'; // green
  if (t < 80) return '#ffa500'; // orange
  return '#ff3b3b'; // red
}

// Load (0..100) -> color.
export function loadColor(v) {
  if (v == null) return colors.textDim;
  if (v < 60) return '#2bd576';
  if (v < 85) return '#ffa500';
  return '#ff3b3b';
}
