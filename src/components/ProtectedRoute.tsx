'use client';

import { useAuth } from '@/lib/providers/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, router]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div
          role="status"
          className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"
        ></div>
      </div>
    );
  }

  return <>{children}</>;
}
