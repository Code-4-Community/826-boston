import { useQuery } from 'react-query';
import apiClient from '@api/apiClient';
import Role from '@api/dtos/role';
import useAuth from './useAuth';
import {
  NO_PERMISSIONS,
  OmchaiPermissions,
  permissionsFor,
} from '../containers/projects-publication/permissions';

/**
 * The current user's permissions on one publication, from their OMCHAI role
 * there (admins get everything). Every flag is false until both the user and
 * the assignments have loaded, so controls stay hidden rather than flashing.
 */
export default function useOmchaiPermissions(
  anthologyId: number | undefined,
): OmchaiPermissions & { isLoading: boolean } {
  const [authLoading, , currentUser] = useAuth();

  const { isLoading: omchaiLoading, data: entries } = useQuery({
    queryKey: ['omchai', anthologyId],
    queryFn: () => apiClient.getOmchaiByAnthology(anthologyId as number),
    enabled: anthologyId !== undefined && !!currentUser,
  });

  if (authLoading || !currentUser) {
    return { ...NO_PERMISSIONS, isLoading: authLoading };
  }

  const isAdmin = currentUser.role === Role.ADMIN;
  if (isAdmin) return { ...permissionsFor(undefined, true), isLoading: false };
  if (omchaiLoading) return { ...NO_PERMISSIONS, isLoading: true };

  // The endpoint returns the assignment with its user loaded, not a userId.
  const mine = entries?.find((entry) => entry.user?.id === currentUser.id);
  return { ...permissionsFor(mine?.role, false), isLoading: false };
}
