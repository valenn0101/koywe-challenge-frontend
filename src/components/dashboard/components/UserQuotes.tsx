'use client';

import { useState, useEffect } from 'react';
import { FaExchangeAlt, FaClock, FaTrash, FaSync } from 'react-icons/fa';
import { useUserQuotes, useDeleteQuote, useReloadQuote } from '@/hooks/useCurrencies';
import { Quote } from '@/types/quote';
export default function UserQuotes() {
  const { data: quotes = [], isLoading, isError } = useUserQuotes();
  const deleteQuote = useDeleteQuote();
  const reloadQuote = useReloadQuote();
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
        <div
          data-testid="loading-spinner"
          className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"
        ></div>
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
        {quotes.map((quote: Quote) => (
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

              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-gray-500">
                  Creado: {new Date(quote.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => reloadQuote.mutate(String(quote.id))}
                    disabled={reloadQuote.isPending || isQuoteExpired(quote.expiresAt)}
                    className={`cursor-pointer rounded-full p-1 ${
                      isQuoteExpired(quote.expiresAt)
                        ? 'cursor-not-allowed text-gray-400 opacity-50'
                        : 'text-indigo-500 hover:bg-indigo-50 disabled:opacity-50'
                    }`}
                    title={
                      isQuoteExpired(quote.expiresAt)
                        ? 'No se puede recargar una cotización expirada'
                        : 'Recargar cotización'
                    }
                    data-testid="reload-quote-btn"
                  >
                    <FaSync
                      className={`h-4 w-4 ${reloadQuote.isPending && !isQuoteExpired(quote.expiresAt) ? 'animate-spin' : ''}`}
                    />
                  </button>
                  <button
                    onClick={() => deleteQuote.mutate(String(quote.id))}
                    disabled={deleteQuote.isPending}
                    className="rounded-full p-1 text-red-500 hover:cursor-pointer hover:bg-red-50 disabled:opacity-50"
                    data-testid="delete-quote-btn"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
