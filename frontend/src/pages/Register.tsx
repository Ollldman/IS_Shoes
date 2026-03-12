import React, { useState } from 'react';
import AuthCard from '../components/AuthCard';
import { useNavigate } from 'react-router-dom';
import { register, ApiError } from '../services';
import { type IUserCreate } from '../types/user';

// Регулярные выражения из бэкенда
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{10,}$/;
const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

interface FieldErrors {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  password?: string;
  form?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IUserCreate>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку поля при изменении
    if (errors[name as keyof FieldErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FieldErrors];
        return newErrors;
      });
    }
  };

  // Валидация имени/фамилии
  const validateName = (value: string, fieldName: 'name' | 'surname'): string | undefined => {
    if (!value) return `${fieldName === 'name' ? 'Имя' : 'Фамилия'} обязательно`;
    if (!NAME_REGEX.test(value)) return `${fieldName === 'name' ? 'Имя' : 'Фамилия'} должно содержать только буквы, пробелы или дефисы (мин. 2 символа)`;
    return undefined;
  };

  // Валидация email
  const validateEmail = (value: string): string | undefined => {
    if (!value) return 'Email обязателен';
    if (!EMAIL_REGEX.test(value)) return 'Введите корректный email';
    return undefined;
  };

  // Валидация телефона
  const validatePhone = (value: string): string | undefined => {
    if (!value) return 'Телефон обязателен';
    if (!PHONE_REGEX.test(value)) return 'Введите корректный номер телефона (минимум 10 цифр)';
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
  const handleBlur = (field: keyof FieldErrors, value: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
    
    let error: string | undefined;
    if (field === 'name' || field === 'surname') error = validateName(value, field);
    if (field === 'email') error = validateEmail(value);
    if (field === 'phone') error = validatePhone(value);
    if (field === 'password') error = validatePassword(value);
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Валидация всей формы
  const validateForm = (): boolean => {
    const nameError = validateName(formData.name, 'name');
    const surnameError = validateName(formData.surname, 'surname');
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);
    
    const newErrors: FieldErrors = {};
    if (nameError) newErrors.name = nameError;
    if (surnameError) newErrors.surname = surnameError;
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phone = phoneError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    
    // Помечаем все поля как "тронутые"
    setTouchedFields(new Set(['name', 'surname', 'email', 'phone', 'password']));
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const response = await register(formData);
      console.log('Registration successful:', response);
      
      navigate('/login', { 
        state: { message: 'Регистрация успешна! Теперь вы можете войти.' } 
      });
      
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ form: err.message });
      } else {
        setErrors({ form: 'Произошла неизвестная ошибка' });
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Стили для поля с ошибкой
  const getInputStyle = (fieldName: string, hasError: boolean) => ({
    padding: 'var(--space-3)',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${hasError ? 'var(--error)' : 'var(--border)'}`,
    fontSize: '16px',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    opacity: isLoading ? 0.7 : 1,
    cursor: isLoading ? 'not-allowed' : 'auto',
    backgroundColor: hasError ? 'var(--error-bg)' : 'white',
    outline: 'none'
  });

  const isFieldError = (fieldName: keyof FieldErrors): boolean => {
    return touchedFields.has(fieldName) && !!errors[fieldName];
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

        {/* Поля Имя и Фамилия */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          {/* Имя */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label style={labelStyle}>
              Имя <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={(e) => handleBlur('name', e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
              }}
              disabled={isLoading}
              style={getInputStyle('name', isFieldError('name'))}
            />
            {isFieldError('name') && (
              <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '2px' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Фамилия */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label style={labelStyle}>
              Фамилия <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              onBlur={(e) => handleBlur('surname', e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
              }}
              disabled={isLoading}
              style={getInputStyle('surname', isFieldError('surname'))}
            />
            {isFieldError('surname') && (
              <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '2px' }}>
                {errors.surname}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={labelStyle}>
            Email <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={(e) => handleBlur('email', e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
            }}
            disabled={isLoading}
            style={getInputStyle('email', isFieldError('email'))}
          />
          {isFieldError('email') && (
            <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '2px' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Телефон */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={labelStyle}>
            Телефон <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={(e) => handleBlur('phone', e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
            }}
            disabled={isLoading}
            placeholder="+7 (999) 999-99-99"
            style={getInputStyle('phone', isFieldError('phone'))}
          />
          {isFieldError('phone') && (
            <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '2px' }}>
              {errors.phone}
            </p>
          )}
        </div>

        {/* Пароль */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={labelStyle}>
            Пароль <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={(e) => handleBlur('password', e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(74, 59, 52, 0.1)';
            }}
            disabled={isLoading}
            style={getInputStyle('password', isFieldError('password'))}
          />
          {isFieldError('password') && (
            <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '2px' }}>
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
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </AuthCard>
  );
};

export default Register;