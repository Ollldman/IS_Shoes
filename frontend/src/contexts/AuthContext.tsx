import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  removeAuthToken, 
  isAuthenticated as checkAuth,
  setUserData as saveUserData,
  api 
} from '../services/';
import { type IUserResponse, type IUserResponseRaw, enrichUserWithRole} from '../types/user';

interface AuthContextType {
  user: IUserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  setUser: (user: IUserResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Функция для получения данных пользователя с бэкенда
  const fetchCurrentUser = async (): Promise<IUserResponse | null> => {
    try {
      const rawUser = await api.get<IUserResponseRaw>('/users/me');
      const enrichedUser = enrichUserWithRole(rawUser);
      return enrichedUser;
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
      return null;
    }
  };

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const loadUser = async () => {
        const startTime = Date.now();
      try {
        // Проверяем, есть ли токен
        if (checkAuth()) {
            const userData = await fetchCurrentUser();
            if (userData) {
                setUser(userData);
                saveUserData(userData);
            }
            else {
                // Если не получили данные, но токен есть - токен невалидный
                removeAuthToken();
            }
        }
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
        // Если ошибка - разлогиниваем
        removeAuthToken();
      } finally {
        // Гарантируем показ спиннера минимум 300мс
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 300 - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    };

    loadUser();

    // Слушаем событие разлогина из apiClient
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async () => {
    try {
      // Получаем полные данные пользователя с бэкенда
      const userData = await fetchCurrentUser();
      
      if (userData) {
        setUser(userData);
        saveUserData(userData);
      } else {
        // Если не удалось получить данные - разлогиниваем
        removeAuthToken();
        throw new Error('Не удалось получить данные пользователя');
      }
    } catch (error) {
      console.error('Ошибка при логине:', error);
      removeAuthToken();
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};