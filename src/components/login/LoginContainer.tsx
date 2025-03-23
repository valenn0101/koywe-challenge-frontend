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
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const { loginMutation } = useAuthQuery();
  const isLoading = loginMutation.isPending;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      return 'La contraseña debe incluir al menos un carácter especial';
    }

    return '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!validateEmail(loginRequest.email)) {
      newErrors.email = 'Por favor ingrese un correo electrónico válido';
      isValid = false;
    }

    const passwordError = validatePassword(loginRequest.password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

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
      errors={errors}
      onEmailChange={value => setLoginRequest({ ...loginRequest, email: value })}
      onPasswordChange={value => setLoginRequest({ ...loginRequest, password: value })}
      onSubmit={handleSubmit}
    />
  );
}
