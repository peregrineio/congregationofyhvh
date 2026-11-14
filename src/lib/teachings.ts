// Pure helpers for the /teachings library (blueprint §3.2–3.4). No env, no
// network, no server-only: safe for client components and node tests.

// ── durations and dates

/** ISO 8601 duration → seconds. P0D, empty or invalid → undefined. */
export function parseIsoDuration(iso: string | null | undefined): number | undefined {
  if (!iso) return undefined;
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(iso);
  if (!m || iso === "P" || iso.endsWith("T")) return undefined;
  const [, d, h, min, s] = m;
  const total = Number(d ?? 0) * 86400 + Number(h ?? 0) * 3600 + Number(min ?? 0) * 60 + Math.floor(Number(s ?? 0));
  return total > 0 ? total : undefined;
}

/** Under an hour → m:ss; otherwise h:mm:ss. */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/** "November 13, 2026" in Central time (the page's existing date format). */
export function formatTeachingDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
