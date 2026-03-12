import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin, isManager, isClient } from '../../types/user';
import { UserRoleLabels } from '../../types/enums';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const getRoleLabel = () => {
    if (isAdmin(user)) return UserRoleLabels.admin;
    if (isManager(user)) return UserRoleLabels.manager;
    if (isClient(user)) return UserRoleLabels.client;
    return 'Неизвестно';
  };

  const handleEdit = () => {
    // Пока просто заглушка
    setIsEditing(true);
    setTimeout(() => {
      alert('Редактирование профиля будет доступно в следующей версии');
      setIsEditing(false);
    }, 100);
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 style={{
        fontSize: '28px',
        color: 'var(--primary)',
        marginBottom: 'var(--space-6)'
      }}>
        Профиль пользователя
      </h1>

      <div style={{
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        border: '1px solid var(--border)',
        maxWidth: '600px'
      }}>
        {/* Аватар/Иконка пользователя */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '40px',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            {user.name.charAt(0)}{user.surname.charAt(0)}
          </div>
        </div>

        {/* Информация о пользователе */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}>
          {/* Имя и фамилия */}
          <InfoRow
            label="Имя"
            value={`${user.name} ${user.surname}`}
            icon="👤"
          />

          {/* Email */}
          <InfoRow
            label="Email"
            value={user.email}
            icon="📧"
          />

          {/* Телефон */}
          <InfoRow
            label="Телефон"
            value={user.phone}
            icon="📱"
          />

          {/* Роль */}
          <InfoRow
            label="Роль"
            value={getRoleLabel()}
            icon="⚡"
            badge
            badgeColor={
              isAdmin(user) ? 'var(--primary)' :
              isManager(user) ? 'var(--accent)' :
              'var(--text-muted)'
            }
          />

          {/* Client ID (только для клиентов) */}
          {isClient(user) && user.client_id && (
            <InfoRow
              label="ID клиента"
              value={user.client_id}
              icon="🆔"
            />
          )}

          {/* ID пользователя (служебная информация) */}
          <InfoRow
            label="ID в системе"
            value={`#${user.id}`}
            icon="🔢"
            muted
          />
        </div>

        {/* Кнопки действий */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-8)',
          justifyContent: 'flex-end',
          borderTop: '1px solid var(--border)',
          paddingTop: 'var(--space-6)'
        }}>
          <button
            onClick={handleEdit}
            disabled={isEditing}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--primary-dark)',
              fontSize: '16px',
              fontWeight: 500,
              cursor: isEditing ? 'not-allowed' : 'pointer',
              opacity: isEditing ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isEditing) {
                e.currentTarget.style.backgroundColor = 'var(--border)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isEditing) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {isEditing ? 'Загрузка...' : 'Редактировать'}
          </button>

          <button
            onClick={logout}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: 'var(--error)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--error-dark)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--error)';
            }}
          >
            Выйти
          </button>
        </div>

        {/* Заглушка о разработке */}
        <div style={{
          marginTop: 'var(--space-6)',
          padding: 'var(--space-4)',
          backgroundColor: 'var(--background)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '14px'
        }}>
          🔧 Функция редактирования профиля находится в разработке
        </div>
      </div>
    </div>
  );
};

// Компонент для отображения строки информации
const InfoRow = ({ 
  label, 
  value, 
  icon,
  badge = false,
  badgeColor,
  muted = false
}: { 
  label: string; 
  value: string; 
  icon: string;
  badge?: boolean;
  badgeColor?: string;
  muted?: boolean;
}) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: 'var(--space-3)',
    backgroundColor: muted ? 'var(--background)' : 'transparent',
    borderRadius: 'var(--radius-md)',
    borderBottom: muted ? 'none' : '1px solid var(--border)'
  }}>
    <span style={{
      fontSize: '20px',
      marginRight: 'var(--space-3)',
      width: '32px',
      textAlign: 'center'
    }}>
      {icon}
    </span>
    <div style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{
        fontSize: '14px',
        color: 'var(--text-muted)'
      }}>
        {label}:
      </span>
      {badge ? (
        <span style={{
          padding: 'var(--space-1) var(--space-3)',
          borderRadius: 'var(--radius-full)',
          backgroundColor: badgeColor || 'var(--border)',
          color: badgeColor ? '#fff' : 'var(--primary-dark)',
          fontSize: '13px',
          fontWeight: 600
        }}>
          {value}
        </span>
      ) : (
        <span style={{
          fontSize: '16px',
          fontWeight: muted ? 400 : 500,
          color: muted ? 'var(--text-muted)' : 'var(--primary-dark)'
        }}>
          {value}
        </span>
      )}
    </div>
  </div>
);

export default Profile;