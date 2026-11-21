import { useEffect, useMemo, useState } from 'react';
import './styles.css';
import User from '@api/dtos/user.dto';
import apiClient from '@api/apiClient';
import { PROGRAM_OPTIONS } from '@containers/archived-publications/filter-modal/constants';
import { Anthology, AnthologyPubLevel, CreateAnthologyDto } from '../../types';
import { PUBLICATION_LEVELS } from './constants';
import Field from './Field';

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

// TODO: to delete
interface OwnerOption {
  id: number;
  name: string;
  email: string;
}

// TODO: to delete
interface UserSearchableMultiSelectProps {
  users: OwnerOption[];
  selected: number[];
  onChange: (val: number[]) => void;
  placeholder: string;
}

// TODO: to delete
function UserSearchableMultiSelect({
  users,
  selected,
  onChange,
  placeholder,
}: UserSearchableMultiSelectProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized),
    );
  }, [users, query]);

  const toggle = (value: number) => {
    onChange(
      selected.includes(value)
        ? selected.filter((s) => s !== value)
        : [...selected, value],
    );
  };

  const selectedUsers = users.filter((user) => selected.includes(user.id));

  return (
    <div className="multiselect__wrapper">
      {selectedUsers.length > 0 && (
        <div className="multiselect__tags">
          {selectedUsers.map((user) => {
            const value = `${user.name} <${user.email}>`;

            return (
              <span
                key={value}
                className="multiselect__tag multiselect__tag--user"
              >
                {user.name}
                <button
                  type="button"
                  className="multiselect__tag-remove"
                  onClick={() => toggle(user.id)}
                  aria-label={`Remove ${user.name}`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div className="multiselect__search">
        <input
          className="input"
          placeholder={placeholder}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
        />
      </div>

      {isOpen && (
        <div className="multiselect__options-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const value = user.id;
              const isSelected = selected.includes(user.id);

              return (
                <button
                  key={value}
                  type="button"
                  className={`multiselect__option-row ${
                    isSelected ? 'multiselect__option--selected-user' : ''
                  }`}
                  onClick={() => toggle(value)}
                >
                  <div className="multiselect__user-meta">
                    <span>{user.name}</span>
                    <span className="multiselect__user-email">
                      {user.email}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    tabIndex={-1}
                  />
                </button>
              );
            })
          ) : (
            <div className="multiselect__empty">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CreatePublicationModal({
  onClose,
  onSave,
  onCreated,
}: CreatePublicationModalProps) {
  const [form, setForm] = useState<PublicationFormState>(INITIAL_FORM);
  const [users, setUsers] = useState<User[]>([]);

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

  useEffect(() => {
    apiClient
      .getUsers()
      .then((data) => setUsers(data as User[]))
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
      <div className="modal">
        <div className="modal__header">
          <div className="modal__header-row">
            <h1 className="modal__title">Create new publication</h1>
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
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
            <select
              className="input input--select"
              value={form.programs[0] ?? ''}
              onChange={(e) => set('programs', [e.target.value])}
            >
              <option value="" disabled>
                Select a program
              </option>
              {PROGRAM_OPTIONS.map(({ value, displayLabel }) => (
                <option key={value} value={value}>
                  {displayLabel}
                </option>
              ))}
            </select>
          </Field>

          <div className="field-row">
            <Field label="Publication Level" required>
              <select
                className="input input--select"
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
                className="input"
                type="date"
                value={form.publicationDate}
                onChange={(e) => set('publicationDate', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Owner" required>
            <UserSearchableMultiSelect
              users={users.map((u) => ({
                name: u.firstName + ' ' + u.lastName,
                email: u.email,
                id: u.id,
              }))}
              selected={form.owners}
              onChange={(value) => set('owners', value)}
              placeholder="Select a user"
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
