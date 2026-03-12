import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import AuthCard from '../components/AuthCard';
import { login as loginAPI, setAuthToken } from '../services';
import { useAuth } from '../contexts/AuthContext';


const Login = ( ) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      // Вызываем функцию login из authService
      const tokenResponse = await loginAPI(email, password);
      setAuthToken(tokenResponse.access_token);
      await login(tokenResponse.access_token)
      // Редирект на главную или дашборд
      navigate('/'); 
    } catch (err: any) {
        setError(err.message || 'Ошибка при входе');
        console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  // Функция для перехода на регистрацию через роутер
  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <AuthCard
      title="Вход в личный кабинет"
      alternativeText="Нет аккаунта?"
      alternativeLink="Зарегистрироваться"
      onAlternativeClick={handleRegisterClick}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Блок с ошибкой */}
        {error && (
          <div style={{
            backgroundColor: 'var(--error-bg)',
            color: 'var(--error)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            marginBottom: 'var(--space-2)',
            border: '1px solid var(--error)'
          }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--primary-dark)' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: '16px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--primary-dark)' }}>
            Пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: '16px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
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
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isLoading)
            {e.currentTarget.style.backgroundColor = 'var(--accent)'}
          }}
          onMouseLeave={(e) => {
            if (!isLoading)
            {e.currentTarget.style.backgroundColor = 'var(--primary)'}
          }}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </AuthCard>
  );
};

export default Login;