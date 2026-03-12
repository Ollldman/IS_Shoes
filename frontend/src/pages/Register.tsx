import React, { useState } from 'react';
import AuthCard from '../components/AuthCard';
import { useNavigate } from 'react-router-dom';
import { register, ApiError } from '../services';
import { type IUserCreate } from '../types/user';

// Простая валидация на клиенте
const validateForm = (data: IUserCreate): string | null => {
  if (data.name.length < 2) return 'Имя должно содержать минимум 2 символа';
  if (data.surname.length < 2) return 'Фамилия должна содержать минимум 2 символа';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) return 'Введите корректный email';
  
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(data.phone)) return 'Введите корректный номер телефона';
  
  if (data.password.length < 8) return 'Пароль должен быть не менее 8 символов';
  
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(data.password)) {
    return 'Пароль должен содержать хотя бы одну букву и одну цифру';
  }
  
  return null;
};

const Register = ( ) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Валидация перед отправкой
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Вызываем функцию register из authService
      const response = await register(formData);
      
      console.log('Registration successful:', response);
      
      // После успешной регистрации перенаправляем на страницу входа
      // или можно сразу залогинить пользователя
      navigate('/login', { 
        state: { message: 'Регистрация успешна! Теперь вы можете войти.' } 
      });
      
    } catch (err) {
      if (err instanceof ApiError) {
        // Обрабатываем ошибку от API
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    padding: 'var(--space-3)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    fontSize: '16px',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    opacity: isLoading ? 0.7 : 1,
    cursor: isLoading ? 'not-allowed' : 'auto'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--primary-dark)',
    marginBottom: 'var(--space-1)'
  };

  return (
    <AuthCard
      title="Регистрация"
      alternativeText="Уже есть аккаунт?"
      alternativeLink="Войти"
      onAlternativeClick={handleLoginClick}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Имя</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Фамилия</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Телефон</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="+7 (999) 999-99-99"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
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
          {isLoading ? 'Регистрация...':'Зарегистрироваться'}
        </button>
      </form>
    </AuthCard>
  );
};

export default Register;