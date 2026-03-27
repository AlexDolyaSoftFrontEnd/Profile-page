import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// --- Іконки (винесені окремо для чистоти) ---
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const SocialIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
  </svg>
);

const NotificationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const NewsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// --- Конфігурація меню (Статичні дані) ---
const MENU_ITEMS = [
  { id: 'home', label: 'Головна', path: '/profile/home', icon: HomeIcon },
  { id: 'personal-data', label: 'Соціальні мережі', path: '/profile/personal-data', icon: SocialIcon },
  { id: 'notifications', label: 'Сповіщення', path: '/profile/notifications', icon: NotificationIcon },
  { id: 'news', label: 'Новини', path: '/profile/news', icon: NewsIcon },
  { id: 'settingspanel', label: 'Налаштування', path: '/profile/settingspanel', icon: SettingsIcon },
];

const Sidebar = () => {
  return (
    <aside className="sidebar" role="complementary" aria-label="Бокова навігація">
      <div className="sidebar-top">
        <nav className="sidebar-nav" aria-label="Основна навігація">
          {MENU_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="nav-item-wrapper">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                  }
                  aria-label={item.label}
                  // Обробка випадку, коли '/' перенаправляється на '/profile/home'
                  end={item.id === 'home'} 
                >
                  <span className="nav-icon">
                    <IconComponent />
                  </span>
                </NavLink>
                
                <div className="nav-tooltip" role="tooltip" aria-hidden="true">
                  <span className="tooltip-text">{item.label}</span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

// Мемоізація компонента для уникнення зайвих рендерів при зміні батьків
export default memo(Sidebar);