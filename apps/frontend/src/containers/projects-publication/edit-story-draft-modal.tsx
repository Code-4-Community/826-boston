import { useState } from 'react';
import '../../containers/create-publication-modal/styles.css';
import apiClient from '../../api/apiClient';
import { SubmissionRound, EditRound } from '../../types';

export interface EditableStoryDraft {
  storyDraftId: number;
  authorId: number;
  firstName: string;
  lastName: string;
  nameInBook: string;
  classPeriod: string;
  docLink: string;
  submissionRound: SubmissionRound;
  studentConsent: boolean;
  inManuscript: boolean;
  editRound: EditRound;
  proofread: boolean;
  notes: string[];
}

interface Props {
  draft: EditableStoryDraft;
  onClose: () => void;
  onSaved: () => void;
}

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, required = false, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field__label">
        {label} {required && <span className="field__required">*</span>}
      </label>
      {children}
    </div>
  );
}

const SUBMISSION_ROUND_LABELS: Record<SubmissionRound, string> = {
  [SubmissionRound.ONE]: 'Round 1',
  [SubmissionRound.TWO]: 'Round 2',
  [SubmissionRound.THREE]: 'Round 3',
};

const EDIT_ROUND_LABELS: Record<EditRound, string> = {
  [EditRound.ONE]: 'Round 1',
  [EditRound.TWO]: 'Round 2',
};

export default function EditStoryDraftModal({
  draft,
  onClose,
  onSaved,
}: Props) {
  const [firstName, setFirstName] = useState(draft.firstName);
  const [lastName, setLastName] = useState(draft.lastName);
  const [nameInBook, setNameInBook] = useState(draft.nameInBook);
  const [classPeriod, setClassPeriod] = useState(draft.classPeriod);
  const [docLink, setDocLink] = useState(draft.docLink);
  const [submissionRound, setSubmissionRound] = useState(draft.submissionRound);
  const [studentConsent, setStudentConsent] = useState(draft.studentConsent);
  const [inManuscript, setInManuscript] = useState(draft.inManuscript);
  const [editRound, setEditRound] = useState(draft.editRound);
  const [proofread, setProofread] = useState(draft.proofread);
  const [notes, setNotes] = useState(draft.notes.join('\n'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = firstName.trim() && lastName.trim() && docLink.trim();

  const handleSave = async () => {
    if (!isValid) return;

    setSaving(true);
    setError(null);

    try {
      await Promise.all([
        apiClient.updateAuthor(draft.authorId, {
          name: `${firstName.trim()} ${lastName.trim()}`,
          nameInBook: nameInBook || undefined,
          classPeriod: classPeriod || undefined,
        }),
        apiClient.updateStoryDraft(draft.storyDraftId, {
          docLink: docLink.trim(),
          submissionRound,
          studentConsent,
          inManuscript,
          editRound,
          proofread,
          notes: notes
            .split('\n')
            .map((n) => n.trim())
            .filter(Boolean),
        }),
      ]);

      onSaved();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update story draft.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <div className="modal__header-row">
            <h1 className="modal__title">Edit Story Draft</h1>
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

          <div className="field-row">
            <Field label="First Name" required>
              <input
                className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={saving}
              />
            </Field>
            <Field label="Last Name" required>
              <input
                className="input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={saving}
              />
            </Field>
          </div>

          <Field label="Name in Book">
            <input
              className="input"
              value={nameInBook}
              onChange={(e) => setNameInBook(e.target.value)}
              disabled={saving}
            />
          </Field>

          <Field label="Class Period">
            <input
              className="input"
              value={classPeriod}
              onChange={(e) => setClassPeriod(e.target.value)}
              disabled={saving}
            />
          </Field>

          <Field label="Document Link" required>
            <input
              className="input"
              value={docLink}
              onChange={(e) => setDocLink(e.target.value)}
              disabled={saving}
            />
          </Field>

          <div className="field-row">
            <Field label="Submission Round">
              <select
                className="input"
                value={submissionRound}
                onChange={(e) =>
                  setSubmissionRound(Number(e.target.value) as SubmissionRound)
                }
                disabled={saving}
              >
                {Object.entries(SUBMISSION_ROUND_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Edit Round">
              <select
                className="input"
                value={editRound}
                onChange={(e) =>
                  setEditRound(Number(e.target.value) as EditRound)
                }
                disabled={saving}
              >
                {Object.entries(EDIT_ROUND_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="field-row">
            <Field label="Student Consent">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={studentConsent}
                  onChange={(e) => setStudentConsent(e.target.checked)}
                  disabled={saving}
                />
                <span className={studentConsent ? 'bool-yes' : 'bool-no'}>
                  {studentConsent ? '✓ Yes' : '✗ No'}
                </span>
              </label>
            </Field>
            <Field label="In Manuscript">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={inManuscript}
                  onChange={(e) => setInManuscript(e.target.checked)}
                  disabled={saving}
                />
                <span className={inManuscript ? 'bool-yes' : 'bool-no'}>
                  {inManuscript ? '✓ Yes' : '✗ No'}
                </span>
              </label>
            </Field>
            <Field label="Proofread">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={proofread}
                  onChange={(e) => setProofread(e.target.checked)}
                  disabled={saving}
                />
                <span className={proofread ? 'bool-yes' : 'bool-no'}>
                  {proofread ? '✓ Yes' : '✗ No'}
                </span>
              </label>
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              className="input input--textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={saving}
              placeholder="One note per line"
              rows={4}
            />
          </Field>
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
              onClick={handleSave}
              disabled={!isValid || saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
