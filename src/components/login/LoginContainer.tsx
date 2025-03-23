'use client';

import { useState, FormEvent } from 'react';
import LoginPresentation from './LoginPresentation';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { toast } from 'nextjs-toast-notify';

export default function LoginContainer() {
  const [loginRequest, setLoginRequest] = useState({
    email: '',
    password: '',
  });

  const { loginMutation } = useAuthQuery();
  const isLoading = loginMutation.isPending;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await loginMutation.mutate(loginRequest);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error(`Error al iniciar sesión: ${error}`, {
        duration: 4000,
        progress: false,
        position: 'bottom-center',
        transition: 'bottomToTopBounce',
        icon: '',
        sound: false,
      });
    }
  };

  return (
    <LoginPresentation
      email={loginRequest.email}
      password={loginRequest.password}
      isLoading={isLoading}
      onEmailChange={value => setLoginRequest({ ...loginRequest, email: value })}
      onPasswordChange={value => setLoginRequest({ ...loginRequest, password: value })}
      onSubmit={handleSubmit}
    />
  );
}
