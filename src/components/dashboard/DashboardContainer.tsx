'use client';

import { useAuth } from '@/lib/providers/auth-context';
import { useCurrencies } from '@/hooks/useCurrencies';
import DashboardPresentation from './DashboardPresentation';
import Layout from '@/components/Layout';

export default function DashboardContainer() {
  const { user } = useAuth();
  const { data: currencies = [], isLoading } = useCurrencies();

  return (
    <Layout>
      <DashboardPresentation userName={user?.name} currencies={currencies} isLoading={isLoading} />
    </Layout>
  );
}
