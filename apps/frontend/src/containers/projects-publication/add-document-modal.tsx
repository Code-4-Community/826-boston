import { useEffect, useMemo, useState } from 'react';
import '../../containers/create-publication-modal/styles.css';
import apiClient from '../../api/apiClient';
import { StoryDraft } from '../../types';
import SearchIcon from '../../assets/icons/search.svg';
import { STORY_DRAFT_CHECKPOINTS } from './checkpoints';
import './add-document-modal.css';

interface Props {
  anthologyId: number;
  onClose: () => void;
  onSaved: () => void;
}

function getUnmetCheckpoints(draft: StoryDraft): string[] {
  return STORY_DRAFT_CHECKPOINTS.filter(
    (checkpoint) => !draft.checkpoints?.[checkpoint.id],
  ).map((checkpoint) => checkpoint.label);
}

function ordinal(n: number): string {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th';
  return `${n}${suffix}`;
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

  // Drafts whose author name has a word starting with the query (e.g. "b" -> Bhuvan, Brenda)
  const filteredDrafts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return drafts.filter((d) =>
      (d.story?.author?.name ?? '')
        .toLowerCase()
        .split(/\s+/)
        .some((word) => word.startsWith(q)),
    );
  }, [drafts, query]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedDraft(null);
  };

  const handleSelect = (draft: StoryDraft) => {
    setSelectedDraft(draft);
    setQuery(draft.story?.author?.name ?? '');
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
      <div className="modal add-doc">
        <div className="modal__header">
          <div className="modal__header-row">
            <h1 className="modal__title">Search for a student draft</h1>
            <button
              className="modal__close"
              onClick={onClose}
              aria-label="Close"
            >
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

          {/* Ask Aaron about what to do for css/design here */}
          <div className="field">
            <label className="field__label">Student</label>
            <div className="add-doc__search">
              <input
                className="input"
                placeholder="Search for a student..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                disabled={loading || saving}
              />
              <img src={SearchIcon} alt="" className="add-doc__search-icon" />
              {query.trim() && !selectedDraft && (
                <ul className="add-doc__results">
                  {filteredDrafts.length === 0 ? (
                    <li className="add-doc__empty">No matching drafts</li>
                  ) : (
                    filteredDrafts.map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          className="add-doc__result-btn"
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
          </div>

          {selectedDraft && (
            <div className="add-doc__card">
              <h2 className="add-doc__card-name">{author?.name}</h2>
              <p className="add-doc__card-bio">{author?.bio ?? 'No bio'}</p>
              <div className="add-doc__card-row">
                <span className="add-doc__card-label">Grade</span>
                {author?.grade != null ? ordinal(author.grade) : '—'}
              </div>
              <div className="add-doc__card-row">
                <span className="add-doc__card-label">Document</span>
                <a
                  href={selectedDraft.docLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedDraft.docLink}
                </a>
              </div>
              {unmet.length > 0 && (
                <p className="add-doc__card-warning">
                  Checkpoints{' '}
                  {unmet.map((checkpoint, i) => (
                    <span key={checkpoint}>
                      {i > 0 && ', '}
                      <strong>{checkpoint}</strong>
                    </span>
                  ))}{' '}
                  have not been met yet.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="modal__footer">
          <div className="modal__footer-right">
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
