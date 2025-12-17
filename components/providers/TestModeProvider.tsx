'use client';

import { useEffect } from 'react';
import { initializeTestHooks } from '@/lib/testing/TestHooks';

export function TestModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeTestHooks();
  }, []);

  return <>{children}</>;
}