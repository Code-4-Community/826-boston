import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import './styles.css';
import apiClient from '@api/apiClient';
import SearchableMultiSelect from '@components/SearchableMultiSelect';
import { PROGRAM_OPTIONS } from '@containers/archived-publications/filter-modal/constants';
import { Anthology, AnthologyPubLevel, CreateAnthologyDto } from '../../types';
import { PUBLICATION_LEVELS } from './constants';
import Field from './Field';
import CloseIcon from '../../assets/icons/close.svg';

interface CreatePublicationModalProps {
  onClose: () => void;
  onSave: (form: PublicationFormState) => void;
  /** Called after the publication and its OMCHAI assignments are saved. */
  onCreated?: (anthology: Anthology) => void;
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
  onSave,
  onCreated,
}: CreatePublicationModalProps) {
  const [form, setForm] = useState<PublicationFormState>(INITIAL_FORM);

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
  });

  const ownerOptions = useMemo(
    () =>
      (usersQuery.data ?? []).map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      })),
    [usersQuery.data],
  );

  const programOptions = PROGRAM_OPTIONS.map(({ value, displayLabel }) => ({
    value,
    label: displayLabel,
  }));

  async function handleSaveForm() {
    onSave(form);

    try {
      const createAnthologyBody: CreateAnthologyDto = {
        title: form.title,
        pub_level: form.publicationLevel as AnthologyPubLevel,
        owner_ids: form.owners,
      };
      // optional fields
      if (form.programs.length > 0)
        createAnthologyBody.programs = form.programs;
      if (form.publicationDate) {
        createAnthologyBody.publicationDate = form.publicationDate;
      }

      const anthology = await apiClient.createAnthology(createAnthologyBody);

      onCreated?.(anthology);
    } catch (err) {
      console.log(err);
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

          <Field label="Program">
            <SearchableMultiSelect
              label="Program"
              options={programOptions}
              selected={form.programs}
              onChange={(values) => set('programs', values)}
              placeholder="Select a program"
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
              <input
                className={`input input--date${
                  form.publicationDate ? '' : ' input--empty'
                }`}
                type="date"
                value={form.publicationDate}
                onChange={(e) => set('publicationDate', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Owner" required>
            <SearchableMultiSelect
              label="Owner"
              options={ownerOptions}
              selected={form.owners}
              onChange={(values) => set('owners', values)}
              placeholder="Select a user"
              showAvatar
              isLoading={usersQuery.isLoading}
              errorMessage={
                usersQuery.isError
                  ? "Couldn't load users. Try again."
                  : undefined
              }
            />
          </Field>
        </div>

        <div className="modal__footer">
          <div className="modal__footer-right">
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSaveForm}
              disabled={!isValid}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
