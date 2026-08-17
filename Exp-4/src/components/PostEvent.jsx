import React, { memo } from "react";
import { PLATFORM_COLORS } from "../data/samplePosts";

/**
 * A single scheduled post rendered inside a day cell.
 *
 * Wrapped in React.memo (1.4.2 objective: "reduce unnecessary re-renders").
 * Without memo, every PostEvent in the whole month would re-render whenever
 * ANY post changes (e.g. dragging one event re-renders all 42 day cells'
 * worth of events). memo() means a given PostEvent only re-renders when its
 * own `post` object reference or `onSelect`/`onDragStart` props actually change.
 */
function PostEventBase({ post, onSelect, onDragStart }) {
  return (
    <div
      className="post-event"
      draggable
      onDragStart={(e) => onDragStart(e, post.id)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(post.id);
      }}
      style={{ borderLeftColor: PLATFORM_COLORS[post.platform] || "#888" }}
      title={`${post.time} · ${post.title}`}
      data-testid={`post-event-${post.id}`}
    >
      <span className="post-time">{post.time}</span>
      <span className="post-title">{post.title}</span>
      {post.status === "draft" && <span className="post-badge">draft</span>}
    </div>
  );
}

export const PostEvent = memo(PostEventBase);
