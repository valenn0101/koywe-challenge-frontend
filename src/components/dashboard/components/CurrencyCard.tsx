'use client';

import { FaArrowRight } from 'react-icons/fa';
import getCurrencyInfo from '@/helper/getCurrencyInfo';

interface CurrencyCardProps {
  currency: string;
}

export default function CurrencyCard({ currency }: CurrencyCardProps) {
  const currencyInfo = getCurrencyInfo(currency);

  return (
    <div
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
}
