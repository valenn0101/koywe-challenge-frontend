'use client';

import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '@/lib/providers/auth-context';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            KoyweCurrency
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center">
              <div className="mr-4 flex items-center">
                <FaUser className="mr-2 text-indigo-600" />
                <span className="text-gray-700">{user?.name || user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex cursor-pointer items-center rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                <FaSignOutAlt className="mr-2" />
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              href="/"
              className="flex cursor-pointer items-center rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
