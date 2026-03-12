/**
 * Базовый API клиент для работы с бэкендом
 * Оборачивает fetch и добавляет:
 * - автоматическую подстановку базового URL
 * - авторизацию через JWT токен
 * - обработку ошибок
 * - типизацию запросов и ответов
 */

// Базовый URL API - берем из переменных окружения или используем localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Ключ для хранения токена в localStorage
const TOKEN_STORAGE_KEY = 'auth_token';

/**
 * Типы HTTP методов
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Интерфейс для ошибки API
 */
export interface ApiError {
  /** HTTP статус код */
  status: number;
  /** Сообщение об ошибке */
  message: string;
  /** Детали ошибки (может быть строкой или объектом с деталями валидации) */
  detail?: any;
}

/**
 * Класс ошибки API для использования в компонентах
 */
export class ApiError extends Error {
  status: number;
  detail?: any;

  constructor(status: number, message: string, detail?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

/**
 * Сохраняет токен в localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

/**
 * Удаляет токен из localStorage (при выходе)
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

/**
 * Возвращает текущий токен из localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Проверяет, авторизован ли пользователь
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Основная функция для выполнения API запросов
 * @param method HTTP метод
 * @param url путь к эндпоинту (без базового URL)
 * @param data тело запроса (для POST, PUT, PATCH)
 * @param options дополнительные опции (например, для загрузки файлов)
 */
export async function apiRequest<T = any>(
  method: HttpMethod,
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const fullUrl = `${API_BASE_URL}${url}`;
  
  // Получаем токен из localStorage
  const token = getAuthToken();

  // Формируем заголовки
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Добавляем токен авторизации, если он есть
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Формируем тело запроса
  let body: string | FormData | undefined = undefined;
  if (data) {
    if (data instanceof FormData) {
      body = data;
      // Для FormData удаляем Content-Type, браузер сам установит правильный с boundary
      delete headers['Content-Type'];
    } else {
      body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
      ...options,
    });

    // Парсим ответ
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Если ответ успешный (2xx), возвращаем данные
    if (response.ok) {
      return responseData as T;
    }

    // Обработка ошибок
    let errorMessage = 'Произошла ошибка при запросе';
    
    // Парсим сообщение об ошибке из ответа
    if (typeof responseData === 'string') {
      errorMessage = responseData;
    } else if (responseData?.detail) {
      errorMessage = responseData.detail;
    } else if (responseData?.message) {
      errorMessage = responseData.message;
    }

    // Специальная обработка 401 (Unauthorized) и 403 (Forbidden)
    if (response.status === 401) {
      // Токен истек или недействителен - разлогиниваем пользователя
      removeAuthToken();
      
      // Можно добавить редирект на страницу логина через событие
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      
      errorMessage = 'Сессия истекла. Пожалуйста, войдите снова.';
    } else if (response.status === 403) {
      errorMessage = 'У вас нет прав для выполнения этого действия';
    }

    // Выбрасываем ошибку с деталями
    throw new ApiError(response.status, errorMessage, responseData);
    
  } catch (error) {
    // Если это уже наша ошибка ApiError, пробрасываем её дальше
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Если ошибка сети или другая ошибка
    if (error instanceof Error) {
      throw new ApiError(0, 'Ошибка сети: ' + error.message);
    }
    
    throw new ApiError(0, 'Неизвестная ошибка');
  }
}

/**
 * Удобные обертки для HTTP методов
 */
export const api = {
  get: <T = any>(url: string, options?: RequestInit) => 
    apiRequest<T>('GET', url, undefined, options),
  
  post: <T = any>(url: string, data?: any, options?: RequestInit) => 
    apiRequest<T>('POST', url, data, options),
  
  put: <T = any>(url: string, data?: any, options?: RequestInit) => 
    apiRequest<T>('PUT', url, data, options),
  
  patch: <T = any>(url: string, data?: any, options?: RequestInit) => 
    apiRequest<T>('PATCH', url, data, options),
  
  delete: <T = any>(url: string, options?: RequestInit) => 
    apiRequest<T>('DELETE', url, undefined, options),
};