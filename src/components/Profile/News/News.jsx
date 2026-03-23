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
          description: 'Ми значно покращили захист ваших персональних даних. Тепер ваша інформація захищена за допомогою сучасних алгоритмів шифрування.',
          fullText: 'Наша команда розробників працювала над оновленням системи безпеки протягом останніх трьох місяців. Тепер підтримується двофакторна автентифікація, біометричний вхід та автоматичне блокування підозрілих дій.',
          author: 'Команда безпеки'
        },
        {
          id: 2,
          title: 'Новий інтерфейс профілю',
          description: 'Ознайомтеся з повністю оновленим дизайном особистого кабінету. Ми зробили його швидшим, зручнішим та сучаснішим.',
          fullText: 'Новий інтерфейс розроблено з урахуванням відгуків тисяч користувачів. Ми оптимізували навігацію, додали темну тему, покращили адаптивність для мобільних пристроїв.',
          author: 'Дизайн-команда'
        },
        {
          id: 3,
          title: 'Технічні роботи 25 березня',
          description: 'Заплановано масштабне технічне обслуговування серверів. Можливі короткочасні перерви в роботі сервісу.',
          fullText: 'Ми проведемо планове оновлення інфраструктури для покращення стабільності та швидкості роботи. Роботи заплановано на нічний час з 02:00 до 04:00.',
          author: 'Технічна підтримка'
        },
        {
          id: 4,
          title: 'Запуск мобільного додатку',
          description: 'Тепер наш сервіс доступний у зручному мобільному додатку для iOS та Android. Завантажуйте та користуйтеся!',
          fullText: 'Ми раді повідомити про запуск офіційного мобільного додатку. Завантажуйте в App Store або Google Play. Додаток підтримує всі основні функції веб-версії.',
          author: 'Мобільна команда'
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setNewsItems(mockData);
      setError(null);
      
      // Анімація появи карток по черзі
      mockData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 150);
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

      <div className="news-stack">
        {newsItems.map((item, index) => {
          const position = newsItems.length - index;
          const offset = (position - 1) * 10;
          const scale = 1 - (position - 1) * 0.025;
          const opacity = position === 1 ? 1 : 1 - (position - 1) * 0.08;
          const isVisible = visibleCards.includes(index);
          
          return (
            <article
              key={item.id}
              className={`news-card ${isVisible ? 'news-card-visible' : ''}`}
              style={{
                zIndex: position,
                '--offset': `${offset}px`,
                '--scale': scale,
                '--opacity': opacity
              }}
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
              <div className="news-card-glow"></div>
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