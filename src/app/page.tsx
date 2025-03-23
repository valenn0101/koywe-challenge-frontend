'use client';

import AuthContainer from '@/components/login/AuthContainer';
import { useAuth } from '@/lib/providers/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div
          role="status"
          className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"
        ></div>
      </div>
    );
  }

  return <AuthContainer />;
}
