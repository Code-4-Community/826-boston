import { useEffect, useMemo, useState } from 'react';
import '../../containers/create-publication-modal/styles.css';
import apiClient from '../../api/apiClient';
import { StoryDraft } from '../../types';

interface Props {
  anthologyId: number;
  onClose: () => void;
  onSaved: () => void;
}

// TODO: confirm with the ticket author which fields count as checkpoints.
function getUnmetCheckpoints(draft: StoryDraft): string[] {
  const unmet: string[] = [];
  if (!draft.proofread) unmet.push('Proofreading');
  return unmet;
}

export default function AddDocumentModal({
  anthologyId,
  onClose,
  onSaved,
}: Props) {
  const [drafts, setDrafts] = useState<StoryDraft[]>([]);
  const [query, setQuery] = useState('');
  const [selectedDraft, setSelectedDraft] = useState<StoryDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only drafts that are not approved yet (inManuscript = false)
  useEffect(() => {
    apiClient
      .getStoryDrafts(anthologyId, false)
      .then(setDrafts)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load drafts.'),
      )
      .finally(() => setLoading(false));
  }, [anthologyId]);

  // The frontend variable: drafts filtered by the author's name
  const filteredDrafts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return drafts.filter((d) =>
      (d.story?.author?.name ?? '').toLowerCase().includes(q),
    );
  }, [drafts, query]);

  const handleSelect = (draft: StoryDraft) => {
    setSelectedDraft(draft);
    setQuery('');
  };

  const handleAdd = async () => {
    if (!selectedDraft) return;
    setSaving(true);
    setError(null);
    try {
      await apiClient.updateStoryDraft(selectedDraft.id, {
        inManuscript: true,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add document.');
    } finally {
      setSaving(false);
    }
  };

  const unmet = selectedDraft ? getUnmetCheckpoints(selectedDraft) : [];
  const author = selectedDraft?.story?.author;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <div className="modal__header-row">
            <h1 className="modal__title">Search for a student draft</h1>
            <button className="modal__close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="modal__body">
          {error && (
            <div className="field" style={{ color: 'var(--error, #d32f2f)' }}>
              {error}
            </div>
          )}

          <div className="field">
            <input
              className="input"
              placeholder="Search by student name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading || saving}
            />
            {query.trim() && (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {filteredDrafts.length === 0 ? (
                  <li style={{ padding: '8px' }}>No matching drafts</li>
                ) : (
                  filteredDrafts.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleSelect(d)}
                      >
                        {d.story?.author?.name}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {selectedDraft && (
            <div className="field">
              <strong>{author?.name}</strong>
              <div>{author?.bio ?? 'No bio'}</div>
              <div>Grade: {author?.grade ?? '—'}</div>
              <a
                href={selectedDraft.docLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Document
              </a>
              {unmet.length > 0 && (
                <div style={{ color: 'var(--error, #d32f2f)' }}>
                  Checkpoints {unmet.join(', ')} have not been met yet.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal__footer">
          <div className="modal__footer-right">
            <button
              className="btn btn--secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="btn btn--primary"
              onClick={handleAdd}
              disabled={!selectedDraft || saving}
            >
              {saving ? 'Adding...' : 'Add document'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
