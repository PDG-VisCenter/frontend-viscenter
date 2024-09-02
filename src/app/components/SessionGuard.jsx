'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

function SessionGuard({ children }) {
  const { data } = useSession();
  useEffect(() => {
    if (data?.error === 'RefreshAccessTokenError') {
      signIn('keycloak');
    }
  }, [data]);

  return <>{children}</>;
}

export default SessionGuard;
