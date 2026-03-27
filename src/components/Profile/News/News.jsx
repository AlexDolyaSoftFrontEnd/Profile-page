import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './News.css';

// ============================================
// КОНСТАНТИ ТА КОНФІГУРАЦІЯ ПЛАТФОРМ
// ============================================

/**
 * Об'єкт з налаштуваннями для кожної соціальної платформи
 * @type {Object}
 */
const PLATFORMS = {
  all: {
    id: 'all',
    name: 'Всі мережі',
    icon: '🌐',
    color: '#8a5fe0',
    badgeColor: 'linear-gradient(135deg, #8a5fe0 0%, #6d44b8 100%)'
  },
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

/**
 * Мокові дані для демонстрації (у реальному проекті — запит до API)
 * @type {Array}
 * 
 * 📊 Статистика постів:
 * - Instagram: 6 постів
 * - Facebook: 6 постів  
 * - TikTok: 6 постів
 * - Всього: 18 постів
 */
const MOCK_POSTS = [
  // ============================================
  // INSTAGRAM ПОСТИ (6 одиниць)
  // ============================================
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
  {
    id: 10,
    platform: 'instagram',
    title: 'IGTV: Інтерв\'ю з засновником',
    description: 'Ексклюзивне інтерв\'ю про місію бренду та плани на майбутнє.',
    author: 'PR Team',
    scheduledFor: '18 березня, 12:00',
    status: 'scheduled'
  },
  {
    id: 13,
    platform: 'instagram',
    title: 'Carousel: 5 способів стилізації',
    description: 'Гайд по комбінуванню базових речей з нової колекції.',
    author: 'Style Team',
    scheduledFor: '19 березня, 15:30',
    status: 'draft'
  },
  {
    id: 16,
    platform: 'instagram',
    title: 'Giveaway: Розіграш подарунків',
    description: 'Запустіли конкурс для підписників з цінними призами.',
    author: 'Community Team',
    scheduledFor: '20 березня, 09:00',
    status: 'published'
  },
  
  // ============================================
  // FACEBOOK ПОСТИ (6 одиниць)
  // ============================================
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
  {
    id: 11,
    platform: 'facebook',
    title: 'Live-трансляція: Питання-відповіді',
    description: 'Пряма ефір з експертами компанії для відповідей на запитання.',
    author: 'Support Team',
    scheduledFor: '21 березня, 18:00',
    status: 'scheduled'
  },
  {
    id: 14,
    platform: 'facebook',
    title: 'Стаття: Тренди індустрії 2026',
    description: 'Аналітичний огляд ключових тенденцій ринку цього року.',
    author: 'Analytics Team',
    scheduledFor: '22 березня, 10:00',
    status: 'draft'
  },
  {
    id: 17,
    platform: 'facebook',
    title: 'Подія: Запрошення на конференцію',
    description: 'Реєстрація відкрита на щорічну галузеву конференцію.',
    author: 'Events Team',
    scheduledFor: '23 березня, 14:00',
    status: 'published'
  },
  
  // ============================================
  // TIKTOK ПОСТИ (6 одиниць)
  // ============================================
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
  },
  {
    id: 12,
    platform: 'tiktok',
    title: 'Duet з інфлюенсером',
    description: 'Спільне відео з популярним креатором для розширення охоплення.',
    author: 'Influencer Team',
    scheduledFor: '24 березня, 19:00',
    status: 'scheduled'
  },
  {
    id: 15,
    platform: 'tiktok',
    title: 'Трендовий звук + наш продукт',
    description: 'Адаптували вірусний аудіо-тренд під потреби бренду.',
    author: 'Creative Team',
    scheduledFor: '25 березня, 16:30',
    status: 'draft'
  },
  {
    id: 18,
    platform: 'tiktok',
    title: 'UGC-контент: Відео від користувачів',
    description: 'Зібрали найкращі відео від нашої спільноти в одному ролику.',
    author: 'Community Team',
    scheduledFor: '26 березня, 13:00',
    status: 'published'
  }
];

// ============================================
// CUSTOM HOOK: useNewsPosts
// Відповідає за логіку завантаження та фільтрації постів
// ============================================

/**
 * Хук для управління станом постів
 * @returns {Object} - стан та методи для роботи з постами
 */
const useNewsPosts = () => {
  // Стан для зберігання списку постів
  const [posts, setPosts] = useState([]);
  // Стан завантаження (для показу лоадера)
  const [loading, setLoading] = useState(true);
  // Стан помилки (для обробки невдалих запитів)
  const [error, setError] = useState(null);
  // Стан для поетапного відображення карток (анімація)
  const [visibleCards, setVisibleCards] = useState([]);
  // Активна платформа для фільтрації (за замовчуванням 'all')
  const [activePlatform, setActivePlatform] = useState('all');

  /**
   * Функція завантаження постів (імітація API запиту)
   */
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ⚡ Затримка для імітації мережевого запиту (500мс)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Оновлюємо стан з моковими даними
      setPosts(MOCK_POSTS);
      
      // Скидаємо видимі картки для анімації появи
      setVisibleCards([]);
      
      // Поетапне відображення карток (staggered animation)
      MOCK_POSTS.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 50); // ⚡ Затримка 50мс між картками для швидшого завантаження
      });
      
    } catch (err) {
      // Обробка помилок завантаження
      setError('Не вдалося завантажити пости. Спробуйте пізніше.');
      console.error('Posts fetch error:', err);
    } finally {
      // Вимикаємо лоадер незалежно від результату
      setLoading(false);
    }
  }, []);

  // Ефект для початкового завантаження даних при монтуванні компонента
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /**
   * Мемоізована фільтрація постів за обраною платформою
   * Перераховується тільки при зміні posts або activePlatform
   */
  const filteredPosts = useMemo(() => {
    if (activePlatform === 'all') return posts;
    return posts.filter(post => post.platform === activePlatform);
  }, [posts, activePlatform]);

  /**
   * Ефект для анімації появи карток при зміні фільтра
   * Скидає видимі картки і поступово показує нові
   */
  useEffect(() => {
    setVisibleCards([]);
    filteredPosts.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, index * 50); // ⚡ Прискорено для більшої кількості постів
    });
  }, [activePlatform, filteredPosts.length]);

  /**
   * Callback для зміни активної платформи
   * Використовуємо useCallback для оптимізації ре-рендерів
   */
  const handlePlatformChange = useCallback((platformId) => {
    setActivePlatform(platformId);
  }, []);

  /**
   * Callback для редагування поста
   * @param {number} postId - ID поста для редагування
   */
  const handleEditPost = useCallback((postId) => {
    console.log('Edit post:', postId);
    // Тут має бути логіка відкриття модального вікна або переходу
  }, []);

  // Повертаємо всі необхідні дані та методи для компонента
  return {
    posts,
    loading,
    error,
    activePlatform,
    filteredPosts,
    visibleCards,
    handlePlatformChange,
    handleEditPost,
    fetchPosts // Експортуємо для можливості повторного завантаження
  };
};

// ============================================
// ДОПОМІЖНІ КОМПОНЕНТИ
// ============================================

/**
 * Компонент лоадера з анімованим спінером
 * @returns {JSX.Element}
 */
const LoadingState = () => (
  <div className="news-loading" role="status" aria-live="polite">
    <div className="loading-spinner" aria-hidden="true" />
    <p>Завантаження постів...</p>
  </div>
);

/**
 * Компонент відображення помилки з кнопкою повтору
 * @param {Object} props
 * @param {string} props.error - Текст помилки
 * @param {Function} props.onRetry - Функція для повторної спроби
 * @returns {JSX.Element}
 */
const ErrorState = ({ error, onRetry }) => (
  <div className="news-error" role="alert">
    {/* Іконка помилки */}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <p>{error}</p>
    <button onClick={onRetry} className="retry-btn">Повторити</button>
  </div>
);

/**
 * Компонент пустого стану (коли немає постів для фільтра)
 * @param {Object} props
 * @param {string} props.platformName - Назва платформи для повідомлення
 * @returns {JSX.Element}
 */
const EmptyState = ({ platformName }) => (
  <div className="news-empty" role="status">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
    <p>Постів у {platformName} поки що немає.</p>
    <p className="empty-subtitle">Створіть першу публікацію, щоб розпочати!</p>
  </div>
);

/**
 * Компонент картки поста
 * @param {Object} props
 * @param {Object} props.post - Дані поста
 * @param {boolean} props.isVisible - Чи показувати анімацію появи
 * @param {Object} props.platform - Дані платформи
 * @param {Function} props.onEdit - Callback для редагування
 * @returns {JSX.Element}
 */
const PostCard = ({ post, isVisible, platform, onEdit }) => {
  // Конфігурація бейджів для різних статусів
  const statusConfig = {
    scheduled: { text: 'Заплановано', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.15)' },
    draft: { text: 'Чернетка', color: '#6c757d', bg: 'rgba(108, 117, 125, 0.15)' },
    published: { text: 'Опубліковано', color: '#28a745', bg: 'rgba(40, 167, 69, 0.15)' }
  };
  
  const status = statusConfig[post.status] || statusConfig.draft;

  return (
    <article
      className={`news-card ${isVisible ? 'news-card-visible' : ''}`}
      itemScope
      itemType="https://schema.org/SocialMediaPosting"
      // Додаємо aria-hidden для карток, що ще не видимі (для скрінрідерів)
      aria-hidden={!isVisible}
    >
      <div className="news-card-content">
        {/* Шапка картки: бейдж платформи + статус */}
        <div className="news-card-header">
          <div 
            className="news-card-badge"
            style={{ background: platform.badgeColor }}
            // Додаємо aria-label для доступності
            aria-label={`Платформа: ${platform.name}`}
          >
            <span className="platform-icon" aria-hidden="true">{platform.icon}</span>
            {platform.name}
          </div>
          <span 
            className="status-badge"
            style={{ color: status.color, background: status.bg }}
            aria-label={`Статус: ${status.text}`}
          >
            {status.text}
          </span>
        </div>

        {/* Мета-інформація: автор та дата */}
        <div className="news-card-meta">
          <span className="news-card-author">{post.author}</span>
          <span className="news-card-dot" aria-hidden="true">•</span>
          <time className="news-card-time" dateTime={post.scheduledFor}>
            {post.scheduledFor}
          </time>
        </div>
        
        {/* Заголовок та опис поста з мікророзміткою Schema.org */}
        <h2 className="news-card-title" itemProp="headline">
          {post.title}
        </h2>
        <p className="news-card-description" itemProp="description">
          {post.description}
        </p>
        
        {/* Футер з кнопкою редагування */}
        <div className="news-card-footer">
          <button 
            className="news-card-link"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(post.id);
            }}
            aria-label={`Редагувати пост: ${post.title}`}
          >
            Редагувати
            {/* Іконка стрілки для кнопки */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="link-arrow" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Декоративна тінь під карткою для ефекту глибини */}
      <div className="news-card-shadow" aria-hidden="true" />
    </article>
  );
};

// ============================================
// ОСНОВНИЙ КОМПОНЕНТ: News
// ============================================

/**
 * Головний компонент для відображення та управління публікаціями
 * @returns {JSX.Element}
 */
const News = () => {
  // Отримуємо стан та методи з кастомного хука
  const {
    loading,
    error,
    activePlatform,
    filteredPosts,
    visibleCards,
    handlePlatformChange,
    handleEditPost,
    fetchPosts
  } = useNewsPosts();

  // Отримуємо дані поточної платформи для відображення
  const currentPlatform = PLATFORMS[activePlatform];

  // ============================================
  // РЕНДЕРИНГ СТАНІВ: Loading / Error
  // ============================================

  // Показуємо лоадер під час завантаження даних
  if (loading) {
    return (
      <div className="news-container" role="region" aria-label="Пости">
        <header className="news-header">
          <h1 className="news-title">Публікації</h1>
          <p className="news-subtitle">Керуйте публікаціями в соціальних мережах.</p>
        </header>
        <LoadingState />
      </div>
    );
  }

  // Показуємо екран помилки, якщо завантаження не вдалося
  if (error) {
    return (
      <div className="news-container" role="region" aria-label="Пости">
        <header className="news-header">
          <h1 className="news-title">Публікації</h1>
          <p className="news-subtitle">Керуйте публікаціями в соціальних мережах.</p>
        </header>
        <ErrorState error={error} onRetry={fetchPosts} />
      </div>
    );
  }

  // ============================================
  // ОСНОВНИЙ РЕНДЕРИНГ
  // ============================================

  return (
    <div className="news-container" role="region" aria-label="Пости">
      {/* Заголовок секції */}
      <header className="news-header">
        <h1 className="news-title">Публікації</h1>
        <p className="news-subtitle">Керуйте публікаціями в соціальних мережах.</p>
      </header>

      {/* ============================================
          ТАБИ ПЛАТФОРМ (Всі мережі + окремі)
          ============================================ */}
      <nav className="news-tabs" role="tablist" aria-label="Соціальні мережі">
        {Object.values(PLATFORMS).map((platform) => {
          // Підраховуємо кількість постів для кожної платформи
          const postCount = platform.id === 'all' 
            ? MOCK_POSTS.length 
            : MOCK_POSTS.filter(p => p.platform === platform.id).length;
          
          const isActive = activePlatform === platform.id;
          
          return (
            <button
              key={platform.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${platform.id}-panel`}
              id={`${platform.id}-tab`}
              className={`news-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => handlePlatformChange(platform.id)}
              // CSS змінна для кольору платформи (використовується в CSS)
              style={{ '--platform-color': platform.color }}
            >
              <span className="platform-icon" aria-hidden="true">{platform.icon}</span>
              <span className="platform-name">{platform.name}</span>
              {/* Бейдж з кількістю постів */}
              <span className="tab-count" aria-label={`${postCount} постів`}>
                {postCount}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ============================================
          ПАНЕЛЬ КОНТЕНТУ ДЛЯ АКТИВНОГО ТАБУ
          ============================================ */}
      <section 
        role="tabpanel"
        id={`${activePlatform}-panel`}
        aria-labelledby={`${activePlatform}-tab`}
        className="news-tab-panel"
      >
        <div className="news-list">
          {/* Мапінг відфільтрованих постів у картки */}
          {filteredPosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              isVisible={visibleCards.includes(index)}
              platform={PLATFORMS[post.platform]}
              onEdit={handleEditPost}
            />
          ))}
        </div>

        {/* Показуємо пустий стан, якщо постів немає */}
        {filteredPosts.length === 0 && (
          <EmptyState platformName={currentPlatform.name} />
        )}
      </section>
    </div>
  );
};

export default News;