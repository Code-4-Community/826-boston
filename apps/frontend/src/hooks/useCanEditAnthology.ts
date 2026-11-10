import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import Role from '../api/dtos/role';
import { OmchaiRole } from '../types';

/**
 * Whether the current user can edit a publication: admins always can,
 * otherwise only the publication's Owner or Manager. Mirrors the backend's
 * @OmchaiRoles(OWNER, MANAGER) check on PATCH /anthologies/:id.
 */
export function useCanEditAnthology(
  anthologyId: number,
  currentUser?: { id: number; role: Role | string },
): boolean {
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const isAdmin = String(currentUser?.role ?? '').toLowerCase() === 'admin';
    setCanEdit(isAdmin);
    if (isAdmin) return;
    // The endpoint 404s when a publication has no assignments yet
    apiClient
      .getOmchaiByAnthology(anthologyId)
      .then((entries) => {
        const assignment = entries.find(
          (entry) => entry.userId === currentUser?.id,
        );
        setCanEdit(
          assignment?.role === OmchaiRole.OWNER ||
            assignment?.role === OmchaiRole.MANAGER,
        );
      })
      .catch(() => setCanEdit(false));
  }, [anthologyId, currentUser]);

  return canEdit;
}
