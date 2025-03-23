'use client';

import { FaUser } from 'react-icons/fa';

interface WelcomeCardProps {
  userName?: string;
}

export default function WelcomeCard({ userName }: WelcomeCardProps) {
  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center">
        <FaUser className="mr-3 text-2xl text-indigo-600" />
        <h1 className="text-2xl font-semibold text-gray-800">
          ¡Bienvenido{userName ? `, ${userName}` : ''}!
        </h1>
      </div>
      <p className="text-gray-600">
        Bienvenido a la plataforma de cotización de monedas. A continuación, encontrarás la lista de
        monedas disponibles.
      </p>
    </div>
  );
}
