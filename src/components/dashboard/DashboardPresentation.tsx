'use client';

import WelcomeCard from './components/WelcomeCard';
import CurrenciesList from './components/CurrenciesList';

interface DashboardPresentationProps {
  userName?: string;
  currencies: string[];
  isLoading: boolean;
}

export default function DashboardPresentation({
  userName,
  currencies,
  isLoading,
}: DashboardPresentationProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeCard userName={userName} />
      <CurrenciesList currencies={currencies} isLoading={isLoading} />
    </div>
  );
}
