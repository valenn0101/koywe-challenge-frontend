'use client';

import { useState, FormEvent } from 'react';
import RegisterPresentation from './RegisterPresentation';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { toast } from 'nextjs-toast-notify';

interface RegisterContainerProps {
  onSwitchToLogin: () => void;
}

export default function RegisterContainer({ onSwitchToLogin }: RegisterContainerProps) {
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { registerMutation } = useAuthQuery();
  const isLoading = registerMutation.isPending;

  const validateName = (name: string): string => {
    if (name.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    return '';
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }

    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(password)) {
      return 'La contraseña debe incluir al menos un carácter especial';
    }

    return '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };

    const nameError = validateName(registerData.name);
    if (nameError) {
      newErrors.name = nameError;
      isValid = false;
    }

    if (!validateEmail(registerData.email)) {
      newErrors.email = 'Por favor ingrese un correo electrónico válido';
      isValid = false;
    }

    const passwordError = validatePassword(registerData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      await registerMutation.mutateAsync(registerData);

      onSwitchToLogin();
    } catch (error) {
      toast.error(`Error al registrar usuario: ${error}`, {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  };

  return (
    <RegisterPresentation
      name={registerData.name}
      email={registerData.email}
      password={registerData.password}
      isLoading={isLoading}
      errors={errors}
      onNameChange={value => setRegisterData({ ...registerData, name: value })}
      onEmailChange={value => setRegisterData({ ...registerData, email: value })}
      onPasswordChange={value => setRegisterData({ ...registerData, password: value })}
      onSubmit={handleSubmit}
      onBackToLogin={onSwitchToLogin}
    />
  );
}
