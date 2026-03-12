import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../services/orderService';
import { type IOrderResponse } from '../../types/order';
import { OrderStatus, OrderStatusLabels, OrderStatusColors } from '../../types/enums';
import { formatOrderDate, isOrderOverdue } from '../../types/order';

type StatusFilter = 'all' | IOrderResponse['status'];

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Загрузка заказов
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getMyOrders();
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        setError('Не удалось загрузить заказы');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Фильтрация при изменении статуса
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const handleCreateOrder = () => {
    navigate('/dashboard/create-order');
  };

  // Статистика по заказам
  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === OrderStatus.NEW).length,
    inProgress: orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length,
    done: orders.filter(o => o.status === OrderStatus.DONE).length,
    cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div>
      {/* Заголовок и кнопка создания */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap',
        gap: 'var(--space-4)'
      }}>
        <h1 style={{
          fontSize: '28px',
          color: 'var(--primary)',
          margin: 0
        }}>
          Мои заказы
        </h1>
        
        <button
          onClick={handleCreateOrder}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            padding: 'var(--space-2) var(--space-6)',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
        >
          + Создать заказ
        </button>
      </div>

      {/* Статистика */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)'
      }}>
        <StatCard label="Всего" value={stats.total} color="var(--primary)" />
        <StatCard label="Новые" value={stats.new} color={OrderStatusColors[OrderStatus.NEW].text} />
        <StatCard label="В работе" value={stats.inProgress} color={OrderStatusColors[OrderStatus.IN_PROGRESS].text} />
        <StatCard label="Готово" value={stats.done} color={OrderStatusColors[OrderStatus.DONE].text} />
      </div>

      {/* Фильтр по статусу */}
      <div style={{
        marginBottom: 'var(--space-6)',
        display: 'flex',
        gap: 'var(--space-2)',
        flexWrap: 'wrap'
      }}>
        <FilterButton
          label="Все"
          active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        />
        {Object.values(OrderStatus).map((status) => (
          <FilterButton
            key={status}
            label={OrderStatusLabels[status]}
            active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
            color={OrderStatusColors[status].text}
          />
        ))}
      </div>

      {/* Список заказов */}
      {error ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-8)',
          color: 'var(--error)',
          backgroundColor: 'var(--error-bg)',
          borderRadius: 'var(--radius-lg)'
        }}>
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-8)',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border)'
        }}>
          {statusFilter === 'all' 
            ? 'У вас пока нет заказов. Создайте первый заказ!'
            : `Нет заказов со статусом "${OrderStatusLabels[statusFilter as keyof typeof OrderStatusLabels]}"`}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

// Компонент карточки статистики
const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div style={{
    backgroundColor: 'var(--card)',
    padding: 'var(--space-4)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    textAlign: 'center'
  }}>
    <div style={{
      fontSize: '24px',
      fontWeight: 700,
      color: color,
      marginBottom: 'var(--space-1)'
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '14px',
      color: 'var(--text-muted)'
    }}>
      {label}
    </div>
  </div>
);

// Компонент кнопки фильтра
const FilterButton = ({ 
  label, 
  active, 
  onClick,
  color 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
  color?: string;
}) => (
  <button
    onClick={onClick}
    style={{
      padding: 'var(--space-2) var(--space-4)',
      borderRadius: 'var(--radius-full)',
      border: active ? 'none' : '1px solid var(--border)',
      backgroundColor: active ? 'var(--primary)' : 'transparent',
      color: active ? '#fff' : color || 'var(--primary-dark)',
      fontSize: '14px',
      fontWeight: active ? 600 : 400,
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
  >
    {label}
  </button>
);

// Компонент карточки заказа
const OrderCard = ({ order }: { order: IOrderResponse }) => {
  const overdue = isOrderOverdue(order);
  const statusColor = overdue ? 'var(--error)' : OrderStatusColors[order.status].text;
  const statusBg = overdue ? 'var(--error-bg)' : OrderStatusColors[order.status].bg;

  return (
    <div style={{
      backgroundColor: 'var(--card)',
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${overdue ? 'var(--error)' : 'var(--border)'}`,
      padding: 'var(--space-4)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Номер заказа и статус */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: 'var(--space-3)'
      }}>
        <span style={{
          fontSize: '14px',
          color: 'var(--text-muted)'
        }}>
          #{order.order_id}
        </span>
        <span style={{
          padding: 'var(--space-1) var(--space-3)',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          fontWeight: 600,
          backgroundColor: statusBg,
          color: statusColor
        }}>
          {overdue ? 'Просрочен' : OrderStatusLabels[order.status]}
        </span>
      </div>

      {/* Название обуви */}
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--primary-dark)',
        marginBottom: 'var(--space-2)'
      }}>
        {order.shoes_name}
      </h3>

      {/* Тип услуги */}
      <p style={{
        fontSize: '14px',
        color: 'var(--text-muted)',
        marginBottom: 'var(--space-3)'
      }}>
        {order.service_type}
      </p>

      {/* Детали */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        fontSize: '13px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span>📅 Создан:</span>
          <span>{formatOrderDate(order.date_created)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span>⏰ К сроку:</span>
          <span style={{
            color: overdue ? 'var(--error)' : 'inherit',
            fontWeight: overdue ? 600 : 400
          }}>
            {formatOrderDate(order.desired_date)}
          </span>
        </div>
        {order.description && (
          <div style={{
            marginTop: 'var(--space-2)',
            padding: 'var(--space-2)',
            backgroundColor: 'var(--background)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: 'var(--primary-dark)'
          }}>
            📝 {order.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;