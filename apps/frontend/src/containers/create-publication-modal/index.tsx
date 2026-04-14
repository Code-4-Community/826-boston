import { useMemo, useState } from 'react';
import './styles.css';
import { THEMES, OMCHAI_ROLES, OmchaiRole } from './constants';

export interface PublicationFormState {
  title: string;
  publicationType: string;
  themes: string[];
  genres: string[];
  publicationDate: string;
  description: string;
  owner: string[];
  manager: string[];
  consulted: string[];
  helper: string[];
  approver: string[];
  informed: string[];
}

interface TeamMemberOption {
  name: string;
  email: string;
}

interface CreatePublicationModalProps {
  onClose: () => void;
  onSave: (form: PublicationFormState) => void;
  teamMembers?: TeamMemberOption[];
}

const PUBLICATION_TYPES = [
  { value: 'level0', label: 'Level 0 (Zines)' },
  { value: 'level1', label: 'Level 1 (Chapbooks)' },
  { value: 'level2', label: 'Level 2 (Perfect Bound)' },
  { value: 'level3', label: 'Level 3 (Signature Publications)' },
];

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

const INITIAL_FORM: PublicationFormState = {
  title: '',
  publicationType: '',
  themes: [],
  genres: [],
  publicationDate: '',
  description: '',
  owner: [],
  manager: [],
  consulted: [],
  helper: [],
  approver: [],
  informed: [],
};

interface SearchableMultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder: string;
  tagClass: string;
  selectedOptionClass: string;
}

function SearchableMultiSelect({
  options,
  selected,
  onChange,
  placeholder,
  tagClass,
  selectedOptionClass,
}: SearchableMultiSelectProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((opt) => opt.toLowerCase().includes(normalized));
  }, [options, query]);

  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt],
    );
  };

  return (
    <div className="multiselect__wrapper">
      {selected.length > 0 && (
        <div className="multiselect__tags">
          {selected.map((s) => (
            <span key={s} className={`multiselect__tag ${tagClass}`}>
              {s}
              <button
                type="button"
                className="multiselect__tag-remove"
                onClick={() => toggle(s)}
                aria-label={`Remove ${s}`}
              >
                ×
              </button>
            </span>
          ))}
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
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const isSelected = selected.includes(opt);

              return (
                <button
                  key={opt}
                  type="button"
                  className={`multiselect__option-row ${
                    isSelected ? selectedOptionClass : ''
                  }`}
                  onClick={() => toggle(opt)}
                >
                  <span>{opt}</span>
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

interface UserSearchableMultiSelectProps {
  users: TeamMemberOption[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder: string;
}

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

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((s) => s !== value)
        : [...selected, value],
    );
  };

  const selectedUsers = users.filter((user) =>
    selected.includes(`${user.name} <${user.email}>`),
  );

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
                  onClick={() => toggle(value)}
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
              const value = `${user.name} <${user.email}>`;
              const isSelected = selected.includes(value);

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

export default function CreatePublicationModal({
  onClose,
  onSave,
  teamMembers = [],
}: CreatePublicationModalProps) {
  const [tab, setTab] = useState<0 | 1>(0);
  const [form, setForm] = useState<PublicationFormState>(INITIAL_FORM);

  const set = <K extends keyof PublicationFormState>(
    key: K,
    value: PublicationFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const tab1Valid =
    form.title.trim().length > 0 &&
    form.publicationType.length > 0 &&
    form.themes.length > 0 &&
    form.genres.length > 0;

  const tab2Valid = OMCHAI_ROLES.every(
    (role: OmchaiRole) => form[role.key].length > 0,
  );

  const DescriptionField = (
    <Field label="Description">
      <textarea
        className="input input--textarea"
        placeholder="Include # students published, # editorial board members, consult your manager to ensure that they align with WR team goals"
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
      />
    </Field>
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <div className="modal__header-row">
            <h1 className="modal__title">New Publication</h1>
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
          {tab === 0 ? (
            <>
              <Field label="Title" required>
                <input
                  className="input"
                  placeholder="Enter publication title"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                />
              </Field>

              <Field label="Publication Type" required>
                <select
                  className="input input--select"
                  value={form.publicationType}
                  onChange={(e) => set('publicationType', e.target.value)}
                >
                  <option value="" disabled>
                    Select a publication type
                  </option>
                  {PUBLICATION_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Theme(s)" required>
                <SearchableMultiSelect
                  options={THEMES}
                  selected={form.themes}
                  onChange={(value) => set('themes', value)}
                  placeholder="Search for a theme..."
                  tagClass="multiselect__tag--theme"
                  selectedOptionClass="multiselect__option--selected-theme"
                />
              </Field>

              <Field label="Genre(s)" required>
                <SearchableMultiSelect
                  options={GENRES}
                  selected={form.genres}
                  onChange={(value) => set('genres', value)}
                  placeholder="Search for a genre..."
                  tagClass="multiselect__tag--theme"
                  selectedOptionClass="multiselect__option--selected-theme"
                />
              </Field>

              <div className="field-row">
                <Field label="Publication Date">
                  <input
                    className="input"
                    type="date"
                    value={form.publicationDate}
                    onChange={(e) => set('publicationDate', e.target.value)}
                  />
                </Field>
              </div>

              {DescriptionField}
            </>
          ) : (
            <>
              {OMCHAI_ROLES.map(({ key, label }: OmchaiRole) => (
                <Field key={key} label={label} required>
                  <UserSearchableMultiSelect
                    users={teamMembers}
                    selected={form[key]}
                    onChange={(value) => set(key, value)}
                    placeholder="Search by name or email..."
                  />
                </Field>
              ))}

              {DescriptionField}
            </>
          )}
        </div>

        <div className="modal__footer">
          {tab === 1 && (
            <button
              type="button"
              className="btn btn--secondary modal__back"
              onClick={() => setTab(0)}
            >
              Back
            </button>
          )}

          <div className="modal__footer-right">
            <button
              type="button"
              className="btn btn--primary"
              onClick={tab === 0 ? () => setTab(1) : () => onSave(form)}
              disabled={tab === 0 ? !tab1Valid : !tab2Valid}
            >
              {tab === 0 ? 'Next' : 'Save as Draft'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
