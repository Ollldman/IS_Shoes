import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
  alternativeText: string;
  alternativeLink: string;
  onAlternativeClick: () => void;
  showBackButton?: boolean;
}

const AuthCard = ({ 
  title, 
  children, 
  alternativeText, 
  alternativeLink,
  onAlternativeClick,
  showBackButton = true
}: AuthCardProps) => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)'
    }}>
      <div style={{
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid var(--border)'
      }}>
        {/* Кнопка назад */}
        {showBackButton && (
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute',
              top: 'var(--space-4)',
              left: 'var(--space-4)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '24px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.2s, color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            aria-label="На главную"
          >
            ←
          </button>
        )}
        <h2 style={{
          fontSize: '28px',
          marginBottom: 'var(--space-6)',
          textAlign: 'center',
          color: 'var(--primary)',
          marginTop: showBackButton ? 'var(--space-4)' : '0'
        }}>
          {title}
        </h2>
        
        {children}
        
        <div style={{
          marginTop: 'var(--space-6)',
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--text-muted)'
        }}>
          <span>{alternativeText} </span>
          <button
            onClick={onAlternativeClick}
            style={{
              color: 'var(--accent)',
              fontWeight: 600,
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {alternativeLink}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;