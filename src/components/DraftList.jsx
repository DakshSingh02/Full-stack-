import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectFilteredDrafts, 
  deleteDraft, 
  publishPost, 
  setSearchQuery,
  setPlatformFilter 
} from '../features/posts/postsSlice';
import { selectAllPlatforms } from '../features/platforms/platformsSlice';

export function DraftList() {
  const drafts = useSelector(selectFilteredDrafts) || [];
  const platforms = useSelector(selectAllPlatforms);
  const searchQuery = useSelector((state) => state.posts.searchQuery || '');
  const platformFilter = useSelector((state) => state.posts.platformFilter || 'all');
  const dispatch = useDispatch();

  const getPlatformName = (platformId) => {
    if (!platformId) return 'General Draft';
    const match = platforms.find((p) => p.id === platformId);
    return match ? match.name : 'General Draft';
  };

  return (
    <div style={styles.card}>
      {/* Header and Controls Area */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>📂 Saved Drafts</h3>
          <span style={styles.badge}>{drafts.length} total</span>
        </div>

        <div style={styles.controls}>
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => dispatch(setPlatformFilter(e.target.value))}
            style={styles.select}
          >
            <option value="all">All Platforms</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              style={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* List Content */}
      {drafts.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ margin: 0, fontSize: '15px' }}>
            {searchQuery || platformFilter !== 'all'
              ? 'No drafts found matching your filters.'
              : 'No drafts created yet.'}
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {drafts.map((draft) => (
            <div key={draft.id} style={styles.listItem}>
              <div style={styles.draftContent}>
                <p style={styles.draftText}>
                  {draft.content || <span style={{ color: '#94a3b8' }}>(Empty draft body)</span>}
                </p>

                {draft.attachment && (
                  <div style={styles.attachmentBadge}>
                    📎 {draft.attachment.name}
                  </div>
                )}

                <div style={styles.metaRow}>
                  <span style={styles.platformTag}>
                    {getPlatformName(draft.platformId)}
                  </span>
                  <span style={styles.timestamp}>
                    {draft.createdAt ? new Date(draft.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() => dispatch(publishPost(draft))}
                  style={styles.publishBtn}
                >
                  Publish
                </button>
                <button
                  onClick={() => dispatch(deleteDraft(draft.id))}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
  },
  title: {
    display: 'inline-block',
    margin: '0 8px 0 0',
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
  },
  badge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13px',
    fontWeight: '500',
    color: '#334155',
    outline: 'none',
  },
  searchWrapper: {
    position: 'relative',
  },
  searchInput: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '13px',
    color: '#1e293b',
    outline: 'none',
    width: '160px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #f1f5f9',
    backgroundColor: '#fafafa',
  },
  draftContent: {
    flex: 1,
    marginRight: '16px',
  },
  draftText: {
    margin: '0 0 8px 0',
    fontSize: '15px',
    fontWeight: '500',
    color: '#1e293b',
  },
  attachmentBadge: {
    fontSize: '12px',
    color: '#2563eb',
    marginBottom: '8px',
    fontWeight: '500',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  platformTag: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  timestamp: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  publishBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#10b981',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #fee2e2',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
  },
};

export default DraftList;