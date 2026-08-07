import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveDraft, publishPost } from '../features/posts/postsSlice';
import { 
  selectAllPlatforms, 
  selectSelectedPlatformId, 
  setSelectedPlatform 
} from '../features/platforms/platformsSlice';

export function PostComposer() {
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState(null);
  const dispatch = useDispatch();

  const platforms = useSelector(selectAllPlatforms);
  const selectedPlatformId = useSelector(selectSelectedPlatformId);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleSaveDraft = () => {
    if (!content.trim() && !attachment) return;
    dispatch(
      saveDraft({
        id: `draft_${Date.now()}`,
        content,
        platformId: selectedPlatformId,
        attachment,
        createdAt: new Date().toISOString(),
      })
    );
    setContent('');
    setAttachment(null);
  };

  const handlePublish = () => {
    if (!content.trim() && !attachment) return;
    dispatch(
      publishPost({
        id: `post_${Date.now()}`,
        content,
        platformId: selectedPlatformId,
        attachment,
        createdAt: new Date().toISOString(),
      })
    );
    setContent('');
    setAttachment(null);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>✨ Compose Post</h3>
        <div style={styles.platformBadge}>
          <label style={styles.platformLabel}>Target Platform:</label>
          <select
            value={selectedPlatformId}
            onChange={(e) => dispatch(setSelectedPlatform(e.target.value))}
            style={styles.select}
          >
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        rows="4"
        style={styles.textarea}
        placeholder="What's on your mind? Draft your thoughts here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Attachment area */}
      <div style={styles.attachmentContainer}>
        <label htmlFor="file-upload" style={styles.uploadButton}>
          📎 Attach Media
        </label>
        <input 
          id="file-upload" 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*,video/*,.pdf" 
          style={{ display: 'none' }} 
        />
        
        {attachment && (
          <div style={styles.attachmentChip}>
            <span>{attachment.name}</span>
            <button onClick={() => setAttachment(null)} style={styles.removeBtn}>
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={styles.footer}>
        <button onClick={handleSaveDraft} style={styles.secondaryBtn}>
          💾 Save as Draft
        </button>
        <button onClick={handlePublish} style={styles.primaryBtn}>
          🚀 Publish Now
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    border: '1px solid #e2e8f0',
    marginBottom: '28px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
  },
  platformLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    marginRight: '8px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit',
    outline: 'none',
  },
  attachmentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '12px',
    marginBottom: '20px',
  },
  uploadButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 14px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    border: '1px solid #e2e8f0',
  },
  attachmentChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  removeBtn: {
    border: 'none',
    background: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  secondaryBtn: {
    padding: '10px 18px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#334155',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  primaryBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default PostComposer;