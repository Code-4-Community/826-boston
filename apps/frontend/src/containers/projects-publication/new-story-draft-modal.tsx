import { useState } from 'react';
import '../../containers/create-publication-modal/styles.css';
import apiClient from '../../api/apiClient';

interface Props {
  anthologyId: number;
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

export default function NewStoryDraftModal({
  anthologyId,
  onClose,
  onSaved,
}: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameInBook, setNameInBook] = useState('');
  const [classPeriod, setClassPeriod] = useState('');
  const [docLink, setDocLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = firstName.trim() && lastName.trim() && docLink.trim();

  const handleSave = async () => {
    if (!isValid) return;

    setSaving(true);
    setError(null);

    try {
      const author = await apiClient.createAuthor({
        name: `${firstName.trim()} ${lastName.trim()}`,
        nameInBook: nameInBook || undefined,
        classPeriod: classPeriod || undefined,
      });

      await apiClient.createStoryDraft({
        authorId: author.id,
        anthologyId: anthologyId,
        docLink: docLink.trim(),
      });

      onSaved();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create story draft.';
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
            <h1 className="modal__title">New Story Draft</h1>
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
                placeholder="Author's first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={saving}
              />
            </Field>
            <Field label="Last Name" required>
              <input
                className="input"
                placeholder="Author's last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={saving}
              />
            </Field>
          </div>

          <Field label="Name in Book">
            <input
              className="input"
              placeholder="Author's name as it appears in the book"
              value={nameInBook}
              onChange={(e) => setNameInBook(e.target.value)}
              disabled={saving}
            />
          </Field>

          <Field label="Class Period">
            <input
              className="input"
              placeholder="e.g. Edwards 1/6"
              value={classPeriod}
              onChange={(e) => setClassPeriod(e.target.value)}
              disabled={saving}
            />
          </Field>

          <Field label="Document Link" required>
            <input
              className="input"
              placeholder="Paste Google Doc or Drive link"
              value={docLink}
              onChange={(e) => setDocLink(e.target.value)}
              disabled={saving}
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
