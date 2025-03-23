'use client';

import { ReactNode } from 'react';
import { ReactQueryProvider } from './react-query';
import { AuthProvider } from './auth-context';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
}
