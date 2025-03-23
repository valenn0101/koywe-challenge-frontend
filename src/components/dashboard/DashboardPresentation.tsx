'use client';

import { FaCoins, FaUser, FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';
import getCurrencyInfo from '@/helper/getCurrencyInfo';

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
  const [isCurrenciesVisible, setIsCurrenciesVisible] = useState(true);

  const toggleCurrenciesVisibility = () => {
    setIsCurrenciesVisible(!isCurrenciesVisible);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center">
          <FaUser className="mr-3 text-2xl text-indigo-600" />
          <h1 className="text-2xl font-semibold text-gray-800">
            ¡Bienvenido{userName ? `, ${userName}` : ''}!
          </h1>
        </div>
        <p className="text-gray-600">
          Bienvenido a la plataforma de cotización de monedas. A continuación, encontrarás la lista
          de monedas disponibles.
        </p>
      </div>

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
              {currencies.map(currency => {
                const currencyInfo = getCurrencyInfo(currency);
                return (
                  <div
                    key={currency}
                    className={`rounded-lg ${currencyInfo.color} p-5 shadow-sm transition-all hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                          {currencyInfo.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{currency}</h3>
                          <p className="text-sm text-gray-600">{currencyInfo.name}</p>
                        </div>
                      </div>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-indigo-50">
                        <FaArrowRight className="text-indigo-600" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
}
