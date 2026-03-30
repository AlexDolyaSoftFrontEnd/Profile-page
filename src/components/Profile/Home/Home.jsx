// Home.jsx
import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

/* ========================================
   LOADER (Прозорий Fallback)
   ======================================== */
const HomeLoader = () => (
  <div className="loader-overlay" role="status" aria-live="polite">
    <div className="loader-content">
      <div className="loader-spinner" aria-hidden="true" />
      <p>Завантаження...</p>
    </div>
  </div>
);

/* ========================================
   ОСНОВНИЙ КОНТЕНТ
   ======================================== */
const HomeContent = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="greeting">Вітаємо!</h1>
      </header>

      <section className="alerts-section">
        <article className="alert-card alert-success">
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <polyline points="9 11 12 14 22 4"/>
            </svg>
          </div>
          <div className="alert-content">
            <p className="alert-text">
              Надсилайте свої публікації з адмінки в мережі.
            </p>
          </div>
          <button className="alert-action" aria-label="Дія">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </button>
        </article>

        <article 
          className="alert-card alert-info" 
          onClick={handleAuthClick}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleAuthClick();
            }
          }}
        >
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="alert-content">
            <p className="alert-text">
              Зайдіть в свій обліковий запис за допомогою автентифікації.
            </p>
          </div>
          <button 
            className="alert-action" 
            aria-label="Перейти до авторизації" 
            onClick={(e) => e.stopPropagation()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </article>
      </section>
    </div>
  );
};

/* ========================================
   LAZY-ЗАВАНТАЖЕННЯ
   ======================================== */
// Демо з затримкою 600мс:
const HomeContentLazy = lazy(() => 
  new Promise((resolve) => {
    setTimeout(() => resolve({ default: HomeContent }), 600);
  })
);

// Продакшен (реальний код-спліттинг):
// const HomeContentLazy = lazy(() => import('./HomeContent'));

/* ========================================
   ЕКСПОРТ
   ======================================== */
const Home = () => (
  <Suspense fallback={<HomeLoader />}>
    <HomeContentLazy />
  </Suspense>
);

export default Home;