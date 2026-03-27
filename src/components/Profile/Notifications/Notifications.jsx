import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Notifications.css';

// ============================================
// CUSTOM HOOK: useNotifications
// Відповідає за логіку завантаження та фільтрації сповіщень
// ============================================

/**
 * Хук для управління станом сповіщень
 * @returns {Object} - стан та методи для роботи зі сповіщеннями
 */
const useNotifications = () => {
  // Стан для зберігання списку сповіщень
  const [notifications, setNotifications] = useState([]);
  // Стан завантаження (для показу лоадера)
  const [loading, setLoading] = useState(true);
  // Стан активного фільтра
  const [filter, setFilter] = useState('all');

  // Імітація запиту до API
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      
      // ⚡ Затримка для імітації мережевого запиту (600мс для швидкого відгуку)
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Мокові дані сповіщень
      setNotifications([
        {
          id: 1,
          type: 'success',
          title: 'Профіль оновлено',
          message: 'Ваші особисті дані успішно збережено',
          date: '2024-03-15T10:30:00',
          read: false
        },
        {
          id: 2,
          type: 'info',
          title: 'Новий роботодавець',
          message: 'Компанія "TechCorp" переглянула ваше резюме',
          date: '2024-03-14T15:45:00',
          read: false
        },
        {
          id: 3,
          type: 'warning',
          title: 'Застарілий пароль',
          message: 'Рекомендуємо змінити пароль для безпеки',
          date: '2024-03-10T09:15:00',
          read: true
        }
      ]);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  /**
   * Мемоізована фільтрація сповіщень за обраним фільтром
   * Перераховується тільки при зміні notifications або filter
   */
  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter(n => !n.read);
    if (filter === 'read') return notifications.filter(n => n.read);
    return notifications;
  }, [notifications, filter]);

  /**
   * Мемоізований підрахунок непрочитаних сповіщень
   */
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length
  , [notifications]);

  /**
   * Callback для позначення сповіщення як прочитане
   * @param {number} id - ID сповіщення
   */
  const handleMarkAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  /**
   * Callback для видалення сповіщення
   * @param {number} id - ID сповіщення
   */
  const handleDismiss = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Callback для позначення всіх сповіщень як прочитані
   */
  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  /**
   * Callback для очищення всіх сповіщень
   */
  const handleClearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Повертаємо всі необхідні дані та методи
  return {
    notifications,
    loading,
    filter,
    setFilter,
    filteredNotifications,
    unreadCount,
    handleMarkAsRead,
    handleDismiss,
    handleMarkAllAsRead,
    handleClearAll
  };
};

// ============================================
// ДОПОМІЖНІ КОМПОНЕНТИ
// ============================================

/**
 * Компонент лоадера з анімованим спінером
 * @returns {JSX.Element}
 */
const LoadingSpinner = () => (
  <div className="loading-container" role="status" aria-label="Завантаження">
    <div className="spinner" aria-hidden="true"></div>
    <p className="loading-text">Завантаження сповіщень...</p>
  </div>
);

/**
 * Компонент скелетона для імітації завантаження контенту
 * @returns {JSX.Element}
 */
const SkeletonLoader = () => (
  <div className="skeleton-list">
    {[1, 2, 3].map(i => (
      <div key={i} className="skeleton-item">
        <div className="skeleton-icon"></div>
        <div className="skeleton-content">
          <div className="skeleton-line short"></div>
          <div className="skeleton-line long"></div>
          <div className="skeleton-line medium"></div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Компонент пустого стану (коли немає сповіщень для фільтра)
 * @param {Object} props
 * @param {string} props.filter - Активний фільтр
 * @returns {JSX.Element}
 */
const EmptyState = ({ filter }) => (
  <li className="notifications-empty" role="listitem">
    <span className="empty-icon" aria-hidden="true">🔔</span>
    <p>
      {filter === 'unread' 
        ? 'Немає непрочитаних сповіщень' 
        : filter === 'read'
        ? 'Немає прочитаних сповіщень'
        : 'Сповіщень поки немає'}
    </p>
  </li>
);

/**
 * Компонент окремого сповіщення
 * @param {Object} props
 * @param {Object} props.notification - Дані сповіщення
 * @param {Function} props.onMarkRead - Callback для позначення як прочитане
 * @param {Function} props.onDismiss - Callback для видалення
 * @returns {JSX.Element}
 */
const NotificationItem = ({ notification, onMarkRead, onDismiss }) => {
  // Мапа іконок для різних типів сповіщень
  const getIcon = (type) => {
    const icons = { success: '✓', info: 'ℹ', warning: '⚠', error: '✕' };
    return icons[type] || 'ℹ';
  };

  // Форматування дати в українському локалі
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <li
      className={`notification-item ${notification.read ? 'read' : 'unread'} type-${notification.type}`}
      role="listitem"
    >
      <div className="notification-content">
        {/* Іконка типу сповіщення */}
        <span 
          className={`notification-icon type-icon type-${notification.type}`} 
          aria-label={`Тип: ${notification.type}`}
        >
          {getIcon(notification.type)}
        </span>
        
        {/* Текст сповіщення */}
        <div className="notification-text">
          <h4 className="notification-title">{notification.title}</h4>
          <p className="notification-message">{notification.message}</p>
          <time className="notification-date" dateTime={notification.date}>
            {formatDate(notification.date)}
          </time>
        </div>
      </div>

      {/* Кнопки дій */}
      <div className="notification-actions">
        {!notification.read && (
          <button
            type="button"
            className="action-btn read-btn"
            onClick={() => onMarkRead(notification.id)}
          >
            Прочитано
          </button>
        )}
        <button
          type="button"
          className="action-btn dismiss-btn"
          onClick={() => onDismiss(notification.id)}
          aria-label="Видалити сповіщення"
        >
          ✕
        </button>
      </div>
    </li>
  );
};

// ============================================
// ОСНОВНИЙ КОМПОНЕНТ: Notifications
// ============================================

/**
 * Головний компонент для відображення та управління сповіщеннями
 * @returns {JSX.Element}
 */
const Notifications = () => {
  // Отримуємо стан та методи з кастомного хука
  const {
    loading,
    filter,
    setFilter,
    filteredNotifications,
    unreadCount,
    handleMarkAsRead,
    handleDismiss,
    handleMarkAllAsRead,
    handleClearAll,
    notifications
  } = useNotifications();

  // Конфігурація вкладок фільтрів
  const tabs = [
    { id: 'all', label: 'Усі' },
    { id: 'unread', label: 'Непрочитані' },
    { id: 'read', label: 'Прочитані' }
  ];

  return (
    <div className="notifications-container">
      {/* Заголовок секції */}
      <header className="notifications-header">
        <div>
          <h2 className="notifications-title">Сповіщення</h2>
          <p className="notifications-subtitle">
            Переглядайте повідомлення з акаунтів.
          </p>
        </div>
        {/* Бейдж з кількістю непрочитаних (показується тільки після завантаження) */}
        {!loading && unreadCount > 0 && (
          <span className="notifications-badge" aria-label={`${unreadCount} непрочитаних`}>
            {unreadCount}
          </span>
        )}
      </header>

      {/* Фільтри та кнопка "Позначити всі" (приховані під час завантаження) */}
      {!loading && (
        <>
          <div className="notifications-filters" role="tablist" aria-label="Фільтри сповіщень">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-btn ${filter === tab.id ? 'active' : ''}`}
                onClick={() => setFilter(tab.id)}
                role="tab"
                aria-selected={filter === tab.id}
                id={`tab-${tab.id}`}
                aria-controls="notifications-list-panel"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="mark-all-btn"
              onClick={handleMarkAllAsRead}
              aria-label="Позначити всі сповіщення як прочитані"
            >
              Позначити всі як прочитані
            </button>
          )}
        </>
      )}

      {/* Список сповіщень */}
      <ul 
        id="notifications-list-panel"
        className="notifications-list" 
        role="list"
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? (
          // Показуємо скелетон під час завантаження
          <div className="loading-wrapper">
            <SkeletonLoader />
          </div>
        ) : filteredNotifications.length === 0 ? (
          // Показуємо пустий стан, якщо немає сповіщень
          <EmptyState filter={filter} />
        ) : (
          // Рендеримо список сповіщень
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkAsRead}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </ul>

      {/* Футер з кнопкою очищення (показується тільки якщо є сповіщення) */}
      {!loading && notifications.length > 0 && (
        <footer className="notifications-footer">
          <button 
            type="button" 
            className="clear-all-btn"
            onClick={handleClearAll}
            aria-label="Очистити всі сповіщення"
          >
            Очистити всі
          </button>
        </footer>
      )}

      {/* Повноекранний оверлей завантаження */}
      {loading && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default Notifications;