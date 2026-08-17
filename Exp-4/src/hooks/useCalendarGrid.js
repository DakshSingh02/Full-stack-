import { useMemo } from "react";

const pad = (n) => String(n).padStart(2, "0");
export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * Builds a 6-week (42 cell) month grid for the given year/month,
 * including the leading/trailing days from adjacent months so the
 * grid is always a full rectangle (standard month-view calendar layout).
 *
 * Wrapped in useMemo because this involves date-object construction
 * for 42 cells - cheap once, wasteful if recomputed on every keystroke
 * or unrelated state change (e.g. opening a modal). This directly
 * demonstrates the "optimize rendering" objective of Experiment 1.4.2.
 */
export function useMonthGrid(year, month) {
  return useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay(); // 0 = Sunday
    const gridStart = new Date(year, month, 1 - startOffset);

    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push({
        date: d,
        iso: toISODate(d),
        isCurrentMonth: d.getMonth() === month,
        isToday: toISODate(d) === toISODate(new Date()),
      });
    }
    return days;
  }, [year, month]);
}

/**
 * Groups the flat posts array into a { [isoDate]: Post[] } map.
 * Event mapping: linking posts to time slots (1.4.1 objective).
 *
 * useMemo here avoids re-grouping the entire post list on every
 * render - only recomputes when the `posts` array reference changes.
 */
export function usePostsByDate(posts) {
  return useMemo(() => {
    const map = {};
    for (const post of posts) {
      if (!map[post.date]) map[post.date] = [];
      map[post.date].push(post);
    }
    // keep each day's posts sorted by time for predictable rendering
    Object.values(map).forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [posts]);
}
