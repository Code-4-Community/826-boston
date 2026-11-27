import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import './styles.css';
import apiClient from '@api/apiClient';
import SearchableMultiSelect from '@components/SearchableMultiSelect';
import { PROGRAM_OPTIONS } from '@containers/archived-publications/filter-modal/constants';
import DatePickerField from '@containers/archived-publications/filter-modal/DatePickerField';
import { Anthology, AnthologyPubLevel } from '../../types';
import { PUBLICATION_LEVELS } from './constants';
import Field from './Field';
import CloseIcon from '../../assets/icons/close.svg';

interface CreatePublicationModalProps {
  onClose: () => void;
  onCreated: (anthology: Anthology) => void;
}

export interface PublicationFormState {
  title: string;
  programs: string[];
  publicationLevel: string;
  publicationDate: string;
  owners: number[];
}

const INITIAL_FORM: PublicationFormState = {
  title: '',
  programs: [],
  publicationLevel: '',
  publicationDate: '',
  owners: [],
};

export default function CreatePublicationModal({
  onClose,
  onCreated,
}: CreatePublicationModalProps) {
  const [form, setForm] = useState<PublicationFormState>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
  });

  const ownerOptions = useMemo(
    () =>
      (usersQuery.data ?? []).map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
        iconLabel: user.firstName.charAt(0).toUpperCase(),
      })),
    [usersQuery.data],
  );

  const programOptions = PROGRAM_OPTIONS.map(({ value, displayLabel }) => ({
    value,
    label: displayLabel,
  }));

  async function handleSaveForm() {
    setSaving(true);
    setError(null);

    try {
      const anthology = await apiClient.createAnthology({
        title: form.title,
        pub_level: form.publicationLevel as AnthologyPubLevel,
        owner_ids: form.owners,
        programs: form.programs,
        publicationDate: form.publicationDate || undefined,
      });

      onCreated(anthology);
    } catch {
      setError("Couldn't create the publication. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const set = <K extends keyof PublicationFormState>(
    key: K,
    value: PublicationFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isValid =
    form.title.trim().length > 0 &&
    form.publicationLevel.length > 0 &&
    form.owners.length > 0;

  return (
    <div className="modal-overlay">
      <div className="modal create-publication-modal">
        <div className="modal__header">
          <div className="modal__header-row">
            <h1 className="modal__title">Create new publication</h1>
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <img src={CloseIcon} alt="" />
            </button>
          </div>
        </div>

        <div className="modal__body">
          <Field label="Title" required>
            <input
              className="input"
              placeholder="Enter title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </Field>

          <Field label="Program(s)">
            <SearchableMultiSelect
              options={programOptions}
              selected={form.programs}
              onChange={(values) => set('programs', values)}
              placeholder="Select program(s)"
              selectionDisplay="pills"
            />
          </Field>

          <div className="field-row">
            <Field label="Publication Level" required>
              <select
                className="input input--select"
                required
                value={form.publicationLevel}
                onChange={(e) => set('publicationLevel', e.target.value)}
              >
                <option value="" disabled>
                  Select a level...
                </option>
                {PUBLICATION_LEVELS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Publication Date">
              <DatePickerField
                ariaLabel="Publication Date"
                value={form.publicationDate}
                onChange={(iso) => set('publicationDate', iso)}
              />
            </Field>
          </div>

          <Field label="Owner(s)" required>
            <SearchableMultiSelect
              options={ownerOptions}
              selected={form.owners}
              onChange={(values) => set('owners', values)}
              placeholder="Select owner(s)"
              selectionDisplay="inline"
            />
          </Field>

          {error && (
            <p className="modal__error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="modal__footer">
          <div className="modal__footer-right">
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSaveForm}
              disabled={!isValid || saving}
            >
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
