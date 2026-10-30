// Small deterministic hash (FNV-1a). The same input gives the same number on
// the server and in every browser, so generated art never mismatches.
export function hashStr(s: string): number {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Park-Miller random numbers from a seed: deterministic, unlike Math.random.
export function seeded(seed: number): () => number {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
