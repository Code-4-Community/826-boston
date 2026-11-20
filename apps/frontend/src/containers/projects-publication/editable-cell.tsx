import React, { useState } from 'react';
import axios from 'axios';
import './production-info-view.css';

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const message = (
      err.response?.data as { message?: string | string[] } | undefined
    )?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (message) return message;
    return err.message;
  }
  return 'Something went wrong.';
}

interface EditableCellProps {
  value: string | number | null;
  placeholder: string;
  type?: 'text' | 'number';
  format?: (value: string | number) => string;
  requireNonNegative?: boolean;
  disabled?: boolean;
  onSave: (newValue: string) => Promise<void>;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  placeholder,
  type = 'text',
  format,
  requireNonNegative,
  disabled = false,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originalText = value != null ? String(value) : '';

  const startEditing = () => {
    setError(null);
    setDraft(originalText);
    setIsEditing(true);
  };

  const commit = async () => {
    const trimmed = draft.trim();

    if (trimmed === originalText) {
      setIsEditing(false);
      return;
    }

    if (type === 'number' && trimmed !== '') {
      const parsed = Number(trimmed);

      if (Number.isNaN(parsed)) {
        setError('Enter a number.');
        return;
      }

      if (requireNonNegative && parsed < 0) {
        setError('Number must be non-negative.');
        return;
      }
    }

    setSaving(true);
    try {
      await onSave(trimmed);
      setIsEditing(false);
    } catch (err) {
      setError(`Failed to save: ${getErrorMessage(err)}`);
    } finally {
      setSaving(false);
    }
  };

  if (isEditing && !disabled) {
    return (
      <div className="production-info-edit">
        <input
          className="production-info-input"
          type={type}
          autoFocus
          value={draft}
          disabled={saving}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              setIsEditing(false);
            }
          }}
        />
        {error && <span className="production-info-error">{error}</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="production-info-cell"
      disabled={disabled}
      onClick={startEditing}
    >
      {value != null && value !== '' ? (
        format ? (
          format(value)
        ) : (
          value
        )
      ) : (
        <span className="production-info-placeholder">{placeholder}</span>
      )}
    </button>
  );
};

export default EditableCell;
