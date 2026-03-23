import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      id: 'home', 
      label: 'Головна', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    { 
      id: 'personal-data', 
      label: 'Особисті дані', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
        </svg>
      )
    },
    { 
      id: 'notifications', 
      label: 'Сповіщення', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      )
    },
    { 
      id: 'settingspanel', 
      label: 'Налаштування', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      )
    }
  ];

  const getActiveTab = () => {
    const pathname = location.pathname;
    
    if (pathname === '/profile') return 'home';
    if (pathname === '/profile/personal-data') return 'personal-data';
    if (pathname === '/profile/notifications') return 'notifications';
    if (pathname === '/profile/settingspanel') return 'settingspanel';
    
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <aside className="sidebar" role="complementary" aria-label="Бокова навігація">
      <div className="sidebar-top">
        <nav className="sidebar-nav" aria-label="Навігація">
          {menuItems.map((item) => (
            <div key={item.id} className="nav-item-wrapper">
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => navigate(`/profile/${item.id}`)}
                aria-current={activeTab === item.id ? 'page' : undefined}
                data-tooltip={item.label}
              >
                <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              </button>
              
              {/* Тултіп з стрілкою */}
              <div className="nav-tooltip" role="tooltip">
                <span className="tooltip-text">{item.label}</span>
              </div>
            </div>
          ))}
        </nav>
      </div>
      
      <div className="sidebar-bottom">
        <div className="nav-item-wrapper">
          <button
            type="button"
            className="sidebar-nav-item help-btn"
            onClick={() => navigate('/help')}
            data-tooltip="Допомога"
          >
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </span>
          </button>
          
          <div className="nav-tooltip" role="tooltip">
            <span className="tooltip-text">Допомога</span>
          </div>
        </div>
        
        <div className="nav-item-wrapper">
          <button
            type="button"
            className="sidebar-nav-item profile-btn"
            onClick={() => navigate('/')}
            data-tooltip="Профіль"
          >
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
          </button>
          
          <div className="nav-tooltip" role="tooltip">
            <span className="tooltip-text">Профіль</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;