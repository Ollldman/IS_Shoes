import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const navigate = useNavigate();
  const {user, isAuthenticated, logout} = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  }
  const handleDashboardClick = () => {
    navigate('/dashboard');
    setIsMenuOpen(false);
  };

  // Получаем инициалы пользователя для аватара
  const getUserInitials = () => {
    if (!user) return '';
    return `${user.name.charAt(0)}${user.surname.charAt(0)}`.toUpperCase();
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      padding: 'var(--space-4) 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Логотип */}
          <Link to="/" style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '24px',
          color: 'var(--primary)',
          textDecoration: 'none'
        }}>IS SHOES</Link>

        {/* Десктоп навигация */}
        <nav className="md:flex hidden" style={{ gap: 'var(--space-8)' }}>
          <a href="#services" style={{ fontWeight: 500, color: 'var(--primary-dark)' }}>Услуги</a>
          <a href="#about" style={{ fontWeight: 500, color: 'var(--primary-dark)' }}>О нас</a>
          <a href="#contacts" style={{ fontWeight: 500, color: 'var(--primary-dark)' }}>Контакты</a>
        </nav>
        {/* Блок пользователя (десктоп) */}
        <div className="md:flex hidden" style={{ alignItems: 'center', gap: 'var(--space-4)' }}>
          {isAuthenticated ? (
            <>
                            {/* Аватар с инициалами */}
              <button
                onClick={handleDashboardClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {getUserInitials()}
                </div>
                <span style={{
                  color: 'var(--primary-dark)',
                  fontWeight: 500,
                  fontSize: '16px'
                }}>
                  {user?.name} {user?.surname}
                </span>
              </button>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--primary)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 500,
                  fontSize: '14px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--error-bg)';
                  e.currentTarget.style.color = 'var(--error)';
                  e.currentTarget.style.borderColor = 'var(--error)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <Link 
              to="/login"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#fff',
                padding: 'var(--space-2) var(--space-6)',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '16px',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            >
              Войти
            </Link>
          )}
        </div>

        {/* Кнопка бургер (мобильная) */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            fontSize: '24px',
            color: 'var(--primary)',
            padding: 'var(--space-2)',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--card)',
          padding: 'var(--space-6)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
        }}>
          <a 
            href="#services" 
            style={{ padding: 'var(--space-2) 0', fontWeight: 500 }}
            onClick={() => setIsMenuOpen(false)}
          >
            Услуги
          </a>
          <a 
            href="#about" 
            style={{ padding: 'var(--space-2) 0', fontWeight: 500 }}
            onClick={() => setIsMenuOpen(false)}
          >
            О нас
          </a>
          <a 
            href="#contacts" 
            style={{ padding: 'var(--space-2) 0', fontWeight: 500 }}
            onClick={() => setIsMenuOpen(false)}
          >
            Контакты
          </a>
          <hr style={{ borderColor: 'var(--border)', margin: 'var(--space-2) 0' }} />
          
          {isAuthenticated ? (
            <>
              {/* Мобильная версия блока пользователя */}
              <button
                onClick={() => {
                  handleDashboardClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-2)',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {getUserInitials()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
                    {user?.name} {user?.surname}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {user?.email}
                  </div>
                </div>
              </button>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'var(--error-bg)',
                  color: 'var(--error)',
                  padding: 'var(--space-3) var(--space-6)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  border: '1px solid var(--error)',
                  width: '100%',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <Link 
              to="/login"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#fff',
                padding: 'var(--space-3) var(--space-6)',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '16px'
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              Войти
            </Link>
          )}
        </div>
      )}
      </div>
    </header>
  );
};

export default Header;