import React, { useState, useEffect } from 'react';
import './News.css';

const PLATFORMS = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: '#E4405F',
    badgeColor: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    badgeColor: 'linear-gradient(135deg, #1877F2 0%, #42B72A 100%)'
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    badgeColor: 'linear-gradient(135deg, #000000 0%, #69C9D0 100%)'
  }
};

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const [activePlatform, setActivePlatform] = useState('instagram');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const mockData = [
        // Instagram пости
        {
          id: 1,
          platform: 'instagram',
          title: 'Новий продукт у каталозі',
          description: 'Презентували ексклюзивну колекцію весна-літо 2026.',
          author: 'Marketing Team',
          scheduledFor: '15 березня, 14:00',
          status: 'scheduled'
        },
        {
          id: 4,
          platform: 'instagram',
          title: 'Stories: За лаштунками',
          description: 'Показали процес створення контенту для бренду.',
          author: 'Content Team',
          scheduledFor: '16 березня, 10:00',
          status: 'draft'
        },
        {
          id: 7,
          platform: 'instagram',
          title: 'Reels: Тренди весни',
          description: 'Відео-огляд модних тенденцій нового сезону.',
          author: 'Creative Team',
          scheduledFor: '17 березня, 18:00',
          status: 'published'
        },
        
        // Facebook пости
        {
          id: 2,
          platform: 'facebook',
          title: 'Анонс вебінару для клієнтів',
          description: 'Запрошуємо на безкоштовний вебінар з цифрового маркетингу.',
          author: 'Sales Team',
          scheduledFor: '20 березня, 16:00',
          status: 'scheduled'
        },
        {
          id: 5,
          platform: 'facebook',
          title: 'Оновлення політики конфіденційності',
          description: 'Інформуємо про зміни у обробці персональних даних.',
          author: 'Legal Team',
          scheduledFor: '18 березня, 09:00',
          status: 'draft'
        },
        {
          id: 8,
          platform: 'facebook',
          title: 'Відгуки клієнтів: Історія успіху',
          description: 'Поділилися реальним кейсом співпраці з партнером.',
          author: 'PR Team',
          scheduledFor: '19 березня, 12:00',
          status: 'published'
        },
        
        // TikTok пости
        {
          id: 3,
          platform: 'tiktok',
          title: 'Челендж #BrandChallenge',
          description: 'Запустили вірусний челендж для залучення аудиторії.',
          author: 'Viral Team',
          scheduledFor: '21 березня, 20:00',
          status: 'scheduled'
        },
        {
          id: 6,
          platform: 'tiktok',
          title: 'Туторіал: Як використовувати продукт',
          description: 'Коротке відео-інструкція з використанням трендових звуків.',
          author: 'Education Team',
          scheduledFor: '22 березня, 15:00',
          status: 'draft'
        },
        {
          id: 9,
          platform: 'tiktok',
          title: 'Behind the scenes: Офіс',
          description: 'Показали атмосферу в офісі та команду за роботою.',
          author: 'HR Team',
          scheduledFor: '23 березня, 11:00',
          status: 'published'
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(mockData);
      setError(null);
      
      setVisibleCards([]);
      mockData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 100);
      });
    } catch (err) {
      setError('Не вдалося завантажити пости. Спробуйте пізніше.');
      console.error('Posts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => post.platform === activePlatform);

  useEffect(() => {
    setVisibleCards([]);
    filteredPosts.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, index * 100);
    });
  }, [activePlatform, filteredPosts.length]);

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { text: 'Заплановано', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.15)' },
      draft: { text: 'Чернетка', color: '#6c757d', bg: 'rgba(108, 117, 125, 0.15)' },
      published: { text: 'Опубліковано', color: '#28a745', bg: 'rgba(40, 167, 69, 0.15)' }
    };
    return badges[status] || badges.draft;
  };

  if (loading) {
    return (
      <div className="news-container" role="region" aria-label="Пости">
        <div className="news-loading" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true" />
          <p>Завантаження постів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container" role="region" aria-label="Пости">
        <div className="news-error" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>{error}</p>
          <button onClick={fetchPosts} className="retry-btn">Повторити</button>
        </div>
      </div>
    );
  }

  const currentPlatform = PLATFORMS[activePlatform];

  return (
    <div className="news-container" role="region" aria-label="Пости">
      <header className="news-header">
        <h1 className="news-title">Публікації</h1>
        <p className="news-subtitle">Керуйте публікаціями в соціальних мережах.</p>
      </header>

      {/* Platform Tabs */}
      <div className="news-tabs" role="tablist" aria-label="Соціальні мережі">
        {Object.values(PLATFORMS).map((platform) => (
          <button
            key={platform.id}
            role="tab"
            aria-selected={activePlatform === platform.id}
            aria-controls={`${platform.id}-panel`}
            id={`${platform.id}-tab`}
            className={`news-tab-btn ${activePlatform === platform.id ? 'active' : ''}`}
            onClick={() => setActivePlatform(platform.id)}
            style={{ '--platform-color': platform.color }}
          >
            <span className="platform-icon" style={{ color: platform.color }}>{platform.icon}</span>
            <span className="platform-name">{platform.name}</span>
            <span className="tab-count">{posts.filter(p => p.platform === platform.id).length}</span>
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div 
        role="tabpanel"
        id={`${activePlatform}-panel`}
        aria-labelledby={`${activePlatform}-tab`}
        className="news-tab-panel"
      >
        <div className="news-list">
          {filteredPosts.map((post, index) => {
            const isVisible = visibleCards.includes(index);
            const status = getStatusBadge(post.status);
            
            return (
              <article
                key={post.id}
                className={`news-card ${isVisible ? 'news-card-visible' : ''}`}
                itemScope
                itemType="https://schema.org/SocialMediaPosting"
              >
                <div className="news-card-content">
                  {/* Platform Badge + Status */}
                  <div className="news-card-header">
                    <div 
                      className="news-card-badge"
                      style={{ background: currentPlatform.badgeColor }}
                    >
                      <span className="platform-icon">{currentPlatform.icon}</span>
                      {currentPlatform.name}
                    </div>
                    <span 
                      className="status-badge"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {status.text}
                    </span>
                  </div>

                  <div className="news-card-meta">
                    <span className="news-card-author">{post.author}</span>
                    <span className="news-card-dot">•</span>
                    <span className="news-card-time">{post.scheduledFor}</span>
                  </div>
                  
                  <h2 className="news-card-title" itemProp="headline">
                    {post.title}
                  </h2>
                  <p className="news-card-description" itemProp="description">
                    {post.description}
                  </p>
                  
                  <div className="news-card-footer">
                    <button 
                      className="news-card-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit post:', post.id);
                      }}
                      aria-label={`Редагувати пост: ${post.title}`}
                    >
                      Редагувати
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="link-arrow">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="news-card-shadow" />
              </article>
            );
          })}
        </div>

        {filteredPosts.length === 0 && !loading && (
          <div className="news-empty" role="status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p>Постів у {currentPlatform.name} поки що немає.</p>
            <p className="empty-subtitle">Створіть першу публікацію, щоб розпочати!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;