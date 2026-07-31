import React, { memo } from "react";

const DraftItem = memo(({ item, isPublished, onDelete }) => {
  return (
    <div className="draft-card">
      <span className="badge">
        {item.platform ? item.platform.toUpperCase() : "GENERAL"}
      </span>

      <p>{item.content}</p>

      {item.mediaName && (
        <>
          <p>📎 {item.mediaName}</p>
          <a href={item.mediaURL} target="_blank" rel="noopener noreferrer">
            Open File
          </a>
        </>
      )}

      {isPublished ? (
        <p style={{ color: "#10b981", fontWeight: "bold", marginTop: "10px" }}>
          ✔ Published Successfully
        </p>
      ) : (
        <div className="button-group">
          <button className="delete-btn" onClick={() => onDelete(item.id)}>
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
});

DraftItem.displayName = "DraftItem";
export default DraftItem;