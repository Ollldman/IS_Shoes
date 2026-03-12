import { api } from './apiClient';
import { 
   type IOrderCreate, 
   type IOrderResponse, 
   type IOrderStatusUpdate,
   type IOrderFullUpdate,
   type IOrderAdminResponse 
} from '../types/order';

/**
 * Сервис для работы с заказами
 */

// ==================== Пользовательские эндпоинты ====================

/**
 * Создание нового заказа
 * POST /orders/
 */
export const createOrder = async (orderData: IOrderCreate): Promise<IOrderResponse> => {
  return api.post<IOrderResponse>('/orders/', orderData);
};

/**
 * Получение списка своих заказов
 * GET /orders/me
 */
export const getMyOrders = async (): Promise<IOrderResponse[]> => {
  return api.get<IOrderResponse[]>('/orders/me');
};

// ==================== Админские эндпоинты ====================

/**
 * Получение всех заказов (для админа/менеджера)
 * GET /admin/orders/
 */
export const getAllOrders = async (): Promise<IOrderAdminResponse[]> => {
  return api.get<IOrderAdminResponse[]>('/admin/orders/');
};

/**
 * Обновление статуса заказа
 * PATCH /admin/orders/{orderId}/status
 */
export const updateOrderStatus = async (
  orderId: number, 
  statusData: IOrderStatusUpdate
): Promise<IOrderAdminResponse> => {
  return api.patch<IOrderAdminResponse>(`/admin/orders/${orderId}/status`, statusData);
};

/**
 * Полное обновление заказа
 * PUT /admin/orders/{orderId}
 */
export const fullUpdateOrder = async (
  orderId: number,
  updateData: IOrderFullUpdate
): Promise<IOrderAdminResponse> => {
  return api.put<IOrderAdminResponse>(`/admin/orders/${orderId}`, updateData);
};

/**
 * Удаление заказа (только для админа)
 * DELETE /admin/orders/{orderId}
 */
export const deleteOrder = async (orderId: number): Promise<void> => {
  return api.delete<void>(`/admin/orders/${orderId}`);
};

// ==================== Утилиты для работы с заказами ====================

/**
 * Тип для фильтрации заказов по статусу
 */
export type OrderFilter = 'all' | IOrderResponse['status'];

/**
 * Фильтрация заказов по статусу
 */
export const filterOrdersByStatus = (
  orders: IOrderResponse[],
  filter: OrderFilter
): IOrderResponse[] => {
  if (filter === 'all') return orders;
  return orders.filter(order => order.status === filter);
};

/**
 * Сортировка заказов по дате (новые сверху)
 */
export const sortOrdersByDate = (
  orders: IOrderResponse[],
  ascending: boolean = false
): IOrderResponse[] => {
  return [...orders].sort((a, b) => {
    const dateA = new Date(a.date_created).getTime();
    const dateB = new Date(b.date_created).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Группировка заказов по статусу
 */
export const groupOrdersByStatus = (
  orders: IOrderResponse[]
): Record<IOrderResponse['status'], IOrderResponse[]> => {
  return orders.reduce((acc, order) => {
    const status = order.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(order);
    return acc;
  }, {} as Record<IOrderResponse['status'], IOrderResponse[]>);
};

/**
 * Поиск заказов по тексту (в названии обуви или описании)
 */
export const searchOrders = (
  orders: IOrderResponse[],
  searchText: string
): IOrderResponse[] => {
  const query = searchText.toLowerCase().trim();
  if (!query) return orders;
  
  return orders.filter(order => 
    order.shoes_name.toLowerCase().includes(query) ||
    order.description?.toLowerCase().includes(query) ||
    order.order_id.toLowerCase().includes(query)
  );
};