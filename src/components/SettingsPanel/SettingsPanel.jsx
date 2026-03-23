import React, { useState } from 'react';
import './SettingsPanel.css';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    twoFactorAuth: true,
    marketingEmails: false,
  });

  const [initialSettings] = useState({ ...settings });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    console.log('Збережені налаштування:', settings);
    alert('✅ Налаштування успішно збережено!');
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    alert('❌ Зміни скасовано');
  };

  const settingsList = [
    { 
      key: 'pushNotifications', 
      label: 'Push-сповіщення',
      hint: 'Сповіщення в браузері та мобільному додатку'
    },
    { 
      key: 'marketingEmails', 
      label: 'Рекламні розсилки',
      hint: 'Новини, акції та спеціальні пропозиції'
    },
  ];

  return (
    <div className="settings">
           <div className="settings-panel">
      {/* Заголовок секції - вирівняно по лівому краю */}
      <header className="settings-header">
        <h2 className="settings-title">Налаштування профілю</h2>
        <p className="settings-description">
          Керуйте параметрами свого облікового запису: сповіщення, безпека, 
          зовнішній вигляд та конфіденційність.
        </p>
      </header>
      
      {/* Контент з налаштуваннями - вирівняно по лівому краю */}
      <div className="settings-content" role="group" aria-label="Список налаштувань">
        {settingsList.map((item) => (
          <label key={item.key} className="setting-item" htmlFor={item.key}>
            {/* Checkbox зліва */}
            <input
              type="checkbox"
              id={item.key}
              checked={settings[item.key]}
              onChange={() => handleToggle(item.key)}
              className="setting-checkbox"
              aria-describedby={`${item.key}-hint`}
            />
            
            {/* Текст праворуч від чекбокса */}
            <div className="setting-text-wrapper">
              <span className="setting-label">{item.label}</span>
              <span id={`${item.key}-hint`} className="setting-hint">
                {item.hint}
              </span>
            </div>
          </label>
        ))}
      </div>

      {/* Інформаційний текст внизу - вирівняно по лівому краю */}
      <footer className="settings-footer">
        <p className="settings-footer-text">
          <span className="footer-icon" aria-hidden="true">ℹ️</span>
          Зміни застосовуються миттєво після натискання кнопки «Зберегти зміни». 
          Деякі параметри можуть вимагати повторного входу в систему.
        </p>
      </footer>

      {/* Кнопки дій - вирівняно по лівому краю */}
      <div className="settings-actions">
        <button 
          type="button" 
          className="btn btn-cancel" 
          onClick={handleCancel}
          aria-label="Скасувати зміни та повернути початкові налаштування"
        >
          Скасувати
        </button>
        <button 
          type="button" 
          className="btn btn-save" 
          onClick={handleSave}
          aria-label="Зберегти внесені зміни в налаштуваннях"
        >
          Зберегти зміни
        </button>
      </div>
    </div>
    </div>
  );
};

export default SettingsPanel;