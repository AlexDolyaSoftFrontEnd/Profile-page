import React, { memo, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

// --- Іконки (винесені окремо для чистоти та memo) ---
const HomeIcon = memo(() => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
));
HomeIcon.displayName = 'HomeIcon';

const SocialIcon = memo(() => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
  </svg>
));
SocialIcon.displayName = 'SocialIcon';

const NewsIcon = memo(() => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
  </svg>
));
NewsIcon.displayName = 'NewsIcon';

// --- Конфігурація меню (Статичні дані) ---
const MENU_ITEMS = [
  { id: 'home', label: 'Головна', path: '/profile/home', icon: HomeIcon },
  { id: 'personal-data', label: 'Налаштування профілю', path: '/profile/personal-data', icon: SocialIcon },
  { id: 'news', label: 'Новини', path: '/profile/news', icon: NewsIcon },
];

// --- Компонент: NavItem (окремий для оптимізації рендеру) ---
const NavItem = memo(({ item, isActive }) => {
  const IconComponent = item.icon;
  
  return (
    <div className="nav-item-wrapper">
      <NavLink
        to={item.path}
        className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        end={item.id === 'home'}
      >
        <span className="nav-icon" aria-hidden="true">
          <IconComponent />
        </span>
      </NavLink>
      
      {/* Центрована підказка зверху */}
      <div 
        className="nav-tooltip nav-tooltip-centered" 
        role="tooltip"
        aria-hidden="true"
        data-label={item.label}
      >
        <span className="tooltip-text">{item.label}</span>
        <span className="tooltip-arrow" aria-hidden="true"></span>
      </div>
    </div>
  );
});
NavItem.displayName = 'NavItem';

const Sidebar = () => {
  const location = useLocation();

  // Оптимізована перевірка активного стану
  const isItemActive = useCallback((path, isEnd) => {
    if (isEnd) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  return (
    <aside className="sidebar" role="complementary" aria-label="Бокова навігація">
      <nav className="sidebar-nav" aria-label="Основна навігація">
        {MENU_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={isItemActive(item.path, item.id === 'home')}
          />
        ))}
      </nav>
    </aside>
  );
};

export default memo(Sidebar);