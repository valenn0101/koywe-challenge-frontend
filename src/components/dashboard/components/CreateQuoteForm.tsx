'use client';

import { useState, useEffect } from 'react';
import { useCreateQuote } from '@/hooks/useCurrencies';
import { useAuth } from '@/lib/providers/auth-context';
import axios from 'axios';
import { toast } from 'nextjs-toast-notify';

interface CreateQuoteFormProps {
  currencies: string[];
}

export default function CreateQuoteForm({ currencies }: CreateQuoteFormProps) {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [currencyError, setCurrencyError] = useState<string>('');

  const { accessToken } = useAuth();
  const createQuoteMutation = useCreateQuote();

  useEffect(() => {
    if (!accessToken) {
      setError('No hay una sesión activa. Por favor, inicia sesión nuevamente.');
    } else {
      setError('');
    }
  }, [accessToken]);

  useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency === toCurrency) {
      setCurrencyError('Las monedas de origen y destino no pueden ser iguales');
    } else {
      setCurrencyError('');
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (currencies.length >= 2 && !fromCurrency && !toCurrency) {
      setFromCurrency(currencies[0]);
      setToCurrency(currencies[1]);
    }
  }, [currencies]);

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFromCurrency = e.target.value;
    setFromCurrency(newFromCurrency);

    if (newFromCurrency === toCurrency && currencies.length > 1) {
      const newToCurrency = currencies.find(c => c !== newFromCurrency);
      if (newToCurrency) {
        setToCurrency(newToCurrency);
      }
    }
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newToCurrency = e.target.value;
    setToCurrency(newToCurrency);

    if (newToCurrency === fromCurrency && currencies.length > 1) {
      const newFromCurrency = currencies.find(c => c !== newToCurrency);
      if (newFromCurrency) {
        setFromCurrency(newFromCurrency);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessToken) {
      toast.error('No hay token de acceso disponible. Por favor, inicia sesión nuevamente.', {
        duration: 4000,
        position: 'bottom-center',
      });
      return;
    }

    if (!fromCurrency || !toCurrency) {
      toast.error('Por favor, selecciona las monedas', {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    if (fromCurrency === toCurrency) {
      toast.error('Las monedas de origen y destino deben ser diferentes', {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    if (amount <= 0) {
      toast.error('El monto debe ser mayor a 0', {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    try {
      const result = await createQuoteMutation.mutateAsync({
        amount,
        from: fromCurrency,
        to: toCurrency,
      });

      console.log('Resultado de la cotización:', result);

      toast.success('Cotización creada exitosamente', {
        duration: 3000,
        position: 'bottom-center',
      });

      setAmount(1);
      setFromCurrency('');
      setToCurrency('');
    } catch (error: unknown) {
      console.error('Error al crear cotización:', error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Error de autenticación. Por favor, inicia sesión nuevamente.', {
          duration: 4000,
          position: 'bottom-center',
        });
      } else if (error instanceof Error && error.message === 'No hay token de acceso disponible') {
        toast.error('No hay una sesión activa. Por favor, inicia sesión nuevamente.', {
          duration: 4000,
          position: 'bottom-center',
        });
      } else {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : error instanceof Error
            ? error.message
            : 'Error desconocido';

        toast.error(`Error al crear la cotización: ${errorMessage}`, {
          duration: 4000,
          position: 'bottom-center',
        });
      }
    }
  };

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Crear Nueva Cotización</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
            Monto
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            step="0.000001"
            min="0.000001"
            className="block w-full rounded-md border-gray-300 pl-2 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fromCurrency" className="mb-1 block text-sm font-medium text-gray-700">
              Moneda de Origen
            </label>
            <select
              id="fromCurrency"
              name="fromCurrency"
              value={fromCurrency}
              onChange={handleFromCurrencyChange}
              className={`block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                currencyError ? 'border-red-500' : ''
              }`}
              required
            >
              <option value="">Selecciona una moneda</option>
              {currencies.map(currency => (
                <option key={`from-${currency}`} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="toCurrency" className="mb-1 block text-sm font-medium text-gray-700">
              Moneda de Destino
            </label>
            <select
              id="toCurrency"
              name="toCurrency"
              value={toCurrency}
              onChange={handleToCurrencyChange}
              className={`block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                currencyError ? 'border-red-500' : ''
              }`}
              required
            >
              <option value="">Selecciona una moneda</option>
              {currencies.map(currency => (
                <option key={`to-${currency}`} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            {currencyError && <p className="mt-1 text-sm text-red-600">{currencyError}</p>}
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:cursor-pointer hover:bg-indigo-700 hover:opacity-80 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            disabled={createQuoteMutation.isPending || !!currencyError || !accessToken}
          >
            {createQuoteMutation.isPending ? 'Creando...' : 'Crear Cotización'}
          </button>
        </div>
      </form>
    </div>
  );
}
