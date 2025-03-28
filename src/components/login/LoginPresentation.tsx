'use client';

import type { FormEvent } from 'react';

interface LoginPresentationProps {
  email: string;
  password: string;
  isLoading: boolean;
  errors: {
    email: string;
    password: string;
  };
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onRegisterClick: () => void;
}

export default function LoginPresentation({
  email,
  password,
  isLoading,
  errors,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onRegisterClick,
}: LoginPresentationProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="mb-8 w-full max-w-md text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
          Currency Exchange Rate
        </h1>
        <p className="text-gray-600">Convert currencies with ease</p>
      </div>

      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-center text-xl font-medium text-gray-800">Sign In</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => onEmailChange(e.target.value)}
              className={`h-10 w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => onPasswordChange(e.target.value)}
              className={`h-10 w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="h-10 w-full rounded-md bg-blue-600 font-medium text-white transition-colors hover:cursor-pointer hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-4 text-center">
          <p className="mb-2 text-sm text-gray-600">Don&apos;t have an account?</p>
          <button
            className="h-10 w-full rounded-md bg-gray-100 font-medium text-gray-800 transition-colors hover:cursor-pointer hover:bg-gray-200"
            onClick={onRegisterClick}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
