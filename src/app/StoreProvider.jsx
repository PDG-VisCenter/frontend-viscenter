'use client';

import { makeStore } from '../lib/store';
import { Provider } from 'react-redux';
import { useRef } from 'react';

export default function StoreProvider({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
