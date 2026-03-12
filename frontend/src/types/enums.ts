/**
 * Статусы заказов - должны строго соответствовать enum в бэкенде
 * backend/app/models/order.py: OrderStatus
 */
export const OrderStatus = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CANCELLED: 'cancelled'
} as const;
export type OrderStatusT = typeof OrderStatus[keyof typeof OrderStatus];
/**
 * Человекочитаемые названия статусов для отображения в UI
 */
export const OrderStatusLabels: Record<OrderStatusT, string> = {
  [OrderStatus.NEW]: 'Новый',
  [OrderStatus.IN_PROGRESS]: 'В работе',
  [OrderStatus.DONE]: 'Готов',
  [OrderStatus.CANCELLED]: 'Отменён'
};

/**
 * Цвета статусов для визуального отображения
 * Используем цвета из дизайн-токенов
 */
export const OrderStatusColors: Record<OrderStatusT, { bg: string; text: string }> = {
  [OrderStatus.NEW]: { bg: 'var(--warning-bg)', text: 'var(--warning)' },
  [OrderStatus.IN_PROGRESS]: { bg: '#E1F0E7', text: 'var(--success)' },
  [OrderStatus.DONE]: { bg: 'var(--success-bg)', text: 'var(--success)' },
  [OrderStatus.CANCELLED]: { bg: 'var(--error-bg)', text: 'var(--error)' }
};

/**
 * Тип для ролей пользователей
 * Значения должны соответствовать записям в таблице roles
 */
export const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CLIENT: 'client'
} as const;
export type UserRoleT = typeof UserRole[keyof typeof UserRole];
/**
 * Человекочитаемые названия ролей
 */
export const UserRoleLabels: Record<UserRoleT, string> = {
  [UserRole.ADMIN]: 'Администратор',
  [UserRole.MANAGER]: 'Менеджер',
  [UserRole.CLIENT]: 'Клиент'
};