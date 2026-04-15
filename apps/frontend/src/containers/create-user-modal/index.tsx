import { useState } from 'react';
import Role from '@api/dtos/role';
import '../create-publication-modal/styles.css';

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
        {label} {required && <span className="field__required"></span>}
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
}: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserFormState>(INITIAL_FORM);

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

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <div className="modal__header-row">
            <h1 className="modal__title">Create User</h1>
            <button className="modal__close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="modal__body">
          <Field label="First Name" required>
            <input
              className="input"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
            />
          </Field>

          <Field label="Last Name" required>
            <input
              className="input"
              placeholder="Enter last name"
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
          <Field label="Title" required>
            <input
              className="input"
              placeholder="Enter title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </Field>

          <Field label="Status" required>
            <select
              className="input input--select"
              value={form.role}
              onChange={(e) => set('role', e.target.value as Role)}
            >
              <option value="" disabled>
                Select a status
              </option>
              <option value={Role.ADMIN}>Admin</option>
              <option value={Role.STANDARD}>Standard</option>
            </select>
          </Field>
        </div>

        <div className="modal__footer">
          <div className="modal__footer-right">
            <button
              className="btn btn--primary"
              onClick={() => onSave(form)}
              disabled={!isValid}
            >
              Create User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
