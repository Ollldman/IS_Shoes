import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdminOrManager } from '../types/user';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const canManage = isAdminOrManager(user);

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose?.();
  };

  const handleLinkClick = () => {
    onClose?.();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-6) 0'
    }}>
      {/* Заголовок */}
      <div style={{
        padding: '0 var(--space-6) var(--space-6)',
        borderBottom: '1px solid var(--border)',
        marginBottom: 'var(--space-4)'
      }}>
        <h2 style={{
          fontSize: '24px',
          color: 'var(--primary)',
          marginBottom: 'var(--space-1)',
          fontFamily: 'var(--font-display)'
        }}>
          IS SHOES
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)'
        }}>
          {user?.name} {user?.surname}
        </p>
      </div>

      {/* Навигация */}
      <nav style={{
        flex: 1,
        padding: '0 var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)'
      }}>
        <Link
          to="/dashboard/my-orders"
          onClick={handleLinkClick}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            color: isActive('/dashboard/my-orders') ? 'var(--primary)' : 'var(--primary-dark)',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isActive('/dashboard/my-orders') ? 'var(--border)' : 'transparent',
            fontWeight: isActive('/dashboard/my-orders') ? 600 : 400,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}
          onMouseEnter={(e) => {
            if (!isActive('/dashboard/my-orders')) {
              e.currentTarget.style.backgroundColor = 'var(--border)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/dashboard/my-orders')) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span style={{ fontSize: '20px' }}>📋</span>
          Мои заказы
        </Link>

        <Link
          to="/dashboard/create-order"
          onClick={handleLinkClick}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            color: isActive('/dashboard/create-order') ? 'var(--primary)' : 'var(--primary-dark)',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isActive('/dashboard/create-order') ? 'var(--border)' : 'transparent',
            fontWeight: isActive('/dashboard/create-order') ? 600 : 400,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}
          onMouseEnter={(e) => {
            if (!isActive('/dashboard/create-order')) {
              e.currentTarget.style.backgroundColor = 'var(--border)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/dashboard/create-order')) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span style={{ fontSize: '20px' }}>➕</span>
          Создать заказ
        </Link>

        {canManage && (
          <Link
            to="/dashboard/manage-orders"
            onClick={handleLinkClick}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              color: isActive('/dashboard/manage-orders') ? 'var(--primary)' : 'var(--primary-dark)',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isActive('/dashboard/manage-orders') ? 'var(--border)' : 'transparent',
              fontWeight: isActive('/dashboard/manage-orders') ? 600 : 400,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/dashboard/manage-orders')) {
                e.currentTarget.style.backgroundColor = 'var(--border)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/dashboard/manage-orders')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>⚙️</span>
            Управление
          </Link>
        )}

        <Link
          to="/dashboard/profile"
          onClick={handleLinkClick}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            color: isActive('/dashboard/profile') ? 'var(--primary)' : 'var(--primary-dark)',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isActive('/dashboard/profile') ? 'var(--border)' : 'transparent',
            fontWeight: isActive('/dashboard/profile') ? 600 : 400,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}
          onMouseEnter={(e) => {
            if (!isActive('/dashboard/profile')) {
              e.currentTarget.style.backgroundColor = 'var(--border)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/dashboard/profile')) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span style={{ fontSize: '20px' }}>👤</span>
          Профиль
        </Link>

        <Link
          to="/"
          onClick={handleLinkClick}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            color: 'var(--primary-dark)',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--border)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span style={{ fontSize: '20px' }}>🏠</span>
          На сайт
        </Link>
      </nav>

      {/* Кнопка выхода */}
      <div style={{
        padding: 'var(--space-6)',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto'
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            backgroundColor: 'transparent',
            color: 'var(--error)',
            border: '1px solid var(--error)',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '14px',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--error-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Sidebar;