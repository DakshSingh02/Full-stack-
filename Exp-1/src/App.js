
import React, { useEffect, useState } from "react";
import PostComposer from "./components/PostComposer";
import DraftList from "./components/DraftList";
import "./App.css";

function App() {
  const [drafts, setDrafts] = useState([]);
  const [editingDraft, setEditingDraft] = useState(null);

  // Load drafts from localStorage
  useEffect(() => {
    const savedDrafts = localStorage.getItem("drafts");

    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  // Save drafts to localStorage
  useEffect(() => {
    localStorage.setItem("drafts", JSON.stringify(drafts));
  }, [drafts]);

  // Save or update draft
  const saveDraft = (draft) => {
    if (editingDraft) {
      setDrafts((prevDrafts) =>
        prevDrafts.map((item) =>
          item.id === editingDraft.id
            ? {
                ...draft,
                id: editingDraft.id,
              }
            : item
        )
      );

      setEditingDraft(null);
    } else {
      const newDraft = {
        ...draft,
        id: Date.now(),
      };

      setDrafts((prevDrafts) => [
        ...prevDrafts,
        newDraft,
      ]);
    }
  };

  // Edit draft
  const editDraft = (draft) => {
    setEditingDraft(draft);
  };

  // Delete draft
  const deleteDraft = (id) => {
    setDrafts((prevDrafts) =>
      prevDrafts.filter((draft) => draft.id !== id)
    );
  };

  return (
    <div className="App">
      <h1>Social Media Post Composer</h1>

      <PostComposer
        onSaveDraft={saveDraft}
        editingDraft={editingDraft}
      />

      <DraftList
        drafts={drafts}
        onEdit={editDraft}
        onDelete={deleteDraft}
      />
    </div>
  );
}

export default App;

