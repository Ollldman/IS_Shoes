import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';

import heroDesktop from '../assets/images/hero-bg-desktop.webp'
import heroMobile from '../assets/images/hero-bg-mobile.webp';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleDashboardClick = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const handleContactClick = () => {
    alert('Спасибо за интерес! Мы свяжемся с вами в ближайшее время.');
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero секция с большим адаптивным блоком */}
        <HeroSection 
          onOrderClick={handleDashboardClick}
          onContactClick={handleContactClick}
        />

        {/* Секция с услугами и слайдером */}
        <ServicesSection />

        {/* Секция с отзывами */}
        <ReviewsSection />

        {/* Секция обратной связи */}
        <ContactSection onContactClick={handleContactClick} />
      </main>
      <Footer />
    </>
  );
};

// ==================== Hero секция ====================
const HeroSection = ({ onOrderClick, onContactClick }: { onOrderClick: () => void; onContactClick: () => void }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section style={{
      position: 'relative',
      minHeight: '600px',
      height: '80vh',
      maxHeight: '800px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background)',
      overflow: 'hidden'
    }}>
      {/* Фоновое изображение (временный градиент, потом заменим на картинку) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }}>
        {/* Адаптивное изображение */}
        <picture>
          <source media="(max-width: 767px)" srcSet={heroMobile} />
          <img
            src={heroDesktop}
            alt="Мастерская по ремонту обуви"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </picture>
        
        {/* Затемнение для лучшей читаемости текста */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(74, 59, 52, 0.7) 0%, rgba(184, 92, 58, 0.5) 100%)',
          zIndex: 2
        }} />
      </div>

      {/* Контент */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: 'var(--space-4)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 72px)',
          fontWeight: 700,
          color: '#fff',
          marginBottom: 'var(--space-4)',
          lineHeight: 1.1,
          fontFamily: 'var(--font-display)'
        }}>
          IS SHOES
        </h1>
        
        <p style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          color: '#fff',
          marginBottom: 'var(--space-8)',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Мастерская по ремонту обуви с душой. Возвращаем жизнь вашей любимой обуви с 1995 года.
        </p>

        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onOrderClick}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: 'clamp(16px, 2vw, 18px)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              minWidth: '200px',
              boxShadow: '0 4px 15px rgba(74, 59, 52, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(184, 92, 58, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(74, 59, 52, 0.3)';
            }}
          >
            Оформить заказ
          </button>

          <button
            onClick={onContactClick}
            style={{
              backgroundColor: 'transparent',
              color: '#fff',
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-full)',
              border: '2px solid var(--primary)',
              fontSize: 'clamp(16px, 2vw, 18px)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Связаться с нами
          </button>
        </div>

        {/* Иконки преимуществ */}
        {!isMobile && 
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(var(--space-6), 5vw, var(--space-16))',
          marginTop: 'var(--space-16)',
          flexWrap: 'wrap'
        }}>
          <Benefit icon="⏱️" text="Быстро" subtext="от 2 часов" light={true} />
          <Benefit icon="✨" text="Качественно" subtext="гарантия 1 год" light={true} />
          <Benefit icon="💰" text="Доступно" subtext="цены от 500₽" light={true} />
        </div>
        }
      </div>
      
    </section>
  );
};

// Компонент преимущества
const Benefit = ({ icon, text, subtext, light = false }: { icon: string; text: string; subtext: string; light?: boolean }) => (
  <div style={{
    textAlign: 'center',
    animation: 'fadeInUp 0.6s ease',
    backgroundColor: light ? 'rgba(74, 59, 52, 0.8)' : 'transparent', // Полупрозрачный фон для контраста
    padding: light ? 'var(--space-4) var(--space-6)' : '0',
    borderRadius: light ? 'var(--radius-xl)' : '0',
    backdropFilter: light ? 'blur(5px)' : 'none', // Эффект размытия
    border: light ? '1px solid rgba(255,255,255,0.2)' : 'none',
    minWidth: '150px'
  }}>
    <div style={{
      fontSize: '48px',
      marginBottom: 'var(--space-2)',
      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
    }}>
      {icon}
    </div>
    <div style={{
      fontSize: '18px',
      fontWeight: 700,
      color: light ? '#fff' : 'var(--primary)',
      textShadow: light ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
      marginBottom: '4px'
    }}>
      {text}
    </div>
    <div style={{
      fontSize: '14px',
      fontWeight: 500,
      color: light ? 'rgba(255,255,255,0.95)' : 'var(--text-muted)',
      textShadow: light ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'
    }}>
      {subtext}
    </div>
  </div>
);

// ==================== Секция с услугами и слайдером ====================
const ServicesSection = () => {
  const slides = [
    {
      title: "Замена подошвы",
      description: "Итальянская кожа и резиновая смесь Vibram. Восстановим любую подошву.",
      icon: "👞",
      price: "от 1500₽",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Химчистка обуви",
      description: "Глубокая очистка и кондиционирование материалов. Удаление любых загрязнений.",
      icon: "🧼",
      price: "от 800₽",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Реставрация кожи",
      description: "Восстановление цвета и структуры поврежденной кожи. Маскировка потертостей.",
      icon: "🧴",
      price: "от 1200₽",
      image: "https://images.unsplash.com/photo-1605763240004-7e93b172d754?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Ремонт каблуков",
      description: "Замена набоек и восстановление геометрии каблука. Укрепление шпилек.",
      icon: "👠",
      price: "от 600₽",
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e0605df?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Растяжка обуви",
      description: "Деликатное расширение тесной обуви. Индивидуальный подход к материалу.",
      icon: "🔧",
      price: "от 700₽",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="services" style={{
      padding: 'var(--space-24) 0',
      backgroundColor: 'var(--card)'
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-16)'
        }}>
          <h2 style={{
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--accent)',
            marginBottom: 'var(--space-2)'
          }}>
            Наши услуги
          </h2>
          <h3 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: 'var(--primary)',
            marginBottom: 'var(--space-4)'
          }}>
            Что мы предлагаем
          </h3>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-muted)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Профессиональный ремонт и реставрация обуви любой сложности
          </p>
        </div>

        {/* Слайдер */}
        <div style={{
          position: 'relative',
          maxWidth: '1200px',
          margin: '0 auto',
          overflow: 'hidden',
          borderRadius: 'var(--radius-2xl)'
        }}>
          <div style={{
            display: 'flex',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentSlide * (isMobile ? 100 : 33.333)}%)`
          }}>
            {slides.map((slide, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: isMobile ? '100%' : '33.333%',
                  padding: 'var(--space-2)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{
                  backgroundColor: 'var(--background)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: 'var(--space-6)' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      marginBottom: 'var(--space-3)'
                    }}>
                      <span style={{ fontSize: '32px' }}>{slide.icon}</span>
                      <h4 style={{
                        fontSize: '20px',
                        margin: 0,
                        color: 'var(--primary)'
                      }}>
                        {slide.title}
                      </h4>
                    </div>
                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '14px',
                      marginBottom: 'var(--space-4)',
                      lineHeight: 1.6
                    }}>
                      {slide.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--accent)'
                      }}>
                        {slide.price}
                      </span>
                      <button
                        onClick={() => window.location.href = '/login'}
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: '#fff',
                          padding: 'var(--space-2) var(--space-4)',
                          borderRadius: 'var(--radius-full)',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                      >
                        Заказать
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Кнопки навигации слайдера */}
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
          >
            ›
          </button>

          {/* Индикаторы слайдов */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-4)'
          }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: '40px',
                  height: '4px',
                  borderRadius: '2px',
                  border: 'none',
                  backgroundColor: idx === currentSlide ? 'var(--primary)' : 'var(--border)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== Секция с отзывами ====================
const ReviewsSection = () => {
  const reviews = [
    {
      name: "Анна Петрова",
      avatar: "👩",
      rating: 5,
      text: "Отличная мастерская! Быстро починили мои любимые туфли, как новые стали. Цена приятно удивила.",
      date: "2 дня назад"
    },
    {
      name: "Иван Смирнов",
      avatar: "👨",
      rating: 5,
      text: "Носил ботинки 5 лет, думал уже выкидывать. Ребята сделали невозможное - полностью восстановили!",
      date: "1 неделя назад"
    },
    {
      name: "Елена Козлова",
      avatar: "👩",
      rating: 5,
      text: "Очень вежливый персонал, сделали растяжку сапог за 30 минут. Теперь только сюда!",
      date: "3 дня назад"
    },
    {
      name: "Дмитрий Волков",
      avatar: "👨",
      rating: 4,
      text: "Качественно заменили молнию на куртке. Не ожидал, что обувная мастерская так хорошо с одеждой работает.",
      date: "2 недели назад"
    }
  ];

  return (
    <section id="reviews" style={{
      padding: 'var(--space-24) 0',
      backgroundColor: 'var(--background)'
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-16)'
        }}>
          <h2 style={{
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--accent)',
            marginBottom: 'var(--space-2)'
          }}>
            Отзывы
          </h2>
          <h3 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: 'var(--primary)',
            marginBottom: 'var(--space-4)'
          }}>
            Нам доверяют
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {reviews.map((review, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--card)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                border: '1px solid var(--border)',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-4)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {review.avatar}
                </div>
                <div>
                  <div style={{
                    fontWeight: 600,
                    color: 'var(--primary-dark)'
                  }}>
                    {review.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}>
                    {review.date}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: 'var(--space-3)'
              }}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color: i < review.rating ? 'var(--accent)' : 'var(--border)',
                      fontSize: '16px'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p style={{
                color: 'var(--primary-dark)',
                fontSize: '15px',
                lineHeight: 1.6,
                fontStyle: 'italic'
              }}>
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-12)'
        }}>
          <button
            onClick={() => window.open('https://maps.app.goo.gl/example', '_blank')}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--primary)',
              padding: 'var(--space-3) var(--space-8)',
              borderRadius: 'var(--radius-full)',
              border: '2px solid var(--primary)',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--primary)';
            }}
          >
            Все отзывы на Google Maps
          </button>
        </div>
      </div>
    </section>
  );
};

// ==================== Секция обратной связи ====================
const ContactSection = ({ onContactClick }: { onContactClick: () => void }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Спасибо за обращение, ${name}! Мы перезвоним вам в ближайшее время.`);
    setName('');
    setPhone('');
    setQuestion('');
  };

  return (
    <section id="contact" style={{
      padding: 'var(--space-24) 0',
      backgroundColor: 'var(--card)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container">
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 36px)',
            color: 'var(--primary)',
            marginBottom: 'var(--space-4)'
          }}>
            Остались вопросы?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-8)'
          }}>
            Оставьте заявку и мы свяжемся с вами в ближайшее время
          </p>

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)'
          }}>
            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                fontSize: '16px',
                width: '100%'
              }}
            />
            <input
              type="tel"
              placeholder="Номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                fontSize: '16px',
                width: '100%'
              }}
            />
            <textarea
              placeholder="Ваш вопрос (необязательно)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                fontSize: '16px',
                width: '100%',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#fff',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginTop: 'var(--space-2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
            >
              Отправить заявку
            </button>
          </form>

          <p style={{
            marginTop: 'var(--space-6)',
            fontSize: '14px',
            color: 'var(--text-muted)'
          }}>
            Или позвоните нам напрямую: <a href="tel:+74951234567" style={{ color: 'var(--accent)', fontWeight: 600 }}>+7 (495) 123-45-67</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Landing;