import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loader" role="status" aria-live="polite">
          <div className="loader-spinner" aria-hidden="true" />
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }

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
              Надсилайте публікації з адмін-панелі, використовуючи власний акаунт.
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

        <article className="alert-card alert-info">
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="alert-content">
            <p className="alert-text">
              Захистіть свій обліковий запис за допомогою двофакторної автентифікації.
            </p>
          </div>
          <button className="alert-action" aria-label="Дія">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </article>
      </section>
    </div>
  );
};

export default Home;