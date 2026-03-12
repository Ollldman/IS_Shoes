import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthCard from '../components/AuthCard';
import { login as loginAPI, setAuthToken } from '../services';
import { useAuth } from '../contexts/AuthContext';

// Регулярные выражения из бэкенда
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

interface FieldErrors {
  email?: string;
  password?: string;
  form?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Валидация email
  const validateEmail = (value: string): string | undefined => {
    if (!value) return 'Email обязателен';
    if (!EMAIL_REGEX.test(value)) return 'Введите корректный email';
    return undefined;
  };

  // Валидация пароля
  const validatePassword = (value: string): string | undefined => {
    if (!value) return 'Пароль обязателен';
    if (value.length < 8) return 'Пароль должен быть не менее 8 символов';
    if (!PASSWORD_REGEX.test(value)) return 'Пароль должен содержать хотя бы одну букву и одну цифру';
    return undefined;
  };

  // Валидация поля при потере фокуса
  const handleBlur = (field: string, value: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
    
    let error: string | undefined;
    if (field === 'email') error = validateEmail(value);
    if (field === 'password') error = validatePassword(value);
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Валидация всей формы
  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    const newErrors: FieldErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    
    // Помечаем все поля как "тронутые"
    setTouchedFields(new Set(['email', 'password']));
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const tokenResponse = await loginAPI(email, password);
      setAuthToken(tokenResponse.access_token);
      await login(tokenResponse.access_token);
      navigate('/');
    } catch (err: any) {
      setErrors({ form: err.message || 'Ошибка при входе' });
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Стили для поля с ошибкой
  const getInputStyle = (fieldName: string, hasError: boolean) => ({
    padding: 'var(--space-3)',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${hasError ? 'var(--error)' : 'var(--border)'}`,
    fontSize: '16px',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: hasError ? 'var(--error-bg)' : 'white',
    outline: 'none'
  });

  const isFieldError = (fieldName: string): boolean => {
    return touchedFields.has(fieldName) && !!errors[fieldName as keyof FieldErrors];
  };

  return (
    <AuthCard
      title="Вход в личный кабинет"
      alternativeText="Нет аккаунта?"
      alternativeLink="Зарегистрироваться"
      onAlternativeClick={handleRegisterClick}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        
        {/* Общая ошибка формы */}
        {errors.form && (
          <div style={{
            backgroundColor: 'var(--error-bg)',
            color: 'var(--error)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            marginBottom: 'var(--space-2)',
            border: '1px solid var(--error)'
          }}>
            {errors.form}
          </div>
        )}

        {/* Поле Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--primary-dark)' }}>
            Email <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => handleBlur('email', e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
            }}
            style={getInputStyle('email', isFieldError('email'))}
          />
          {isFieldError('email') && (
            <p style={{
              color: 'var(--error)',
              fontSize: '12px',
              marginTop: '4px',
              marginBottom: 0
            }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Поле Пароль */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--primary-dark)' }}>
            Пароль <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={(e) => handleBlur('password', e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
            }}
            style={getInputStyle('password', isFieldError('password'))}
          />
          {isFieldError('password') && (
            <p style={{
              color: 'var(--error)',
              fontSize: '12px',
              marginTop: '4px',
              marginBottom: 0
            }}>
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            padding: 'var(--space-3) var(--space-6)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: '16px',
            marginTop: 'var(--space-4)',
            transition: 'background-color 0.2s, opacity 0.2s',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--primary)';
          }}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </AuthCard>
  );
};

export default Login;