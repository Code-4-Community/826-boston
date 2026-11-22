import { OmchaiRole } from '../../types';

/**
 * What the current user can change on a publication. Mirrors ACTION_ROLES in
 * apps/backend/src/auth/omchai-permissions.ts, which is what actually enforces
 * it; this copy only decides which controls to show.
 */
export interface OmchaiPermissions {
  canEditDrafts: boolean;
  canTickCheckpoints: boolean;
  canManageManuscript: boolean;
  canEditProduction: boolean;
  /** Add or remove Consulted, Helper, Approver and Informed. */
  canManageTeam: boolean;
  /** Add or remove Owners and Managers. */
  canManageLeads: boolean;
}

const { OWNER, MANAGER, HELPER, APPROVER } = OmchaiRole;

const ROLES: Record<keyof OmchaiPermissions, OmchaiRole[]> = {
  canEditDrafts: [OWNER, MANAGER, HELPER],
  canTickCheckpoints: [OWNER, MANAGER, APPROVER],
  canManageManuscript: [OWNER, MANAGER, APPROVER],
  canEditProduction: [OWNER, MANAGER],
  canManageTeam: [OWNER, MANAGER],
  // Admins only
  canManageLeads: [],
};

export const NO_PERMISSIONS: OmchaiPermissions = {
  canEditDrafts: false,
  canTickCheckpoints: false,
  canManageManuscript: false,
  canEditProduction: false,
  canManageTeam: false,
  canManageLeads: false,
};

export function permissionsFor(
  role: OmchaiRole | undefined,
  isAdmin: boolean,
): OmchaiPermissions {
  const allowed = (key: keyof OmchaiPermissions) =>
    isAdmin || (!!role && ROLES[key].includes(role));
  return {
    canEditDrafts: allowed('canEditDrafts'),
    canTickCheckpoints: allowed('canTickCheckpoints'),
    canManageManuscript: allowed('canManageManuscript'),
    canEditProduction: allowed('canEditProduction'),
    canManageTeam: allowed('canManageTeam'),
    canManageLeads: allowed('canManageLeads'),
  };
}
