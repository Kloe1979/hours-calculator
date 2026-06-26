export function round2(value) {
  return Math.round(value * 100) / 100;
}

export function formatPercent3(value) {
  return `${(value * 100).toFixed(3)}%`;
}
