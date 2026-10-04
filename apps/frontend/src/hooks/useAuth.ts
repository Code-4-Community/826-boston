import { useEffect } from 'react';
import User from '@api/dtos/user.dto';
import * as Sentry from '@sentry/react';
import apiClient from '@api/apiClient';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useQuery, useQueryClient } from 'react-query';

export default function useAuth(): [boolean, boolean, User | undefined] {
  // get authStatus from authenticator hook
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const isUserAuthenticated = authStatus === 'authenticated';
  const queryClient = useQueryClient();

  // prevent unauthenticated users from seeing the auth data from previous logins
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      queryClient.removeQueries(['auth']);
    }
  }, [authStatus, queryClient]);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['auth'],
    queryFn: () => apiClient.getMe(),
    enabled: isUserAuthenticated,
  });

  // sentry user tracking
  useEffect(() => {
    if (isUserAuthenticated && data) {
      Sentry.setUser({ id: data.id, email: data.email });
    } else {
      Sentry.setUser(null);
    }
  }, [isUserAuthenticated, data]);

  return [
    isLoading || authStatus === 'configuring',
    isError,
    isUserAuthenticated ? data : undefined,
  ];
}
