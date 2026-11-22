import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import apiClient from '../../api/apiClient';
import User from '../../api/dtos/user.dto';
import { OmchaiEntry, OmchaiRole } from '../../types';
import './omchai-view.css';

interface Props {
  anthologyId: number;
  /** Add or remove Consulted, Helper, Approver and Informed. */
  canManageTeam: boolean;
  /** Add or remove Owners and Managers. */
  canManageLeads: boolean;
}

export const ROLE_META: Record<
  OmchaiRole,
  { label: string; description: string }
> = {
  [OmchaiRole.OWNER]: {
    label: 'Owner',
    description:
      'Has overall responsibility for the success or failure of the project. Ensures that all the work gets done and that others are involved appropriately.',
  },
  [OmchaiRole.MANAGER]: {
    label: 'Manager',
    description:
      'Assigns responsibility and holds the owner accountable. Makes suggestions, asks hard questions, reviews progress, and intervenes if the work is off-track.',
  },
  [OmchaiRole.CONSULTED]: {
    label: 'Consulted',
    description:
      'Should be asked for input or needs to be bought in to the project.',
  },
  [OmchaiRole.HELPER]: {
    label: 'Helper',
    description: 'Assists with or does some of the work.',
  },
  [OmchaiRole.APPROVER]: {
    label: 'Approver',
    description:
      "Signs off on decisions before they're final. May be the manager, executive director, students, or an external partner.",
  },
  [OmchaiRole.INFORMED]: {
    label: 'Informed',
    description:
      'Is kept updated about progress in the project at designated points.',
  },
};

const ROLE_ORDER: OmchaiRole[] = [
  OmchaiRole.OWNER,
  OmchaiRole.MANAGER,
  OmchaiRole.CONSULTED,
  OmchaiRole.HELPER,
  OmchaiRole.APPROVER,
  OmchaiRole.INFORMED,
];

// Owner and Manager are gated by canManageLeads, the rest by canManageTeam
const LEAD_ROLES = [OmchaiRole.OWNER, OmchaiRole.MANAGER];

export const LAST_OWNER_MESSAGE =
  'A publication needs at least one Owner. Add another Owner before removing this one.';

const fullName = (user: { firstName: string; lastName: string }) =>
  `${user.firstName} ${user.lastName}`.trim();

const errorMessage = (error: unknown) => {
  const message = (error as { response?: { data?: { message?: unknown } } })
    .response?.data?.message;
  return typeof message === 'string'
    ? message
    : 'Save failed. Please try again.';
};

const today = () => new Date().toISOString().slice(0, 10);

const InfoIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 11v6" />
    <path d="M12 7.5v.01" />
  </svg>
);

const Avatar: React.FC<{ name: string }> = ({ name }) => (
  <span className="omchai-avatar" aria-hidden="true">
    {name.charAt(0).toUpperCase()}
  </span>
);

interface PickerProps {
  role: OmchaiRole;
  staff: User[] | null;
  staffError: boolean;
  assignedRoles: Map<number, OmchaiRole>;
  onPick: (user: User) => void;
  onClose: () => void;
}

const StaffPicker: React.FC<PickerProps> = ({
  role,
  staff,
  staffError,
  assignedRoles,
  onPick,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [onClose]);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (staff ?? [])
      .filter((user) =>
        [fullName(user), user.email, user.title ?? '']
          .join(' ')
          .toLowerCase()
          .includes(needle),
      )
      .sort((a, b) => fullName(a).localeCompare(fullName(b)));
  }, [staff, query]);

  return (
    <div
      ref={ref}
      className="omchai-picker"
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
    >
      <input
        autoFocus
        className="omchai-picker__search"
        placeholder="Search staff..."
        aria-label={`Search staff to add as ${ROLE_META[role].label}`}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul className="omchai-picker__list" role="listbox">
        {staffError && (
          <li className="omchai-picker__note">Couldn't load staff.</li>
        )}
        {!staffError && staff === null && (
          <li className="omchai-picker__note">Loading staff...</li>
        )}
        {staff !== null && matches.length === 0 && (
          <li className="omchai-picker__note">No staff match "{query}".</li>
        )}
        {matches.map((user) => {
          const currentRole = assignedRoles.get(user.id);
          return (
            <li key={user.id}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="omchai-picker__option"
                disabled={currentRole !== undefined}
                onClick={() => onPick(user)}
              >
                <Avatar name={user.firstName} />
                <span className="omchai-picker__name">{fullName(user)}</span>
                <span className="omchai-picker__meta">
                  {currentRole
                    ? `Already ${ROLE_META[currentRole].label}`
                    : user.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const OmchaiView: React.FC<Props> = ({
  anthologyId,
  canManageTeam,
  canManageLeads,
}) => {
  const queryClient = useQueryClient();
  const [pickerRole, setPickerRole] = useState<OmchaiRole | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Shares its cache with useOmchaiPermissions, so other tabs see changes too
  const omchaiKey = ['omchai', anthologyId];
  const { isLoading, data: entries = [] } = useQuery({
    queryKey: omchaiKey,
    queryFn: () => apiClient.getOmchaiByAnthology(anthologyId),
  });
  const setEntries = (update: (prev: OmchaiEntry[]) => OmchaiEntry[]) =>
    queryClient.setQueryData<OmchaiEntry[]>(omchaiKey, (prev = []) =>
      update(prev),
    );

  const canEdit = (role: OmchaiRole) =>
    LEAD_ROLES.includes(role) ? canManageLeads : canManageTeam;
  const canEditAny = canManageTeam || canManageLeads;

  // The staff list is only needed by people who can open the picker
  const { data: staff, isError: staffError } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
    enabled: canEditAny,
  });

  const assignedRoles = useMemo(
    () =>
      new Map(
        entries
          .filter((entry) => entry.user)
          .map((entry) => [entry.user.id, entry.role]),
      ),
    [entries],
  );

  const runSave = async (change: () => Promise<void>) => {
    setSaving(true);
    setSaveError(null);
    try {
      await change();
    } catch (error) {
      setSaveError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const addAssignment = (role: OmchaiRole, user: User) => {
    setPickerRole(null);
    return runSave(async () => {
      const created = await apiClient.createOmchaiAssignment({
        anthologyId,
        userId: user.id,
        role,
        datetimeAssigned: today(),
      });
      setEntries((prev) => [...prev, created]);
    });
  };

  const removeAssignment = (entry: OmchaiEntry) => {
    const owners = entries.filter((e) => e.role === OmchaiRole.OWNER);
    if (entry.role === OmchaiRole.OWNER && owners.length <= 1) {
      setSaveError(LAST_OWNER_MESSAGE);
      return;
    }
    return runSave(async () => {
      await apiClient.deleteOmchaiAssignment(entry.id);
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    });
  };

  if (isLoading) {
    return <div className="omchai-loading">Loading OMCHAI...</div>;
  }

  return (
    <div className="omchai">
      {canEditAny && (
        <div className="omchai__save-state" role="status">
          {saving ? 'Saving…' : saveError ? '' : 'Saved'}
        </div>
      )}
      {saveError && (
        <p className="omchai__error" role="alert">
          {saveError}
        </p>
      )}

      <dl className="omchai-list">
        {ROLE_ORDER.map((role) => {
          const meta = ROLE_META[role];
          const assigned = entries.filter(
            (entry) => entry.role === role && entry.user,
          );
          const editable = canEdit(role);
          const tooltipId = `omchai-tooltip-${role}`;

          return (
            <div key={role} className="omchai-row">
              <dt className="omchai-row__label">
                <span className="omchai-info">
                  <button
                    type="button"
                    className="omchai-info__icon"
                    aria-label={`About ${meta.label}`}
                    aria-describedby={tooltipId}
                  >
                    <InfoIcon />
                  </button>
                  <span
                    id={tooltipId}
                    role="tooltip"
                    className="omchai-info__tip"
                  >
                    {meta.description}
                  </span>
                </span>
                {meta.label}
              </dt>
              <dd className="omchai-row__people">
                {assigned.map((entry) => {
                  const name = fullName(entry.user);
                  return (
                    <span key={entry.id} className="omchai-person">
                      <Avatar name={entry.user.firstName} />
                      <span className="omchai-person__name">{name}</span>
                      {editable && (
                        <button
                          type="button"
                          className="omchai-person__remove"
                          aria-label={`Remove ${name} from ${meta.label}`}
                          disabled={saving}
                          onClick={() => removeAssignment(entry)}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  );
                })}
                {editable && (
                  <span className="omchai-add">
                    <button
                      type="button"
                      className="omchai-add__button"
                      aria-label={`Add ${meta.label} assignment`}
                      aria-expanded={pickerRole === role}
                      disabled={saving}
                      onClick={() =>
                        setPickerRole((open) => (open === role ? null : role))
                      }
                    >
                      Add assignment.
                    </button>
                    {pickerRole === role && (
                      <StaffPicker
                        role={role}
                        staff={staff ?? null}
                        staffError={staffError}
                        assignedRoles={assignedRoles}
                        onPick={(user) => addAssignment(role, user)}
                        onClose={() => setPickerRole(null)}
                      />
                    )}
                  </span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

export default OmchaiView;
