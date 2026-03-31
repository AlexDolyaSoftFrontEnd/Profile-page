import React, { Suspense, lazy, useState, useCallback } from 'react';
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
   КОМПОНЕНТ СТАТИСТИКИ
   ======================================== */
const StatsSection = () => {
  const stats = [
    {
      id: 'posts',
      label: 'Публікацій',
      value: '156',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )
    },
    {
      id: 'engagement',
      label: 'Залученість',
      value: '8.4%',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )
    },
    {
      id: 'followers',
      label: 'Підписників',
      value: '12.5K',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      id: 'reach',
      label: 'Охоплення',
      value: '45.2K',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      )
    }
  ];

  return (
    <section className="stats-section" aria-label="Статистика">
      {stats.map((stat) => (
        <article key={stat.id} className="stat-card">
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        </article>
      ))}
    </section>
  );
};

/* ========================================
   КОМПОНЕНТ ВКЛАДОК ТАРИФІВ
   ======================================== */
const TariffTabs = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const navigate = useNavigate();

  const tariffs = {
    basic: {
      id: 'basic',
      name: 'Базовий',
      price: '₴500/міс',
      features: [
        'До 10 публікацій на день',
        'Базова аналітика'
      ],
    },
    pro: {
      id: 'pro',
      name: 'Професійний',
      price: '₴1500/міс',
      features: [
        'Безлімітні публікації',
        'Розширена аналітика'
      ],
    }
  };

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const handleSubscribe = useCallback((planId) => {
    navigate(`/checkout?plan=${planId}`);
  }, [navigate]);

  const handleTabKeyDown = useCallback((e, tabId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabChange(tabId);
    }
  }, [handleTabChange]);

  return (
    <section className="tariffs-section" aria-label="Тарифні плани">
      <div className="tariffs-header">
        <h2 className="tariffs-title">Оберіть свій план</h2>
        <p className="tariffs-subtitle">
          Гнучкі тарифи для ефективного управління вашими мережами
        </p>
      </div>

      <div className="tariff-tabs" role="tablist" aria-label="Вибір тарифного плану">
        {Object.values(tariffs).map((tariff) => (
          <button
            key={tariff.id}
            role="tab"
            aria-selected={activeTab === tariff.id}
            aria-controls={`tariff-panel-${tariff.id}`}
            id={`tariff-tab-${tariff.id}`}
            className={`tariff-tab ${activeTab === tariff.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tariff.id)}
            onKeyDown={(e) => handleTabKeyDown(e, tariff.id)}
          >
            {tariff.name}
          </button>
        ))}
      </div>

      {Object.values(tariffs).map((tariff) => (
        <div
          key={tariff.id}
          role="tabpanel"
          id={`tariff-panel-${tariff.id}`}
          aria-labelledby={`tariff-tab-${tariff.id}`}
          className={`tariff-panel ${activeTab === tariff.id ? 'active' : ''}`}
          hidden={activeTab !== tariff.id}
        >
          <article className="tariff-card">
            <header className="tariff-header">
              <h3 className="tariff-name">{tariff.name}</h3>
              <div className="tariff-price">{tariff.price}</div>
            </header>
            
            <ul className="tariff-features" aria-label="Переваги тарифу">
              {tariff.features.map((feature, index) => (
                <li key={index} className="tariff-feature">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className="tariff-cta"
              onClick={() => handleSubscribe(tariff.id)}
              aria-label={`Підключити тариф ${tariff.name}`}
            >
              Підключити
            </button>
          </article>
        </div>
      ))}
    </section>
  );
};

/* ========================================
   ОСНОВНИЙ КОНТЕНТ
   ======================================== */
const HomeContent = () => {
  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="greeting">Вітаємо!</h1>
        <p className="subtitle">Панель управління соціальними мережами</p>
      </header>

      <StatsSection />
      <TariffTabs />
    </div>
  );
};

/* ========================================
   LAZY-ЗАВАНТАЖЕННЯ
   ======================================== */
const HomeContentLazy = lazy(() => 
  new Promise((resolve) => {
    setTimeout(() => resolve({ default: HomeContent }), 600);
  })
);

/* ========================================
   ЕКСПОРТ
   ======================================== */
const Home = () => (
  <Suspense fallback={<HomeLoader />}>
    <HomeContentLazy />
  </Suspense>
);

export default Home;