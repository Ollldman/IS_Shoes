import { useState, useEffect } from 'react';
import { type IOrderAdminResponse, type IOrderFullUpdate } from '../types/order';
import { OrderStatus, OrderStatusLabels } from '../types/enums';
import { fullUpdateOrder } from '../services/orderService';

interface EditOrderModalProps {
  order: IOrderAdminResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedOrder: IOrderAdminResponse) => void;
}

const EditOrderModal = ({ order, isOpen, onClose, onSave }: EditOrderModalProps) => {
  const [formData, setFormData] = useState<IOrderFullUpdate>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Заполняем форму данными при открытии
  useEffect(() => {
    if (order) {
      setFormData({
        shoes_name: order.shoes_name,
        description: order.description,
        service_type: order.service_type,
        desired_date: order.desired_date,
        status: order.status
      });
    }
  }, [order]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при изменении
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.shoes_name?.trim()) {
      newErrors.shoes_name = 'Название обуви обязательно';
    }

    if (!formData.service_type?.trim()) {
      newErrors.service_type = 'Тип услуги обязателен';
    }

    if (!formData.desired_date) {
      newErrors.desired_date = 'Желаемая дата обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order) return;
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const updatedOrder = await fullUpdateOrder(order.id, formData);
      onSave(updatedOrder);
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении заказа:', error);
      setErrors({ form: 'Не удалось обновить заказ' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--space-4)'
    }}>
      <div style={{
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        {/* Заголовок */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: 'var(--primary)',
            margin: 0
          }}>
            Редактирование заказа #{order.order_id}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            ✕
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit}>
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

          {/* Информация о клиенте (только для чтения) */}
          <div style={{
            backgroundColor: 'var(--background)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)'
          }}>
            <h3 style={{
              fontSize: '16px',
              color: 'var(--primary)',
              marginBottom: 'var(--space-3)'
            }}>
              Информация о клиенте
            </h3>
            <p style={{ fontSize: '14px', marginBottom: 'var(--space-1)' }}>
              <strong>Имя:</strong> {order.client_name} {order.client_surname}
            </p>
            <p style={{ fontSize: '14px' }}>
              <strong>Email:</strong> {order.client_email}
            </p>
          </div>

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
              value={formData.shoes_name || ''}
              onChange={handleChange}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${errors.shoes_name ? 'var(--error)' : 'var(--border)'}`,
                fontSize: '16px'
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
              value={formData.service_type || ''}
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
              value={formData.desired_date || ''}
              onChange={handleChange}
              disabled={isLoading}
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

          {/* Поле: Статус */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--primary-dark)',
              marginBottom: 'var(--space-2)'
            }}>
              Статус заказа <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <select
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
            >
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {OrderStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          {/* Поле: Описание */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--primary-dark)',
              marginBottom: 'var(--space-2)'
            }}>
              Описание проблемы
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              disabled={isLoading}
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
            justifyContent: 'flex-end',
            borderTop: '1px solid var(--border)',
            paddingTop: 'var(--space-6)'
          }}>
            <button
              type="button"
              onClick={onClose}
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
                opacity: isLoading ? 0.5 : 1
              }}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;