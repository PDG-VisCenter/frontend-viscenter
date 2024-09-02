'use client';

import { SessionProvider } from 'next-auth/react';

function Providers({ children }) {
  return <SessionProvider refetchInterval={4 * 60}>{children}</SessionProvider>;
}

export default Providers;
