import { useEffect, useMemo, useRef, useState } from 'react';
import Role from '@api/dtos/role';
import SearchIcon from '../../assets/icons/search.svg';
import '../people/people.css';

interface CreateUserFormState {
  firstName: string;
  lastName: string;
  email: string;
  role: Role | '';
  title: string;
}

interface CreateUserModalProps {
  onClose: () => void;
  onSave: (form: CreateUserFormState) => void;
  positions: string[];
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

const INITIAL_FORM: CreateUserFormState = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  title: '',
};

export default function CreateUserModal({
  onClose,
  onSave,
  positions,
}: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserFormState>(INITIAL_FORM);
  const [positionSearch, setPositionSearch] = useState('');
  const [positionOpen, setPositionOpen] = useState(false);
  const positionRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof CreateUserFormState>(
    k: K,
    v: CreateUserFormState[K],
  ) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const isValid =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.title.trim().length > 0 &&
    form.role !== '';

  const filteredPositions = useMemo(() => {
    const query = positionSearch.trim().toLowerCase();
    return positions.filter((position) =>
      position.toLowerCase().includes(query),
    );
  }, [positionSearch, positions]);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (!positionRef.current?.contains(event.target as Node)) {
        setPositionOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () =>
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPositionOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="people-modal">
        <div className="people-modal__header">
          <div className="people-modal__header-row">
            <h1 className="people-modal__title">Add a member</h1>
            <button className="people-modal__close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="people-modal__body">
          <Field label="First name" required>
            <input
              className="input"
              placeholder="Title"
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
            />
          </Field>

          <Field label="Last name" required>
            <input
              className="input"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
            />
          </Field>

          <Field label="Email" required>
            <input
              className="input"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Field>
          <Field label="Position">
            <div className="people-modal__position" ref={positionRef}>
              <div className="people-modal__position-control">
                <input
                  className="people-modal__position-input"
                  placeholder="Search for a position..."
                  value={positionSearch || form.title}
                  onFocus={() => setPositionOpen(true)}
                  onChange={(event) => {
                    setPositionSearch(event.target.value);
                    if (event.target.value !== form.title) set('title', '');
                    setPositionOpen(true);
                  }}
                />
                <img src={SearchIcon} alt="" />
              </div>
              {positionOpen && (
                <div className="people-modal__position-options">
                  {filteredPositions.map((position) => (
                    <button
                      type="button"
                      key={position}
                      onClick={() => {
                        set('title', position);
                        setPositionSearch(position);
                        setPositionOpen(false);
                      }}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <Field label="Admin rights" required>
            <select
              className="input input--select"
              value={form.role}
              onChange={(e) => set('role', e.target.value as Role)}
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value={Role.ADMIN}>Admin</option>
              <option value={Role.STANDARD}>Standard</option>
            </select>
          </Field>
        </div>

        <div className="people-modal__footer">
          <div className="people-modal__footer-right">
            <button className="people-modal__cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="people-modal__add"
              onClick={() => onSave(form)}
              disabled={!isValid}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
