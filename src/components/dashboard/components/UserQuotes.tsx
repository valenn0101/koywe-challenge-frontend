'use client';

import { useState, useEffect } from 'react';
import { FaExchangeAlt, FaClock } from 'react-icons/fa';
import { useUserQuotes } from '@/hooks/useCurrencies';

export default function UserQuotes() {
  const { data: quotes = [], isLoading, isError } = useUserQuotes();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isQuoteExpired = (expiresAt: string) => {
    return new Date(expiresAt) < currentTime;
  };

  const calculateTimeLeft = (expiresAt: string) => {
    const expirationTime = new Date(expiresAt);
    const diffMs = expirationTime.getTime() - currentTime.getTime();

    if (diffMs <= 0) return 'Expirado';

    const diffSecs = Math.floor(diffMs / 1000);
    const mins = Math.floor(diffSecs / 60);
    const secs = diffSecs % 60;

    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (isError)
    return (
      <div className="mt-6 text-center">
        <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">Error al cargar las cotizaciones</p>
        </div>
      </div>
    );

  if (quotes.length === 0)
    return (
      <div className="mt-6 text-center">
        <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-gray-600">No tienes ninguna cotización</p>
        </div>
      </div>
    );

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center">
        <FaExchangeAlt className="mr-2 text-lg text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Tus Cotizaciones</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quotes.map(quote => (
          <div
            key={quote.id}
            className={`rounded-lg border p-4 ${
              isQuoteExpired(quote.expiresAt)
                ? 'border-gray-200 bg-gray-50'
                : 'border-indigo-100 bg-white shadow-sm'
            }`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-800">
                  {quote.from} → {quote.to}
                </span>
              </div>
              <div
                className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  isQuoteExpired(quote.expiresAt)
                    ? 'bg-gray-200 text-orange-600'
                    : 'bg-indigo-50 text-green-700'
                }`}
              >
                <FaClock className="mr-1" />
                {isQuoteExpired(quote.expiresAt)
                  ? 'Expirado'
                  : `Expira en: ${calculateTimeLeft(quote.expiresAt)}`}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <div className="text-sm text-gray-500">Monto</div>
                <div className="font-medium text-gray-800">
                  {quote.amount} {quote.from}
                </div>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <div className="text-sm text-gray-500">Tasa</div>
                <div className="font-medium text-gray-800">{quote.rate.toFixed(8)}</div>
              </div>

              <div className="flex justify-between border-b border-gray-100 pb-2">
                <div className="text-sm text-gray-500">Monto Convertido</div>
                <div className="font-medium text-gray-800">
                  {quote.convertedAmount.toFixed(8)} {quote.to}
                </div>
              </div>

              <div className="pt-1 text-xs text-gray-500">
                Creado: {new Date(quote.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
