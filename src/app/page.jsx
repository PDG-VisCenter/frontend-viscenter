'use client';

import HomeClient from './home/page';
import { Skeleton } from 'antd';
import { useSession } from 'next-auth/react';

function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Skeleton active />;
  }

  return <HomeClient />;
}

export default Home;
