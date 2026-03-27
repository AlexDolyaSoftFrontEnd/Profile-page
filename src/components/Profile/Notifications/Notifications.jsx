import React, { useState, useMemo } from 'react';
import './Notifications.css';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  
  const [notifications, setNotifications] = useState([
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
    }
  ]);

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter(n => !n.read);
    if (filter === 'read') return notifications.filter(n => n.read);
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length
  , [notifications]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: '✓',
      info: 'ℹ',
      warning: '⚠',
      error: '✕'
    };
    return icons[type] || 'ℹ';
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notifications-container">
      <header className="notifications-header">
        <div>
          <h2 className="notifications-title">Сповіщення</h2>
          <p className="notifications-subtitle">
            Переглядайте повідомлення з акаунтів.
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="notifications-badge" aria-label={unreadCount + ' непрочитаних'}>
            {unreadCount}
          </span>
        )}
      </header>

      <div className="notifications-filters" role="tablist" aria-label="Фильтры">
        {[
          { id: 'all', label: 'Усі' },
          { id: 'unread', label: 'Непрочитані' },
          { id: 'read', label: 'Прочитані' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={'filter-btn ' + (filter === tab.id ? 'active' : '')}
            onClick={() => setFilter(tab.id)}
            role="tab"
            aria-selected={filter === tab.id}
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
        >
          Позначити всі як прочитані
        </button>
      )}

      <ul 
        className="notifications-list" 
        role="list"
        aria-live="polite"
        aria-busy={notifications.length === 0}
      >
        {filteredNotifications.length === 0 ? (
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
        ) : (
          filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className={'notification-item ' + (notification.read ? 'read' : 'unread') + ' type-' + notification.type}
              role="listitem"
            >
              <div className="notification-content">
                <span 
                  className="notification-icon type-icon" 
                  aria-label={'Тип: ' + notification.type}
                >
                  {getNotificationIcon(notification.type)}
                </span>
                
                <div className="notification-text">
                  <h4 className="notification-title">{notification.title}</h4>
                  <p className="notification-message">{notification.message}</p>
                  <time className="notification-date" dateTime={notification.date}>
                    {formatDate(notification.date)}
                  </time>
                </div>
              </div>

              <div className="notification-actions">
                {!notification.read && (
                  <button
                    type="button"
                    className="action-btn read-btn"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Прочитано
                  </button>
                )}
                <button
                  type="button"
                  className="action-btn dismiss-btn"
                  onClick={() => handleDismiss(notification.id)}
                  aria-label="Видалити"
                >
                  ✕
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {notifications.length > 0 && (
        <footer className="notifications-footer">
          <button 
            type="button" 
            className="clear-all-btn"
            onClick={handleClearAll}
          >
            Очистити всі
          </button>
        </footer>
      )}
    </div>
  );
};

export default Notifications;