import React, { useState, useEffect } from 'react';
import './News.css';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      const mockData = [
        {
          id: 1,
          title: 'Оновлення системи безпеки',
          description: 'Ми значно покращили захист ваших персональних даних.',
          fullText: 'Команда розробників працювала над оновленням системи безпеки протягом останніх трьох місяців. Тепер підтримується двофакторна автентифікація, біометричний вхід та автоматичне блокування підозрілих дій.',
          author: 'Команда безпеки',
          readTime: '24/7 годин читання'
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setNewsItems(mockData);
      setError(null);
      
      // анімація появи карток по черзі
      mockData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 100);
      });
    } catch (err) {
      setError('Не вдалося завантажити новини. Спробуйте пізніше.');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="news-container" role="region" aria-label="Новини">
        <div className="news-loading" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p>Завантаження новин...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container" role="region" aria-label="Новини">
        <div className="news-error" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error}</p>
          <button onClick={fetchNews} className="retry-btn">Повторити</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-container" role="region" aria-label="Новини">
      <header className="news-header">
        <h1 className="news-title">Новини</h1>
        <p className="news-subtitle">Останні оновлення та анонси</p>
      </header>

      <div className="news-list">
        {newsItems.map((item, index) => {
          const isVisible = visibleCards.includes(index);
          
          return (
            <article
              key={item.id}
              className={`news-card ${isVisible ? 'news-card-visible' : ''}`}
              itemScope
              itemType="https://schema.org/NewsArticle"
            >
              <div className="news-card-content">
                <div className="news-card-meta">
                  <span className="news-card-author">{item.author}</span>
                  <span className="news-card-dot">•</span>
                  <span className="news-card-time">{item.readTime}</span>
                </div>
                
                <h2 className="news-card-title" itemProp="headline">{item.title}</h2>
                <p className="news-card-description" itemProp="description">{item.description}</p>
                <p className="news-card-fulltext">{item.fullText}</p>
                
                <div className="news-card-footer">
                  <button 
                    className="news-card-link"
                    onClick={() => console.log('Read more:', item.id)}
                    aria-label={`Детальніше: ${item.title}`}
                  >
                    Читати далі
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="link-arrow">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="news-card-shadow"></div>
            </article>
          );
        })}
      </div>

      {newsItems.length === 0 && !loading && (
        <div className="news-empty" role="status">
          <p>Новин поки що немає. Загляньте пізніше!</p>
        </div>
      )}
    </div>
  );
};

export default News;