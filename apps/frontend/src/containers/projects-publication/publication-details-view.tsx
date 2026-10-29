import React, { useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '../../api/apiClient';
import Role from '../../api/dtos/role';
import { Anthology, OmchaiRole } from '../../types';

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

const THEMES = [
  'Short Stories',
  'Healthy Foods',
  'Recipes',
  'Creative Writing',
  'Transportation',
  'Culture',
  'Food',
  'Identity',
  'Mystery',
  'Adventure',
  'School',
  'Relationships',
  'Family',
  'Environment',
  'Coming of Age',
  'Belonging',
  'Youth',
];

const PUB_LEVELS = [
  ['Zine', 'Level 0 (Zines)'],
  ['Chapbook', 'Level 1 (Chapbooks)'],
  ['PerfectBound', 'Level 2 (Perfect Bound)'],
  ['Signature', 'Level 3 (Signature Publications)'],
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
    apiClient.getOmchaiByAnthology(anthologyId).then((entries) => {
      const assignment = entries.find(
        (entry) => entry.userId === currentUser?.id,
      );
      setEditable(
        isAdmin ||
          assignment?.role === OmchaiRole.OWNER ||
          assignment?.role === OmchaiRole.MANAGER,
      );
    });
  }, [anthologyId, currentUser]);

  useEffect(
    () => () => {
      Object.values(timers.current).forEach(clearTimeout);
    },
    [],
  );

  const save = async (field: string, body: Record<string, unknown>) => {
    setSavingField(field);
    setSaveError(null);
    try {
      const updated = await apiClient.updateAnthology(anthologyId, body);
      setValues((prev) => ({ ...prev, ...updated }));
      onChange(updated);
    } catch (error: unknown) {
      const response = (
        error as { response?: { data?: { message?: unknown } } }
      ).response?.data?.message;
      setSaveError(
        typeof response === 'string'
          ? response
          : (response as { missingFields?: string[] })?.missingFields?.join(
              ', ',
            ) ?? 'Save failed. Please try again.',
      );
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

  const saveImmediately = (field: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value } as Anthology));
    const bodyField =
      field === 'pub_level' ? { pub_level: value } : { [field]: value };
    void save(field, bodyField);
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
            >
              Add cover image
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
              options={GENRES}
              selected={values.genres ?? []}
              disabled={!editable}
              onChange={(value) => saveImmediately('genres', value)}
            />
            <MultiSelect
              label="Theme(s)"
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
                onChange={(event) =>
                  changeText('gradeLevel', event.target.value)
                }
                onBlur={() => {
                  clearTimeout(timers.current.gradeLevel);
                  void save('gradeLevel', { gradeLevel: values.gradeLevel });
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const MultiSelect: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  disabled: boolean;
  onChange: (value: string[]) => void;
}> = ({ label, options, selected, disabled, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="publication-details__field publication-details__multi">
      <span>{label}</span>
      <button
        type="button"
        className="publication-details__multi-button"
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
      >
        {selected.length
          ? selected.join(', ')
          : `Select ${label.toLowerCase()}`}
      </button>
      {open && (
        <div className="publication-details__multi-menu">
          <input
            placeholder="Search..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {filtered.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => {
                  onChange(
                    selected.includes(option)
                      ? selected.filter((item) => item !== option)
                      : [...selected, option],
                  );
                }}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicationDetailsView;
