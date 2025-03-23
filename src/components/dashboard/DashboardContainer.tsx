'use client';

import { useAuth } from '@/lib/providers/auth-context';
import { useCurrencies } from '@/hooks/useCurrencies';
import DashboardPresentation from './DashboardPresentation';

export default function DashboardContainer() {
  const { user } = useAuth();
  const { data: currencies = [], isLoading } = useCurrencies();

  return (
    <DashboardPresentation userName={user?.name} currencies={currencies} isLoading={isLoading} />
  );
}
