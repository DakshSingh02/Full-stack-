import React, { memo, useState } from "react";
import { PostEvent } from "./PostEvent";

/**
 * A single day cell in the month grid. Renders the posts scheduled on
 * that day and acts as a drop target for drag-and-drop rescheduling.
 *
 * Wrapped in React.memo: with 42 day cells rendered per month, this is
 * the single biggest win against unnecessary re-renders. A cell only
 * re-renders when its own props change (its date, its posts array, or
 * the callback references) - not when an unrelated cell's posts change.
 */
function CalendarDayBase({ day, posts, onSelectPost, onDropPost }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const postId = e.dataTransfer.getData("text/post-id");
    if (postId) onDropPost(postId, day.iso);
  };

  const handleDragStart = (e, postId) => {
    e.dataTransfer.setData("text/post-id", postId);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={[
        "calendar-day",
        !day.isCurrentMonth && "calendar-day--muted",
        day.isToday && "calendar-day--today",
        isDragOver && "calendar-day--drag-over",
      ]
        .filter(Boolean)
        .join(" ")}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`calendar-day-${day.iso}`}
    >
      <div className="calendar-day__number">{day.date.getDate()}</div>
      <div className="calendar-day__events">
        {posts.map((post) => (
          <PostEvent
            key={post.id}
            post={post}
            onSelect={onSelectPost}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
}

// Custom comparison: only re-render if this day's own post list or
// identity actually changed - guards against parent re-renders that
// don't affect this particular cell.
function areEqual(prev, next) {
  return (
    prev.day.iso === next.day.iso &&
    prev.posts === next.posts &&
    prev.onSelectPost === next.onSelectPost &&
    prev.onDropPost === next.onDropPost
  );
}

export const CalendarDay = memo(CalendarDayBase, areEqual);
