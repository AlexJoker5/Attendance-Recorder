export function formatPercentage(value: number | null) {
  return value === null ? '—' : value.toFixed(1) + '%';
}
