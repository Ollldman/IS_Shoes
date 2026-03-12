import { type OrderStatusT, OrderStatus } from './enums';

/**
 * Интерфейс для создания нового заказа клиентом
 * Соответствует схеме OrderCreate из бэкенда
 */
export interface IOrderCreate {
  /** Название обуви (например, "Nike Air Max") */
  shoes_name: string;
  /** Описание проблемы (опционально) */
  description?: string | null;
  /** Тип услуги (например, "Замена подошвы") */
  service_type: string;
  /** Желаемая дата получения (в формате YYYY-MM-DD) */
  desired_date: string; // В JSON дата приходит как строка
}

/**
 * Интерфейс ответа с данными заказа
 * Соответствует схеме OrderResponse из бэкенда
 */
export interface IOrderResponse {
  /** ID заказа в БД */
  id: number;
  /** Уникальный короткий ID заказа (например, "ORD-A1B2") */
  order_id: string;
  /** Название обуви */
  shoes_name: string;
  /** Описание проблемы */
  description: string | null;
  /** Тип услуги */
  service_type: string;
  /** Желаемая дата получения */
  desired_date: string;
  /** Статус заказа */
  status: OrderStatusT;
  /** Дата создания заказа */
  date_created: string;
}

/**
 * Интерфейс для обновления только статуса заказа
 * Соответствует схеме OrderStatusUpdate из бэкенда
 */
export interface IOrderStatusUpdate {
  /** Новый статус заказа */
  status: OrderStatusT;
}

/**
 * Интерфейс для полного редактирования заказа (менеджером/админом)
 * Соответствует схеме OrderFullUpdate из бэкенда
 * Все поля опциональны - обновляются только переданные
 */
export interface IOrderFullUpdate {
  /** Название обуви */
  shoes_name?: string;
  /** Описание проблемы */
  description?: string | null;
  /** Тип услуги */
  service_type?: string;
  /** Желаемая дата получения */
  desired_date?: string;
  /** Статус заказа */
  status?: OrderStatusT;
}

/**
 * Расширенный интерфейс для админ-панели
 * Соответствует схеме OrderAdminResponse из бэкенда
 * Добавляет данные клиента к информации о заказе
 */
export interface IOrderAdminResponse extends IOrderResponse {
  /** Имя клиента */
  client_name: string;
  /** Фамилия клиента */
  client_surname: string;
  /** Email клиента */
  client_email: string;
}

/**
 * Вспомогательные функции для работы с датами
 */

/**
 * Форматирует дату из API в локальный формат для отображения
 */
export const formatOrderDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Проверяет, просрочен ли заказ (желаемая дата меньше текущей)
 */
export const isOrderOverdue = (order: IOrderResponse): boolean => {
  if (order.status !== OrderStatus.NEW && order.status !== OrderStatus.IN_PROGRESS) {
    return false; // Завершенные заказы не считаем просроченными
  }
  const today = new Date().toISOString().split('T')[0];
  return order.desired_date < today;
};

/**
 * Возвращает CSS класс для карточки заказа на основе статуса и просрочки
 */
export const getOrderCardClass = (order: IOrderResponse): string => {
  if (isOrderOverdue(order)) {
    return 'order-card--overdue';
  }
  return `order-card--${order.status}`;
};