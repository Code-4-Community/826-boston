import React, { useCallback, useEffect, useRef, useState } from 'react';
import apiClient from '../../api/apiClient';
import { STORY_DRAFT_CHECKPOINTS } from './checkpoints';
import './story-draft-detail-panel.css';

export interface StoryDraftDetail {
  storyDraftId: number;
  authorId: number;
  firstName: string;
  lastName: string;
  bio: string;
  grade: number | null;
  nameInBook: string;
  studentConsent: boolean;
  docLink: string;
  checkpoints: Record<string, boolean>;
}

interface Props {
  draft: StoryDraftDetail;
  onClose: () => void;
  onSaved: () => void;
}

type PanelTab = 'omchai' | 'approved-documents' | 'checkpoints';

interface FormState {
  firstName: string;
  lastName: string;
  bio: string;
  grade: string;
  nameInBook: string;
  studentConsent: boolean;
  docLink: string;
  checkpoints: Record<string, boolean>;
}

function toForm(draft: StoryDraftDetail): FormState {
  return {
    firstName: draft.firstName,
    lastName: draft.lastName,
    bio: draft.bio,
    grade: draft.grade == null ? '' : String(draft.grade),
    nameInBook: draft.nameInBook,
    studentConsent: draft.studentConsent,
    docLink: draft.docLink,
    checkpoints: { ...draft.checkpoints },
  };
}

function ordinal(grade: string): string {
  const n = Number.parseInt(grade, 10);
  if (Number.isNaN(n)) return grade;
  const suffix =
    n % 100 >= 11 && n % 100 <= 13
      ? 'th'
      : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';
  return `${n}${suffix}`;
}

function sameCheckpoints(
  a: Record<string, boolean>,
  b: Record<string, boolean>,
): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if ((a[key] ?? false) !== (b[key] ?? false)) return false;
  }
  return true;
}

const StoryDraftDetailPanel: React.FC<Props> = ({
  draft,
  onClose,
  onSaved,
}) => {
  const [form, setForm] = useState<FormState>(() => toForm(draft));
  const [activeTab, setActiveTab] = useState<PanelTab>('checkpoints');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingGrade, setEditingGrade] = useState(false);
  const bioRef = useRef<HTMLTextAreaElement>(null);

  // Latest values + last persisted values, so the save on close works even when
  // it is triggered from an unmount (where state would be stale).
  const formRef = useRef(form);
  formRef.current = form;
  const savedRef = useRef<FormState>(toForm(draft));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleCheckpoint = (id: string) =>
    setForm((prev) => ({
      ...prev,
      checkpoints: { ...prev.checkpoints, [id]: !prev.checkpoints[id] },
    }));

  /** Persists whatever has changed since the last successful save. */
  const save = useCallback(async (): Promise<boolean> => {
    const current = formRef.current;
    const base = savedRef.current;

    const authorPatch: {
      name?: string;
      nameInBook?: string;
      bio?: string;
      grade?: number | null;
    } = {};
    if (
      current.firstName !== base.firstName ||
      current.lastName !== base.lastName
    ) {
      authorPatch.name =
        `${current.firstName.trim()} ${current.lastName.trim()}`.trim();
    }
    if (current.nameInBook !== base.nameInBook) {
      authorPatch.nameInBook = current.nameInBook.trim();
    }
    if (current.bio !== base.bio) {
      authorPatch.bio = current.bio.trim();
    }
    if (current.grade !== base.grade) {
      const parsed = Number.parseInt(current.grade, 10);
      authorPatch.grade = Number.isNaN(parsed) ? null : parsed;
    }

    const draftPatch: {
      docLink?: string;
      studentConsent?: boolean;
      checkpoints?: Record<string, boolean>;
    } = {};
    if (current.docLink !== base.docLink) {
      draftPatch.docLink = current.docLink.trim();
    }
    if (current.studentConsent !== base.studentConsent) {
      draftPatch.studentConsent = current.studentConsent;
    }
    if (!sameCheckpoints(current.checkpoints, base.checkpoints)) {
      draftPatch.checkpoints = current.checkpoints;
    }

    const requests: Promise<unknown>[] = [];
    if (Object.keys(authorPatch).length > 0) {
      requests.push(apiClient.updateAuthor(draft.authorId, authorPatch));
    }
    if (Object.keys(draftPatch).length > 0) {
      requests.push(apiClient.updateStoryDraft(draft.storyDraftId, draftPatch));
    }
    if (requests.length === 0) return true;

    setSaving(true);
    setError(null);
    try {
      await Promise.all(requests);
      savedRef.current = current;
      onSaved();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [draft.authorId, draft.storyDraftId, onSaved]);

  const handleClose = useCallback(async () => {
    if (await save()) onClose();
  }, [save, onClose]);

  // Covers closes that bypass the close button (route change, parent unmount).
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => () => void saveRef.current(), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') void handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  // Keep the bio looking like flowing text rather than a fixed-height box.
  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [form.bio]);

  const hasDocLink = form.docLink.trim().length > 0;

  // Keeps "Last, First" reading as one heading instead of two half-width boxes.
  const nameSize = (value: string, placeholder: string) =>
    Math.max(value.length, placeholder.length);

  return (
    <aside className="sdp" aria-label="Story draft details">
      <div className="sdp__top">
        <button
          type="button"
          className="sdp__collapse"
          onClick={() => void handleClose()}
          aria-label="Close story draft details"
        >
          »
        </button>
        {saving && <span className="sdp__status">Saving…</span>}
      </div>

      {error && <p className="sdp__error">{error}</p>}

      <div className="sdp__name">
        <input
          className="sdp__name-input"
          value={form.lastName}
          placeholder="Last Name"
          aria-label="Last name"
          size={nameSize(form.lastName, 'Last Name')}
          onChange={(e) => update('lastName', e.target.value)}
        />
        <span className="sdp__name-sep">,</span>
        <input
          className="sdp__name-input"
          value={form.firstName}
          placeholder="First Name"
          aria-label="First name"
          size={nameSize(form.firstName, 'First Name')}
          onChange={(e) => update('firstName', e.target.value)}
        />
      </div>

      <textarea
        ref={bioRef}
        className="sdp__bio"
        value={form.bio}
        placeholder="Author bio"
        aria-label="Author bio"
        rows={1}
        onChange={(e) => update('bio', e.target.value)}
      />

      <dl className="sdp__fields">
        <div className="sdp__field">
          <dt className="sdp__label">Grade</dt>
          <dd className="sdp__value">
            {editingGrade || !form.grade ? (
              <input
                className="sdp__input"
                type="number"
                min={1}
                max={12}
                value={form.grade}
                placeholder="Add grade."
                aria-label="Grade"
                autoFocus={editingGrade}
                onChange={(e) => update('grade', e.target.value)}
                onBlur={() => setEditingGrade(false)}
              />
            ) : (
              <button
                type="button"
                className="sdp__value-button"
                onClick={() => setEditingGrade(true)}
              >
                {ordinal(form.grade)}
              </button>
            )}
          </dd>
        </div>

        <div className="sdp__field">
          <dt className="sdp__label">Name in book</dt>
          <dd className="sdp__value">
            <input
              className="sdp__input"
              value={form.nameInBook}
              placeholder="Add name."
              aria-label="Name in book"
              onChange={(e) => update('nameInBook', e.target.value)}
            />
          </dd>
        </div>

        <div className="sdp__field">
          <dt className="sdp__label">Consent on file</dt>
          <dd className="sdp__value">
            <input
              className="sdp__checkbox"
              type="checkbox"
              checked={form.studentConsent}
              aria-label="Consent on file"
              onChange={(e) => update('studentConsent', e.target.checked)}
            />
          </dd>
        </div>

        <div className="sdp__field">
          <dt className="sdp__label">Document</dt>
          <dd className="sdp__value sdp__value--doc">
            <input
              className="sdp__input sdp__input--link"
              value={form.docLink}
              placeholder="Add document."
              aria-label="Document link"
              onChange={(e) => update('docLink', e.target.value)}
            />
            {hasDocLink && (
              <a
                className="sdp__doc-open"
                href={form.docLink}
                target="_blank"
                rel="noreferrer"
                title="Open document in a new tab"
              >
                ↗
              </a>
            )}
          </dd>
        </div>
      </dl>

      <div className="sdp__tabs" role="tablist">
        {(
          [
            ['omchai', 'OMCHAI'],
            ['approved-documents', 'Approved Documents'],
            ['checkpoints', 'Checkpoints'],
          ] as [PanelTab, string][]
        ).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`sdp__tab${
              activeTab === tab ? ' sdp__tab--active' : ''
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="sdp__tab-panel" role="tabpanel">
        {activeTab === 'checkpoints' && (
          <ul className="sdp__checkpoints">
            {STORY_DRAFT_CHECKPOINTS.map((checkpoint) => (
              <li key={checkpoint.id} className="sdp__checkpoint">
                <label
                  className="sdp__checkpoint-label"
                  htmlFor={`checkpoint-${checkpoint.id}`}
                >
                  {checkpoint.label}
                </label>
                <input
                  id={`checkpoint-${checkpoint.id}`}
                  className="sdp__checkbox"
                  type="checkbox"
                  checked={form.checkpoints[checkpoint.id] ?? false}
                  onChange={() => toggleCheckpoint(checkpoint.id)}
                />
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'omchai' && (
          <p className="sdp__empty">
            No OMCHAI assignments for this story draft yet.
          </p>
        )}

        {activeTab === 'approved-documents' && (
          <p className="sdp__empty">No approved documents yet.</p>
        )}
      </div>
    </aside>
  );
};

export default StoryDraftDetailPanel;
