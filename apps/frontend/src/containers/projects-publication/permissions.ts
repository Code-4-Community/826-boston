import { OmchaiRole } from '../../types';

/**
 * What the current user can change on a publication. Mirrors ACTION_ROLES in
 * apps/backend/src/auth/omchai-permissions.ts, which is what actually enforces
 * it; this copy only decides which controls to show. canEditTasks mirrors the
 * @OmchaiRoles on the write endpoints of TaskController instead.
 */
export interface OmchaiPermissions {
  canEditDrafts: boolean;
  canTickCheckpoints: boolean;
  canManageManuscript: boolean;
  canEditProduction: boolean;
  canEditTasks: boolean;
}

const { OWNER, MANAGER, HELPER, APPROVER } = OmchaiRole;

const ROLES: Record<keyof OmchaiPermissions, OmchaiRole[]> = {
  canEditDrafts: [OWNER, MANAGER, HELPER],
  canTickCheckpoints: [OWNER, MANAGER, APPROVER],
  canManageManuscript: [OWNER, MANAGER, APPROVER],
  canEditProduction: [OWNER, MANAGER],
  canEditTasks: [OWNER, MANAGER],
};

export const NO_PERMISSIONS: OmchaiPermissions = {
  canEditDrafts: false,
  canTickCheckpoints: false,
  canManageManuscript: false,
  canEditProduction: false,
  canEditTasks: false,
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
    canEditTasks: allowed('canEditTasks'),
  };
}
