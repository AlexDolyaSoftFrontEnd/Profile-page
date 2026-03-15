import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Отримуємо активну вкладку з URL (остатня частина шляху)
  const activeTab = location.pathname.split('/').pop() || 'personal-data';

  const menuItems = [
    { id: 'personal-data', label: 'Особисті дані', icon: '👤' },
    { id: 'notifications', label: 'Сповіщення', icon: '🔔' },
    { id: 'settingspanel', label: 'Налаштування', icon: '⚙️' },
    { id: 'security', label: 'Безпека', icon: '🔒' },
    { id: 'privacy', label: 'Приватність', icon: '🛡️' },
    { id: 'help', label: 'Допомога', icon: '❓' }
  ];

  const handleTabChange = (tabId) => {
    navigate(`/profile/${tabId}`);
  };

  return (
    <aside className="sidebar" role="complementary" aria-label="Бокова навігація">
      <nav className="sidebar-nav" aria-label="Навігація профілю">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleTabChange(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;