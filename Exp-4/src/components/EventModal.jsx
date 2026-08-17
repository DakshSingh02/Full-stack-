import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updatePost, deletePost } from "../store/postsSlice";

export function EventModal({ post, onClose }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(post.title);
  const [time, setTime] = useState(post.time);
  const [content, setContent] = useState(post.content);

  // keep local form state in sync if a different post is selected
  useEffect(() => {
    setTitle(post.title);
    setTime(post.time);
    setContent(post.content);
  }, [post]);

  const handleSave = () => {
    dispatch(updatePost({ id: post.id, changes: { title, time, content } }));
    onClose();
  };

  const handleDelete = () => {
    dispatch(deletePost(post.id));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="event-modal">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit post</h3>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Time
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <label>
          Content
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
        <div className="modal-actions">
          <button className="btn btn--danger" onClick={handleDelete}>
            Delete
          </button>
          <div className="modal-actions__right">
            <button className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
