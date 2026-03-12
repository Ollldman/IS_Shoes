import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orderService';
import { type IOrderCreate } from '../../types/order';

// Минимальная валидация
const validateForm = (data: IOrderCreate): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.shoes_name.trim()) {
    errors.shoes_name = 'Название обуви обязательно';
  } else if (data.shoes_name.length < 2) {
    errors.shoes_name = 'Название должно содержать минимум 2 символа';
  }

  if (!data.service_type.trim()) {
    errors.service_type = 'Тип услуги обязателен';
  } else if (data.service_type.length < 2) {
    errors.service_type = 'Тип услуги должен содержать минимум 2 символа';
  }

  if (!data.desired_date) {
    errors.desired_date = 'Желаемая дата обязательна';
  } else {
    const today = new Date().toISOString().split('T')[0];
    if (data.desired_date < today) {
      errors.desired_date = 'Дата не может быть в прошлом';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const CreateOrder = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<IOrderCreate>({
    shoes_name: '',
    service_type: '',
    desired_date: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку поля при изменении
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Валидация
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    
    try {
      await createOrder(formData);
      // Редирект на страницу с заказами
      navigate('/dashboard/my-orders');
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      setErrors({
        form: 'Не удалось создать заказ. Попробуйте позже.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/my-orders');
  };

  // Получаем сегодняшнюю дату для min атрибута
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Заголовок */}
      <h1 style={{
        fontSize: '28px',
        color: 'var(--primary)',
        marginBottom: 'var(--space-6)'
      }}>
        Создание нового заказа
      </h1>

      {/* Форма */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        border: '1px solid var(--border)',
        maxWidth: '600px'
      }}>
        {/* Ошибка формы */}
        {errors.form && (
          <div style={{
            backgroundColor: 'var(--error-bg)',
            color: 'var(--error)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
            border: '1px solid var(--error)'
          }}>
            {errors.form}
          </div>
        )}

        {/* Поле: Название обуви */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--primary-dark)',
            marginBottom: 'var(--space-2)'
          }}>
            Название обуви <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="text"
            name="shoes_name"
            value={formData.shoes_name}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Например: Nike Air Max 90"
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${errors.shoes_name ? 'var(--error)' : 'var(--border)'}`,
              fontSize: '16px',
              transition: 'all 0.2s'
            }}
          />
          {errors.shoes_name && (
            <p style={{
              color: 'var(--error)',
              fontSize: '13px',
              marginTop: 'var(--space-1)'
            }}>
              {errors.shoes_name}
            </p>
          )}
        </div>

        {/* Поле: Тип услуги */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--primary-dark)',
            marginBottom: 'var(--space-2)'
          }}>
            Тип услуги <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <select
            name="service_type"
            value={formData.service_type}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${errors.service_type ? 'var(--error)' : 'var(--border)'}`,
              fontSize: '16px',
              backgroundColor: 'white'
            }}
          >
            <option value="">Выберите услугу</option>
            <option value="Замена подошвы">Замена подошвы</option>
            <option value="Ремонт каблука">Ремонт каблука</option>
            <option value="Химчистка">Химчистка</option>
            <option value="Реставрация кожи">Реставрация кожи</option>
            <option value="Замена молнии">Замена молнии</option>
            <option value="Прошивка">Прошивка</option>
          </select>
          {errors.service_type && (
            <p style={{
              color: 'var(--error)',
              fontSize: '13px',
              marginTop: 'var(--space-1)'
            }}>
              {errors.service_type}
            </p>
          )}
        </div>

        {/* Поле: Желаемая дата */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--primary-dark)',
            marginBottom: 'var(--space-2)'
          }}>
            Желаемая дата получения <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            type="date"
            name="desired_date"
            value={formData.desired_date}
            onChange={handleChange}
            disabled={isLoading}
            min={today}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${errors.desired_date ? 'var(--error)' : 'var(--border)'}`,
              fontSize: '16px'
            }}
          />
          {errors.desired_date && (
            <p style={{
              color: 'var(--error)',
              fontSize: '13px',
              marginTop: 'var(--space-1)'
            }}>
              {errors.desired_date}
            </p>
          )}
        </div>

        {/* Поле: Описание (необязательное) */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--primary-dark)',
            marginBottom: 'var(--space-2)'
          }}>
            Описание проблемы (необязательно)
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Опишите проблему подробнее..."
            rows={4}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: '16px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Кнопки */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--primary-dark)',
              fontSize: '16px',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            Отмена
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
              }
            }}
          >
            {isLoading ? 'Создание...' : 'Создать заказ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;