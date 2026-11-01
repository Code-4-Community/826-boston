import React, { useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '../../api/apiClient';
import Role from '../../api/dtos/role';
import { Anthology, OmchaiRole } from '../../types';
import { THEMES } from '../create-publication-modal/constants';

const GENRES = [
  'Poetry',
  'Fiction',
  'Nonfiction',
  'Memoir',
  'Essay',
  'Short Story',
  'Personal Narrative',
  'Graphic Narrative',
  'Play',
  'Interview',
  'Letters',
  'Mixed Genre',
  'Civic Engagement',
  'Multicultural',
];

const PUB_LEVELS = [
  ['Zine', 'Zine'],
  ['Chapbook', 'Chapbook'],
  ['PerfectBound', 'Perfect Bound'],
  ['Signature', 'Signature'],
] as const;

const STATUSES = [
  ['Draft', 'Not Started'],
  ['In Revision', 'Drafting'],
  ['In Production', 'In Production'],
  ['Published', 'Can Be Shared'],
  ['Archived', 'Archived'],
] as const;

interface Props {
  anthology: Anthology;
  anthologyId: number;
  currentUser?: { id: number; role: Role | string };
  onChange: (anthology: Anthology) => void;
}

const PublicationDetailsView: React.FC<Props> = ({
  anthology,
  anthologyId,
  currentUser,
  onChange,
}) => {
  const [values, setValues] = useState(anthology);
  const [editable, setEditable] = useState(false);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValues(anthology);
  }, [anthology]);

  useEffect(() => {
    const isAdmin = String(currentUser?.role ?? '').toLowerCase() === 'admin';
    setEditable(isAdmin);
    if (isAdmin) return;
    // The endpoint 404s when a publication has no assignments yet
    apiClient
      .getOmchaiByAnthology(anthologyId)
      .then((entries) => {
        const assignment = entries.find(
          (entry) => entry.userId === currentUser?.id,
        );
        setEditable(
          assignment?.role === OmchaiRole.OWNER ||
            assignment?.role === OmchaiRole.MANAGER,
        );
      })
      .catch(() => setEditable(false));
  }, [anthologyId, currentUser]);

  useEffect(
    () => () => {
      Object.values(timers.current).forEach(clearTimeout);
    },
    [],
  );

  const save = async (
    field: string,
    body: Record<string, unknown>,
  ): Promise<boolean> => {
    setSavingField(field);
    setSaveError(null);
    try {
      const updated = await apiClient.updateAnthology(anthologyId, body);
      setValues((prev) => ({ ...prev, ...updated }));
      onChange(updated);
      return true;
    } catch (error: unknown) {
      const data = (
        error as {
          response?: { data?: { message?: unknown; missingFields?: string[] } };
        }
      ).response?.data;
      const message =
        typeof data?.message === 'string'
          ? data.message
          : 'Save failed. Please try again.';
      setSaveError(
        data?.missingFields?.length
          ? `${message}: ${data.missingFields.join(', ')}`
          : message,
      );
      return false;
    } finally {
      setSavingField(null);
    }
  };

  const changeText = (field: string, value: string) => {
    const next = { ...values, [field]: value } as Anthology;
    setValues(next);
    clearTimeout(timers.current[field]);
    timers.current[field] = setTimeout(
      () => save(field, { [field]: value }),
      1000,
    );
  };

  const saveImmediately = async (field: string, value: unknown) => {
    const previous = (values as unknown as Record<string, unknown>)[field];
    setValues((prev) => ({ ...prev, [field]: value } as Anthology));
    const saved = await save(field, { [field]: value });
    // Roll back so a rejected change (e.g. blocked status) isn't left showing
    if (!saved) {
      setValues((prev) => ({ ...prev, [field]: previous } as Anthology));
    }
  };

  const currentStatus =
    STATUSES.find(([value]) => value === values.status)?.[1] ?? values.status;

  const uploadCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSavingField('cover');
    try {
      const updated = await apiClient.uploadAnthologyCoverImage(
        anthologyId,
        file,
      );
      setValues((prev) => ({ ...prev, photo_url: updated.photo_url }));
      onChange(updated);
    } catch {
      setSaveError('Cover upload failed. Please try again.');
    } finally {
      setSavingField(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const dateValue = useMemo(() => {
    const value = values.publishedDate;
    return value ? String(value).slice(0, 10) : '';
  }, [values.publishedDate]);

  return (
    <div className="publication-details">
      <div className="publication-details__main">
        <div className="publication-details__cover">
          {values.photo_url || values.photoUrl ? (
            <img
              src={values.photo_url || values.photoUrl}
              alt="Publication cover"
            />
          ) : (
            <button
              type="button"
              className="publication-details__cover-placeholder"
              onClick={() => editable && fileRef.current?.click()}
              disabled={!editable}
              aria-label="Upload cover image"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 16V4" />
                <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
                <path d="M4 14v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
              </svg>
            </button>
          )}
          {values.photo_url && editable && (
            <button
              type="button"
              className="publication-details__cover-button"
              onClick={() => fileRef.current?.click()}
            >
              Change cover
            </button>
          )}
          <input
            ref={fileRef}
            className="publication-details__file"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={uploadCover}
            disabled={!editable}
          />
        </div>

        <div className="publication-details__form">
          <div className="publication-details__status-row">
            <div className="publication-details__status-wrap">
              <button
                type="button"
                className="publication-status-pill"
                disabled={!editable}
                onClick={() => setStatusOpen((open) => !open)}
              >
                {currentStatus}
              </button>
              {statusOpen && (
                <div className="publication-status-menu">
                  {STATUSES.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        saveImmediately('status', value);
                        setStatusOpen(false);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="publication-details__save-state" role="status">
              {savingField ? 'Saving…' : saveError ? '' : 'Saved'}
            </div>
          </div>

          <label className="publication-details__field">
            <span>Title</span>
            <input
              value={values.title ?? ''}
              disabled={!editable}
              onChange={(event) => changeText('title', event.target.value)}
              onBlur={() => {
                clearTimeout(timers.current.title);
                void save('title', { title: values.title });
              }}
            />
          </label>

          <label className="publication-details__field">
            <span>Byline</span>
            <input
              value={values.byline ?? ''}
              disabled={!editable}
              onChange={(event) => changeText('byline', event.target.value)}
              onBlur={() => {
                clearTimeout(timers.current.byline);
                void save('byline', { byline: values.byline });
              }}
            />
          </label>

          <label className="publication-details__field">
            <span>Description</span>
            <textarea
              placeholder="Add description."
              value={values.description ?? ''}
              disabled={!editable}
              onChange={(event) =>
                changeText('description', event.target.value)
              }
              onBlur={() => {
                clearTimeout(timers.current.description);
                void save('description', { description: values.description });
              }}
            />
          </label>

          {saveError && (
            <p className="publication-details__error">{saveError}</p>
          )}
        </div>
      </div>

      <div className="publication-details__grid">
        <label className="publication-details__field">
          <span>Publication Level</span>
          <select
            value={values.pubLevel ?? values.pub_level ?? ''}
            disabled={!editable}
            onChange={(event) =>
              saveImmediately('pub_level', event.target.value)
            }
          >
            {PUB_LEVELS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="publication-details__field">
          <span>Publication Date</span>
          <input
            type="date"
            value={dateValue}
            disabled={!editable}
            onChange={(event) =>
              saveImmediately('publicationDate', event.target.value)
            }
          />
        </label>

        <MultiSelect
          label="Genre(s)"
          placeholder="Add field."
          options={GENRES}
          selected={values.genres ?? []}
          disabled={!editable}
          onChange={(value) => saveImmediately('genres', value)}
        />
        <MultiSelect
          label="Theme(s)"
          placeholder="Add themes."
          options={THEMES}
          selected={values.themes ?? []}
          disabled={!editable}
          onChange={(value) => saveImmediately('themes', value)}
        />

        <label className="publication-details__field">
          <span>Grade</span>
          <input
            value={values.gradeLevel ?? ''}
            disabled={!editable}
            onChange={(event) => changeText('gradeLevel', event.target.value)}
            onBlur={() => {
              clearTimeout(timers.current.gradeLevel);
              void save('gradeLevel', { gradeLevel: values.gradeLevel });
            }}
          />
        </label>
      </div>
    </div>
  );
};

const MultiSelect: React.FC<{
  label: string;
  placeholder: string;
  options: string[];
  selected: string[];
  disabled: boolean;
  onChange: (value: string[]) => void;
}> = ({ label, placeholder, options, selected, disabled, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open]);

  const toggle = (option: string) =>
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );

  return (
    <div className="publication-details__field publication-details__multi">
      <span>{label}</span>
      <div className="publication-details__multi-wrap" ref={wrapRef}>
        <div
          className={`publication-details__multi-control${
            open ? ' publication-details__multi-control--open' : ''
          }`}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={() => !disabled && setOpen(true)}
          onKeyDown={(event) => {
            if (event.target === event.currentTarget && event.key === 'Enter') {
              setOpen(true);
            }
          }}
        >
          {selected.map((item) => (
            <span key={item} className="publication-details__chip">
              {item}
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${item}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(item);
                  }}
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {open ? (
            <>
              <input
                autoFocus
                className="publication-details__multi-search"
                placeholder={selected.length ? '' : 'Search...'}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
            </>
          ) : (
            !selected.length && (
              <span className="publication-details__multi-placeholder">
                {placeholder}
              </span>
            )
          )}
        </div>
        {open && (
          <div className="publication-details__multi-menu">
            {filtered.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggle(option)}
                />
                {option}
              </label>
            ))}
            {!filtered.length && (
              <p className="publication-details__multi-empty">No matches</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationDetailsView;
