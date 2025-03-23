'use client';

import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/lib/providers/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  if (!isAuthenticated) {
    router.push('/');
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-indigo-600">KoyweCurrency</p>

          {isAuthenticated ? (
            <div className="flex items-center">
              <button
                onClick={logout}
                className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-indigo-700"
              >
                <FaSignOutAlt className="mr-2" />
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              href="/"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
