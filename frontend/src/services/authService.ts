import { api, setAuthToken, removeAuthToken } from './apiClient';
import { type IUserCreate, type IUserResponse, type IToken } from '../types/user';

/**
 * Сервис для работы с аутентификацией
 */

/**
 * Регистрация нового пользователя
 * POST /auth/register
 */
export const register = async (userData: IUserCreate): Promise<IUserResponse> => {
  return api.post<IUserResponse>('/auth/register', userData);
};

/**
 * Вход в систему
 * POST /auth/login
 * 
 * Примечание: бэкенд ожидает form-data с полями username и password
 * (см. OAuth2PasswordRequestForm в auth.py)
 */
export const login = async (email: string, password: string): Promise<IToken> => {
  // Создаем FormData для отправки в формате application/x-www-form-urlencoded
  const formData = new FormData();
  formData.append('username', email); // Бэкенд ожидает поле username, но мы передаем email
  formData.append('password', password);

  const response = await api.post<IToken>('/auth/login', formData, {
    headers: {
      // Не указываем Content-Type - браузер сам установит multipart/form-data с boundary
    },
  });

  // Сохраняем токен в localStorage
  if (response.access_token) {
    setAuthToken(response.access_token);
  }

  return response;
};

/**
 * Выход из системы (очистка локального хранилища)
 */
export const logout = (): void => {
  removeAuthToken();
  // Можно также очистить любые другие данные пользователя
  localStorage.removeItem('user_data');
};

/**
 * Получение профиля текущего пользователя
 * GET /users/me - если есть такой эндпоинт
 * 
 * Примечание: в текущей реализации бэкенда нет отдельного эндпоинта для получения профиля,
 * но мы можем декодировать токен или использовать данные из localStorage
 */
export const getCurrentUser = (): IUserResponse | null => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Сохранение данных пользователя в localStorage
 */
export const setUserData = (user: IUserResponse): void => {
  localStorage.setItem('user_data', JSON.stringify(user));
};
