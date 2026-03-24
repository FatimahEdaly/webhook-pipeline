export function sortAsc(data: number[]) {
  return [...data].sort((a, b) => a - b);
}

export function sortDesc(data: number[]) {
  return [...data].sort((a, b) => b - a);
}

export function upperCase(data: Record<string, string | number>) {
  const entries = Object.entries(data).map(([key, value]) => [
    key,
    typeof value === "string" ? value.toUpperCase() : value,
  ]);

  return Object.fromEntries(entries);
}
