import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin, isManager } from '../types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'manager' | 'client'>; 
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Пока проверяем авторизацию - ничего не рендерим
  if (isLoading) {
    return null;
  }

  // Если не авторизован - редирект на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если указаны разрешенные роли и у пользователя нет нужной роли
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Или на страницу "Нет доступа"
  }
  // Проверка на админа или менеджера
  if (allowedRoles && user) {
    if (allowedRoles.includes('admin') && !isAdmin(user)) {
      return <Navigate to="/" replace />;
    }
    if (allowedRoles.includes('manager') && !isManager(user) && !isAdmin(user)) {
      return <Navigate to="/" replace />;
    }
  }
  // Если всё ок - рендерим защищенный компонент
  return <>{children}</>;
};

export default ProtectedRoute;