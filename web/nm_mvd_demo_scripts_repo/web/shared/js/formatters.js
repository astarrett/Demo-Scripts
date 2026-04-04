export function money(value) {
  const n = Number(value || 0);
  return `$${n.toFixed(2)}`;
}
export function text(value, fallback = '—') {
  return value === undefined || value === null || value === '' ? fallback : value;
}
