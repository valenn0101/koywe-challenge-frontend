'use client';

import { useState } from 'react';
import LoginContainer from './LoginContainer';
import RegisterContainer from './RegisterContainer';

export default function AuthContainer() {
  const [showLogin, setShowLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
  };

  return (
    <>
      {showLogin ? (
        <LoginContainer onRegisterClick={handleSwitchToRegister} />
      ) : (
        <RegisterContainer onSwitchToLogin={handleSwitchToLogin} />
      )}
    </>
  );
}
