import React, { useEffect, useState } from "react";
import { validatePost, platformLimits } from "../utils/validationStrategy";
import "./PostComposer.css";

function PostComposer({ onSaveDraft, editingDraft }) {
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [errors, setErrors] = useState({});

  // Load draft when Edit is clicked
  useEffect(() => {
    if (editingDraft) {
      setContent(editingDraft.content);
      setPlatforms(editingDraft.platforms);
    }
  }, [editingDraft]);

  // Real-time validation
  useEffect(() => {
    const validationErrors = validatePost(content, platforms);
    setErrors(validationErrors);
  }, [content, platforms]);

  // Select / unselect platform
  const handlePlatformChange = (platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // Save draft
  const handleSaveDraft = () => {
    if (!content.trim()) {
      alert("Please enter some content.");
      return;
    }

    onSaveDraft({
      content,
      platforms,
    });

    setContent("");
    setPlatforms([]);
  };

  // Publish post
  const handlePublish = () => {
    if (!content.trim()) {
      alert("Please enter some content.");
      return;
    }

    if (platforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    if (Object.keys(errors).length > 0) {
      alert("Please fix the validation errors before publishing.");
      return;
    }

    alert(`Post published to: ${platforms.join(", ")}`);
  };

  return (
    <div className="composer">
      <h2>Create Post</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post here..."
      />

      <h3>Select Platforms</h3>

      <label>
        <input
          type="checkbox"
          checked={platforms.includes("twitter")}
          onChange={() => handlePlatformChange("twitter")}
        />
        Twitter
      </label>

      <label>
        <input
          type="checkbox"
          checked={platforms.includes("linkedin")}
          onChange={() => handlePlatformChange("linkedin")}
        />
        LinkedIn
      </label>

      <label>
        <input
          type="checkbox"
          checked={platforms.includes("instagram")}
          onChange={() => handlePlatformChange("instagram")}
        />
        Instagram
      </label>

      {/* Character counters */}
      {platforms.length > 0 && (
        <div className="counters">
          <h4>Character Count</h4>

          {platforms.map((platform) => (
            <p key={platform}>
              {platform}: {content.length}/{platformLimits[platform]}
            </p>
          ))}
        </div>
      )}

      {/* Validation errors */}
      {Object.keys(errors).length > 0 && (
        <div className="errors">
          {Object.entries(errors).map(([platform, error]) => (
            <p key={platform}>
              ❌ {platform}: {error}
            </p>
          ))}
        </div>
      )}

      <div className="composer-buttons">
        <button onClick={handleSaveDraft}>
          Save Draft
        </button>

        <button onClick={handlePublish}>
          Publish
        </button>
      </div>
    </div>
  );
}

export default PostComposer;

