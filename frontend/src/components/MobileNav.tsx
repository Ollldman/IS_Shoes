import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdminOrManager } from '../types/user';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const canManage = isAdminOrManager(user);

  const navItems = [
    {
      path: '/dashboard/my-orders',
      icon: '📋',
      label: 'Заказы',
      show: true
    },
    {
      path: '/dashboard/create-order',
      icon: '➕',
      label: 'Создать',
      show: true
    },
    {
      path: '/dashboard/manage-orders',
      icon: '⚙️',
      label: 'Управление',
      show: canManage
    },
    {
      path: '/dashboard/profile',
      icon: '👤',
      label: 'Профиль',
      show: true
    },
    {
      path: '/',
      icon: '🏠',
      label: 'На сайт',
      show: true
    }
  ].filter(item => item.show);

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'var(--card)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 var(--space-2)',
      zIndex: 90,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '12px',
              gap: '4px',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s',
              flex: 1,
              maxWidth: '70px'
            }}
          >
            <span style={{
              fontSize: '24px',
              marginBottom: '2px'
            }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;