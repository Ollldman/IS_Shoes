import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      position: 'relative'
    }}>
      {/* Десктоп сайдбар */}
      {!isMobile && (
        <div style={{
          width: '280px',
          backgroundColor: 'var(--card)',
          borderRight: '1px solid var(--border)',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: 'auto',
          zIndex: 90
        }}>
          <Sidebar />
        </div>
      )}
      
      {/* Основной контент */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : '280px',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: isMobile ? '70px' : 0 // Отступ для мобильной навигации
      }}>
        {/* Контент страницы */}
        <div style={{
          padding: isMobile ? 'var(--space-4)' : 'var(--space-8)',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto'
        }}>
          <Outlet />
        </div>
      </div>

      {/* Мобильная нижняя навигация - только для мобильных */}
      {isMobile && <MobileNav />}
    </div>
  );
};

export default DashboardLayout;