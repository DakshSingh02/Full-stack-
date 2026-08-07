import React from "react";
import "./DraftList.css";

function DraftList({ drafts, onEdit, onDelete }) {
  return (
    <div className="draft-list">
      <h2>Saved Drafts</h2>

      {drafts.length === 0 ? (
        <p>No drafts available.</p>
      ) : (
        drafts.map((draft) => (
          <div className="draft" key={draft.id}>
            <p>{draft.content}</p>

            <small>
              Platforms: {draft.platforms.join(", ")}
            </small>

            <div className="draft-buttons">
              <button onClick={() => onEdit(draft)}>
                Edit
              </button>

              <button onClick={() => onDelete(draft.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DraftList;

