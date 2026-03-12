
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--primary)',
      color: '#fff',
      padding: 'var(--space-12) 0 var(--space-8)',
      marginTop: 'auto'
    }}>
      <div className="container">
        {/* Десктопная версия - 3 колонки */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-12)'
        }}>
          {/* Колонка 1: Бренд */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              color: '#fff',
              marginBottom: 'var(--space-4)',
              letterSpacing: '1px'
            }}>
              IS SHOES
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              lineHeight: 1.6,
              maxWidth: '300px'
            }}>
              Мастерская по ремонту обуви с многолетним опытом. 
              Возвращаем жизнь вашей любимой обуви.
            </p>
          </div>

          {/* Колонка 2: Навигация */}
          <div>
            <h4 style={{
              fontSize: '16px',
              color: '#fff',
              marginBottom: 'var(--space-4)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Навигация
            </h4>
            <ul style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}>
              {[
                { label: 'Главная', path: '/' },
                { label: 'Услуги', path: '/#services' },
                { label: 'О нас', path: '/#about' },
                { label: 'Контакты', path: '/#contacts' }
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.path}
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 3: Контакты */}
          <div>
            <h4 style={{
              fontSize: '16px',
              color: '#fff',
              marginBottom: 'var(--space-4)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Контакты
            </h4>
            <ul style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '18px' }}>📍</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                  г. Москва, ул. Тверская, 15
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '18px' }}>📞</span>
                <a
                  href="tel:+74951234567"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  +7 (495) 123-45-67
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '18px' }}>✉️</span>
                <a
                  href="mailto:info@isshoes.ru"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  info@isshoes.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Мобильная версия - вертикальная */}
        <div style={{
          display: 'none',
          flexDirection: 'column',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-12)'
        }} className="mobile-footer">
          {/* Бренд и описание */}
          <div style={{ textAlign: 'center' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              color: '#fff',
              marginBottom: 'var(--space-3)'
            }}>
              IS SHOES
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              lineHeight: 1.6,
              maxWidth: '300px',
              margin: '0 auto'
            }}>
              Мастерская по ремонту обуви с многолетним опытом.
            </p>
          </div>

          {/* Навигация горизонтально */}
          <div>
            <h4 style={{
              fontSize: '16px',
              color: '#fff',
              marginBottom: 'var(--space-4)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Навигация
            </h4>
            <ul style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-4)'
            }}>
              {[
                { label: 'Главная', path: '/' },
                { label: 'Услуги', path: '/#services' },
                { label: 'О нас', path: '/#about' },
                { label: 'Контакты', path: '/#contacts' }
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.path}
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                      transition: 'color 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты с иконками в ряд */}
          <div>
            <h4 style={{
              fontSize: '16px',
              color: '#fff',
              marginBottom: 'var(--space-4)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Контакты
            </h4>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-6)',
              flexWrap: 'wrap'
            }}>
              <a
                href="tel:+74951234567"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              >
                <span style={{ fontSize: '24px' }}>📞</span>
                <span style={{ fontSize: '13px' }}>Позвонить</span>
              </a>
              <a
                href="mailto:info@isshoes.ru"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              >
                <span style={{ fontSize: '24px' }}>✉️</span>
                <span style={{ fontSize: '13px' }}>Email</span>
              </a>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-1)',
                color: 'rgba(255,255,255,0.7)'
              }}>
                <span style={{ fontSize: '24px' }}>📍</span>
                <span style={{ fontSize: '13px' }}>Москва</span>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя полоса с копирайтом */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 'var(--space-6)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '13px'
        }}>
          © {currentYear} IS SHOES. Все права защищены.
        </div>
      </div>

      {/* Стили для адаптива */}
      <style>{`
        @media (max-width: 767px) {
          footer .container > div:first-child {
            display: none !important;
          }
          .mobile-footer {
            display: flex !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;