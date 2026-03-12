import { useState, useEffect } from 'react';


import { getAllOrders, updateOrderStatus, deleteOrder } from '../../services/orderService';
import { type IOrderAdminResponse } from '../../types/order';
import { OrderStatus, type OrderStatusT, OrderStatusLabels, OrderStatusColors } from '../../types/enums';
import { formatOrderDate, isOrderOverdue } from '../../types/order';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../types/user';
import EditOrderModal from '../../components/EditOrderModal';


type StatusFilter = 'all' | OrderStatusT;

const ManageOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<IOrderAdminResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrderAdminResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<IOrderAdminResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  // Загрузка заказов
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getAllOrders();
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

  const handleEdit = (order: IOrderAdminResponse) => {
  setSelectedOrder(order);
  setIsEditModalOpen(true);
};

  const handleSaveEdit = (updatedOrder: IOrderAdminResponse) => {
    setOrders(prev =>
      prev.map(order => order.id === updatedOrder.id ? updatedOrder : order)
    );
    setIsEditModalOpen(false);
    setSelectedOrder(null);
  };

  // Фильтрация и поиск
  useEffect(() => {
    let filtered = orders;

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Поиск по тексту
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.order_id.toLowerCase().includes(query) ||
        order.shoes_name.toLowerCase().includes(query) ||
        order.client_name.toLowerCase().includes(query) ||
        order.client_surname.toLowerCase().includes(query) ||
        order.client_email.toLowerCase().includes(query) ||
        order.service_type.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchQuery, orders]);

  // Обработчик изменения статуса
  const handleStatusChange = async (orderId: number, newStatus: OrderStatusT) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      // Обновляем локальный список
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
      alert('Не удалось обновить статус заказа');
    }
  };

  // Обработчик удаления (только для админов)
  const handleDelete = async (orderId: number) => {
    if (!isAdmin(user)) {
      alert('Только администратор может удалять заказы');
      return;
    }

    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        await deleteOrder(orderId);
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } catch (err) {
        console.error('Ошибка при удалении заказа:', err);
        alert('Не удалось удалить заказ');
      }
    }
  };

  // Статистика
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
      <h1 style={{
        fontSize: '28px',
        color: 'var(--primary)',
        marginBottom: 'var(--space-6)'
      }}>
        Управление заказами
      </h1>

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

      {/* Фильтры и поиск */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          flex: 1
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

        <input
          type="text"
          placeholder="Поиск по заказам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            fontSize: '14px',
            minWidth: '250px'
          }}
        />
      </div>

      {/* Таблица заказов */}
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
          Заказы не найдены
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflow: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1300px'
          }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--background)',
                borderBottom: '1px solid var(--border)'
              }}>
                <th style={thStyle}>ID заказа</th>
                <th style={thStyle}>Клиент</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Обувь</th>
                <th style={thStyle}>Услуга</th>
                <th style={thStyle}>Дата</th>
                <th style={thStyle}>Статус</th>
                <th style={thStyle}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const overdue = isOrderOverdue(order);
                const statusColor = overdue ? 'var(--error)' : OrderStatusColors[order.status].text;
                const statusBg = overdue ? 'var(--error-bg)' : OrderStatusColors[order.status].bg;

                return (
                  <tr key={order.id} style={{
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: overdue ? 'var(--error-bg)' : 'transparent'
                  }}>
                    <td style={tdStyle}>
                      <strong>#{order.order_id}</strong>
                    </td>
                    <td style={tdStyle}>
                      {order.client_name} {order.client_surname}
                    </td>
                    <td style={tdStyle}>
                      {order.client_email}
                    </td>
                    <td style={tdStyle}>
                      {order.shoes_name}
                    </td>
                    <td style={tdStyle}>
                      {order.service_type}
                    </td>
                    <td style={tdStyle}>
                      <div>Создан: {formatOrderDate(order.date_created)}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        К сроку: {formatOrderDate(order.desired_date)}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: 'var(--space-1) var(--space-3)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: statusBg,
                        color: statusColor,
                        display: 'inline-block'
                      }}>
                        {overdue ? 'Просрочен' : OrderStatusLabels[order.status]}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => handleEdit(order)}
                                style={{
                                    padding: 'var(--space-1) var(--space-2)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--primary)',
                                    backgroundColor: 'transparent',
                                    color: 'var(--primary)',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                                >
                                ✏️ Ред.
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatusT)}
                          style={{
                            padding: 'var(--space-1) var(--space-2)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            fontSize: '12px',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          {Object.values(OrderStatus).map((status) => (
                            <option key={status} value={status}>
                              {OrderStatusLabels[status]}
                            </option>
                          ))}
                        </select>
                        
                        {isAdmin(user) && (
                          <button
                            onClick={() => handleDelete(order.id)}
                            style={{
                              padding: 'var(--space-1) var(--space-2)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--error)',
                              backgroundColor: 'transparent',
                              color: 'var(--error)',
                              fontSize: '12px',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Модальное окно редактирования */}
        <EditOrderModal
        order={selectedOrder}
        isOpen={isEditModalOpen}
        onClose={() => {
            setIsEditModalOpen(false);
            setSelectedOrder(null);
        }}
        onSave={handleSaveEdit}
        />
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

// Стили для таблицы
const thStyle = {
  padding: 'var(--space-3) var(--space-4)',
  textAlign: 'left' as const,
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--primary-dark)',
  borderBottom: '2px solid var(--border)'
};

const tdStyle = {
  padding: 'var(--space-3) var(--space-4)',
  fontSize: '14px',
  color: 'var(--primary-dark)',
  borderBottom: '1px solid var(--border)'
};

export default ManageOrders;