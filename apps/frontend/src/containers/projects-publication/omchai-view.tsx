import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { OmchaiEntry, OmchaiRole } from '../../types';
import './omchai-view.css';

interface Props {
  anthologyId: number;
}

const ROLE_META: Record<OmchaiRole, { label: string; description: string }> = {
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

const OmchaiView: React.FC<Props> = ({ anthologyId }) => {
  const [entries, setEntries] = useState<OmchaiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRoles, setExpandedRoles] = useState<Set<OmchaiRole>>(
    new Set(),
  );

  const toggleDescription = (role: OmchaiRole) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }
      return next;
    });
  };

  useEffect(() => {
    apiClient
      .getOmchaiByAnthology(anthologyId)
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [anthologyId]);

  if (loading) return <div className="omchai-loading">Loading OMCHAI...</div>;

  const byRole = new Map<OmchaiRole, OmchaiEntry[]>();
  for (const entry of entries) {
    const list = byRole.get(entry.role) ?? [];
    list.push(entry);
    byRole.set(entry.role, list);
  }

  return (
    <div className="omchai-grid">
      {ROLE_ORDER.map((role) => {
        const meta = ROLE_META[role];
        const assigned = byRole.get(role) ?? [];
        const isExpanded = expandedRoles.has(role);

        return (
          <div key={role} className="omchai-card">
            <div className="omchai-card__header">
              <h3 className="omchai-card__title">{meta.label}</h3>
              <button
                type="button"
                className="omchai-card__toggle"
                onClick={() => toggleDescription(role)}
                aria-label={
                  isExpanded ? 'Hide description' : 'Show description'
                }
              >
                {isExpanded ? '−' : '?'}
              </button>
            </div>
            {isExpanded && (
              <p className="omchai-card__desc">{meta.description}</p>
            )}
            <div className="omchai-card__users">
              {assigned.length === 0 ? (
                <span className="omchai-card__empty">No one assigned</span>
              ) : (
                assigned
                  .filter((entry) => entry.user)
                  .map((entry) => (
                    <div key={entry.id} className="omchai-user-chip">
                      <span className="omchai-user-chip__name">
                        {entry.user.firstName} {entry.user.lastName}
                      </span>
                      {entry.user.title && (
                        <span className="omchai-user-chip__title">
                          {entry.user.title}
                        </span>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OmchaiView;
