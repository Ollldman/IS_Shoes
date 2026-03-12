import { type UserRoleT, UserRole } from './enums';

/**
 * Интерфейс для регистрации нового пользователя
 * Соответствует схеме UserCreate из бэкенда
 */
export interface IUserCreate {
  /** Имя (мин. 2 символа, только буквы, пробелы и дефисы) */
  name: string;
  /** Фамилия (мин. 2 символа, только буквы, пробелы и дефисы) */
  surname: string;
  /** Email (уникальный, валидный формат) */
  email: string;
  /** Телефон (мин. 10 цифр, допускает +, пробелы, скобки, дефисы) */
  phone: string;
  /** Пароль (мин. 8 символов, хотя бы одна буква и одна цифра) */
  password: string;
}

/**
 * Интерфейс для входа в систему
 * Соответствует схеме UserLogin из бэкенда
 */
export interface IUserLogin {
  /** Email пользователя */
  email: string;
  /** Пароль */
  password: string;
}

/**
 * Интерфейс ответа с данными пользователя (без пароля)
 * Соответствует схеме UserResponse из бэкенда
 * */
export interface IUserResponseRaw {
  /** ID пользователя в БД */
  id: number;
  /** Имя */
  name: string;
  /** Фамилия */
  surname: string;
  /** Email */
  email: string;
  /** Телефон */
  phone: string;
  /** Уникальный ID клиента (только для роли client) */
  client_id: string | null;
  /** ID роли */
  role_id: number;
  /** Название роли (можем добавить через join на бэке или вычислить на фронте) */
}

export interface IUserResponse extends IUserResponseRaw{
  role: UserRoleT;
}

// Функция для преобразования ролей при получении ответа с бэка:
export const enrichUserWithRole = (rawUser: IUserResponseRaw): IUserResponse => {
  let role: UserRoleT = 'client'

  if (rawUser.role_id === 1){
    role = 'admin';
  } else if (rawUser.role_id === 2){
    role = 'manager';
  } else if (rawUser.role_id === 3) {
    role = 'client';
  }

  return { ...rawUser, role};
};

/**
 * Интерфейс токена авторизации
 * Соответствует схеме Token из бэкенда
 */
export interface IToken {
  /** JWT токен доступа */
  access_token: string;
  /** Тип токена (обычно "bearer") */
  token_type: string;
}


/**
 * Вспомогательные типы для работы с ролями
 */

/**
 * Проверка, является ли пользователь администратором
 */
export const isAdmin = (user: IUserResponse | null): boolean => {
  return user?.role === UserRole.ADMIN;
};

/**
 * Проверка, является ли пользователь менеджером
 */
export const isManager = (user: IUserResponse | null): boolean => {
  return user?.role === UserRole.MANAGER;
};

/**
 * Проверка, является ли пользователь клиентом
 */
export const isClient = (user: IUserResponse | null): boolean => {
  return user?.role === UserRole.CLIENT;
};

/**
 * Проверка, имеет ли пользователь права администратора или менеджера
 * (для доступа к админ-панели)
 */
export const isAdminOrManager = (user: IUserResponse | null): boolean => {
  return isAdmin(user) || isManager(user);
};