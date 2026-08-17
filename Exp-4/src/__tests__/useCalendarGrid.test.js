import { renderHook } from "@testing-library/react";
import { useMonthGrid, usePostsByDate } from "../hooks/useCalendarGrid";

describe("useMonthGrid", () => {
  test("always produces a full 42-cell (6-week) grid", () => {
    const { result } = renderHook(() => useMonthGrid(2026, 7)); // August 2026
    expect(result.current).toHaveLength(42);
  });

  test("marks the correct number of days as belonging to the current month", () => {
    const { result } = renderHook(() => useMonthGrid(2026, 7)); // August 2026 has 31 days
    const currentMonthDays = result.current.filter((d) => d.isCurrentMonth);
    expect(currentMonthDays).toHaveLength(31);
  });

  test("memoizes: same year/month args return a stable reference across renders", () => {
    const { result, rerender } = renderHook(({ y, m }) => useMonthGrid(y, m), {
      initialProps: { y: 2026, m: 7 },
    });
    const first = result.current;
    rerender({ y: 2026, m: 7 });
    expect(result.current).toBe(first); // reference equality proves memoization
  });

  test("recomputes when the month argument changes", () => {
    const { result, rerender } = renderHook(({ y, m }) => useMonthGrid(y, m), {
      initialProps: { y: 2026, m: 7 },
    });
    const first = result.current;
    rerender({ y: 2026, m: 8 });
    expect(result.current).not.toBe(first);
  });
});

describe("usePostsByDate", () => {
  const posts = [
    { id: "1", date: "2026-08-20", time: "10:00", title: "A" },
    { id: "2", date: "2026-08-20", time: "08:00", title: "B" },
    { id: "3", date: "2026-08-21", time: "09:00", title: "C" },
  ];

  test("groups posts by ISO date", () => {
    const { result } = renderHook(() => usePostsByDate(posts));
    expect(Object.keys(result.current)).toEqual(["2026-08-20", "2026-08-21"]);
  });

  test("sorts each day's posts by time ascending", () => {
    const { result } = renderHook(() => usePostsByDate(posts));
    expect(result.current["2026-08-20"].map((p) => p.id)).toEqual(["2", "1"]);
  });

  test("memoizes on the posts array reference", () => {
    const { result, rerender } = renderHook(({ p }) => usePostsByDate(p), {
      initialProps: { p: posts },
    });
    const first = result.current;
    rerender({ p: posts }); // same reference
    expect(result.current).toBe(first);
  });
});
