import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDay } from "./CalendarDay";
import { EventModal } from "./EventModal";
import { useMonthGrid, usePostsByDate } from "../hooks/useCalendarGrid";
import { addPost, selectAllPosts, reschedulePost } from "../store/postsSlice";

const pad = (n) => String(n).padStart(2, "0");
const toISODate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const createEmptyDraft = () => ({
  title: "",
  platform: "instagram",
  date: toISODate(new Date()),
  time: "09:00",
  content: "",
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function Calendar() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);

  const today = new Date();
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [draft, setDraft] = useState(createEmptyDraft);

  // useMemo-backed derived data (see hooks/useCalendarGrid.js)
  const days = useMonthGrid(cursor.year, cursor.month);
  const postsByDate = usePostsByDate(posts);

  // useCallback: these handlers are passed down into every CalendarDay /
  // PostEvent. Stable references let React.memo on those children actually
  // skip re-renders instead of seeing a "new" function prop every render.
  const handleSelectPost = useCallback((id) => {
    setSelectedPostId(id);
  }, []);

  const handleDropPost = useCallback(
    (postId, newDate) => {
      dispatch(reschedulePost({ id: postId, date: newDate }));
    },
    [dispatch],
  );

  const handleCreatePost = useCallback(() => {
    const title = draft.title.trim();
    const content = draft.content.trim();

    if (!title || !draft.date || !draft.time) return;

    dispatch(
      addPost({
        title,
        platform: draft.platform,
        date: draft.date,
        time: draft.time,
        content: content || "No description provided.",
      }),
    );

    setDraft(createEmptyDraft());
    setIsComposerOpen(false);
  }, [dispatch, draft]);

  const goToPrevMonth = useCallback(() => {
    setCursor((c) => {
      const m = c.month === 0 ? 11 : c.month - 1;
      const y = c.month === 0 ? c.year - 1 : c.year;
      return { year: y, month: m };
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCursor((c) => {
      const m = c.month === 11 ? 0 : c.month + 1;
      const y = c.month === 11 ? c.year + 1 : c.year;
      return { year: y, month: m };
    });
  }, []);

  const goToToday = useCallback(() => {
    const t = new Date();
    setCursor({ year: t.getFullYear(), month: t.getMonth() });
  }, []);

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  return (
    <div className="calendar">
      <div className="calendar-toolbar">
        <div className="calendar-toolbar__nav">
          <button className="btn" onClick={goToPrevMonth} aria-label="Previous month">
            ‹
          </button>
          <button className="btn" onClick={goToToday}>
            Today
          </button>
          <button className="btn" onClick={goToNextMonth} aria-label="Next month">
            ›
          </button>
        </div>
        <h2 className="calendar-toolbar__title">
          {MONTH_NAMES[cursor.month]} {cursor.year}
        </h2>
        <button className="btn btn--primary" onClick={() => setIsComposerOpen(true)}>
          New Post
        </button>
      </div>

      <div className="calendar-grid calendar-grid--header">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="calendar-weekday">
            {wd}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day) => (
          <CalendarDay
            key={day.iso}
            day={day}
            posts={postsByDate[day.iso] || []}
            onSelectPost={handleSelectPost}
            onDropPost={handleDropPost}
          />
        ))}
      </div>

      {selectedPost && <EventModal post={selectedPost} onClose={() => setSelectedPostId(null)} />}

      {isComposerOpen && (
        <div className="modal-overlay" onClick={() => setIsComposerOpen(false)} data-testid="new-post-modal">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create post</h3>

            <label htmlFor="new-post-title">
              Title
              <input
                id="new-post-title"
                value={draft.title}
                onChange={(e) => setDraft((current) => ({ ...current, title: e.target.value }))}
              />
            </label>

            <label htmlFor="new-post-platform">
              Platform
              <select
                id="new-post-platform"
                value={draft.platform}
                onChange={(e) => setDraft((current) => ({ ...current, platform: e.target.value }))}
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
              </select>
            </label>

            <label htmlFor="new-post-date">
              Date
              <input
                id="new-post-date"
                type="date"
                value={draft.date}
                onChange={(e) => setDraft((current) => ({ ...current, date: e.target.value }))}
              />
            </label>

            <label htmlFor="new-post-time">
              Time
              <input
                id="new-post-time"
                type="time"
                value={draft.time}
                onChange={(e) => setDraft((current) => ({ ...current, time: e.target.value }))}
              />
            </label>

            <label htmlFor="new-post-content">
              Content
              <textarea
                id="new-post-content"
                value={draft.content}
                onChange={(e) => setDraft((current) => ({ ...current, content: e.target.value }))}
              />
            </label>

            <div className="modal-actions">
              <div className="modal-actions__right">
                <button className="btn" onClick={() => setIsComposerOpen(false)}>
                  Cancel
                </button>
                <button className="btn btn--primary" onClick={handleCreatePost}>
                  Save Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
