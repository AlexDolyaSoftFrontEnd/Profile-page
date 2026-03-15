import React from 'react';
import './Sidebar.css';

/**
 * Компонент боковой панели навигации
 * @param {Object} props
 * @param {string} props.activeTab - ID активной вкладки
 * @param {Function} props.onTabChange - Callback при изменении вкладки
 */
const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'personal-data', label: 'Особисті дані', icon: '👤' },
    { id: 'notifications', label: 'Сповіщення', icon: '🔔' }
  ];

  return (
    <aside className="sidebar" role="complementary" aria-label="Боковая навигация">
      <nav className="sidebar-nav" aria-label="Навигация профиля">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            {/* Иконка (скрыта для скринридеров) */}
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {/* Текст кнопки */}
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;