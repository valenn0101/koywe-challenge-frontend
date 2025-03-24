'use client';

import { useState } from 'react';
import { FaCoins, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import CurrencyCard from './CurrencyCard';

interface CurrenciesListProps {
  currencies: string[];
  isLoading: boolean;
}

export default function CurrenciesList({ currencies, isLoading }: CurrenciesListProps) {
  const [isCurrenciesVisible, setIsCurrenciesVisible] = useState(true);

  const toggleCurrenciesVisibility = () => {
    setIsCurrenciesVisible(!isCurrenciesVisible);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div
        className="mb-6 flex cursor-pointer items-center justify-between"
        onClick={toggleCurrenciesVisibility}
      >
        <div className="flex items-center">
          <FaCoins className="mr-3 text-2xl text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">Monedas Disponibles</h2>
        </div>
        <div className="text-indigo-600">
          {isCurrenciesVisible ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {isCurrenciesVisible &&
        (isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currencies.map(currency => (
              <CurrencyCard key={currency} currency={currency} />
            ))}
          </div>
        ))}
    </div>
  );
}
