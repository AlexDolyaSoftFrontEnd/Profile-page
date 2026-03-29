import React, { useState, useEffect, useCallback } from 'react';
import Modal from './../../Modal/Modal';
import './PersonalData.css';

// ============================================
// КОНФІГУРАЦІЯ ПЛАТФОРМ
// ============================================

const PLATFORMS = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: '#E4405F',
    placeholder: '@username',
    supportsAutoPost: true,
    fields: [
      { id: 'username', label: 'Нікнейм', type: 'text', required: true, prefix: '@' },
      { id: 'accessToken', label: 'Access Token (опціонально)', type: 'password', required: false },
    ]
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    placeholder: 'facebook.com/username',
    supportsAutoPost: true,
    fields: [
      { id: 'username', label: 'Посилання на сторінку', type: 'url', required: true },
      { id: 'pageId', label: 'ID сторінки', type: 'text', required: false },
    ]
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    color: '#FF0000',
    placeholder: 'youtube.com/@channel',
    supportsAutoPost: true,
    fields: [
      { id: 'username', label: 'Посилання на канал', type: 'url', required: true },
      { id: 'channelId', label: 'ID каналу (опціонально)', type: 'text', required: false },
      { id: 'monetized', label: 'Монетизований канал', type: 'checkbox', required: false }
    ]
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    color: '#000000',
    placeholder: '@username',
    supportsAutoPost: true,
    fields: [
      { id: 'username', label: 'Нікнейм', type: 'text', required: true, prefix: '@' },
      { id: 'profileUrl', label: 'Посилання на профіль', type: 'url', required: false },
      { id: 'verified', label: 'Верифікований акаунт', type: 'checkbox', required: false }
    ]
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    placeholder: '@username',
    supportsAutoPost: false,
    fields: [
      { id: 'username', label: 'Нікнейм', type: 'text', required: true, prefix: '@' },
      { id: 'businessAccount', label: 'Бізнес-акаунт', type: 'checkbox', required: false }
    ]
  },
};

// ============================================
// ОСНОВНИЙ КОМПОНЕНТ: PersonalData
// ============================================

const PersonalData = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockAccounts = [
          {
            id: 1,
            platform: 'instagram',
            username: '@smm_master',
            followers: '12.5K',
            status: 'connected',
            lastSync: '2 хв тому',
            autoPost: true,
            accessToken: '••••••••'
          },
          {
            id: 2,
            platform: 'facebook',
            username: 'facebook.com/smm.page',
            followers: '8.2K',
            status: 'connected',
            lastSync: '15 хв тому',
            autoPost: false,
            pageId: '123456789'
          },    
          {
            id: 3,
            platform: 'youtube',
            username: 'youtube.com/@MyChannel',
            followers: '23.7K',
            status: 'connected',
            lastSync: '5 хв тому',
            autoPost: true,
            channelId: 'UCxxxxxxxxxxxxxx',
            monetized: true
          },
          {
            id: 4,
            platform: 'twitter',
            username: '@news_hub',
            followers: '5.8K',
            status: 'connected',
            lastSync: '1 год тому',
            autoPost: true,
            verified: true,
            profileUrl: 'https://twitter.com/news_hub'
          },
          {
            id: 5,
            platform: 'tiktok',
            username: '@viral_content',
            followers: '45.1K',
            status: 'disconnected',
            lastSync: '2 дні тому',
            businessAccount: true
          },
        ];
        setAccounts(mockAccounts);
      } catch (err) {
        console.error('Помилка завантаження акаунтів:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);

  const filteredAccounts = accounts.filter(account => 
    filterStatus === 'all' || account.status === filterStatus
  );

  const openAddModal = (platformId) => {
    setSelectedPlatform(platformId);
    setModalMode('add');
    setFormData({});
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (account) => {
    setSelectedPlatform(account.platform);
    setModalMode('edit');
    setEditingAccount(account);
    setFormData({ ...account });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlatform(null);
    setEditingAccount(null);
    setFormData({});
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const platform = PLATFORMS[selectedPlatform];
    
    platform.fields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `Це поле обов'язкове`;
      }
      if (field.type === 'url' && formData[field.id] && !/^https?:\/\//.test(formData[field.id])) {
        newErrors[field.id] = 'Введіть коректне посилання';
      }
      if (field.type === 'email' && formData[field.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.id])) {
        newErrors[field.id] = 'Введіть коректний email';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (modalMode === 'add') {
      const newAccount = {
        id: Date.now(),
        platform: selectedPlatform,
        username: formData.username || formData.channelUrl || '',
        followers: '0',
        status: 'connected',
        lastSync: 'щойно',
        ...formData
      };
      setAccounts(prev => [...prev, newAccount]);
    } else if (modalMode === 'edit' && editingAccount) {
      setAccounts(prev => prev.map(acc => 
        acc.id === editingAccount.id 
          ? { ...acc, ...formData, username: formData.username || formData.channelUrl || acc.username }
          : acc
      ));
    }
    closeModal();
  };

  const handleDisconnect = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (window.confirm(`Ви впевнені, що хочете відключити ${account?.username}?`)) {
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
  };

  const handleReconnect = (accountId) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, status: 'connected', lastSync: 'щойно' } : acc
    ));
  };

  const handleCopyUsername = (username) => {
    navigator.clipboard.writeText(username);
  };

  const renderFormField = (field) => {
    if (field.type === 'checkbox') {
      return (
        <label className="checkbox-label" key={field.id}>
          <input
            type="checkbox"
            name={field.id}
            checked={!!formData[field.id]}
            onChange={handleInputChange}
            className="checkbox-input"
          />
          <span className="checkbox-text">{field.label}</span>
        </label>
      );
    }

    return (
      <div className="form-group" key={field.id}>
        <label htmlFor={field.id} className="form-label">
          {field.label}
          {field.required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
        <div className="input-wrapper">
          {field.prefix && <span className="input-prefix">{field.prefix}</span>}
          <input
            type={field.type}
            id={field.id}
            name={field.id}
            className={`form-input ${errors[field.id] ? 'error' : ''} ${field.prefix ? 'with-prefix' : ''}`}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            placeholder={PLATFORMS[selectedPlatform]?.placeholder}
            autoComplete="off"
          />
        </div>
        {errors[field.id] && (
          <span className="form-error" role="alert">{errors[field.id]}</span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="social-accounts-container">
        <div className="loading-state">
          <div className="loading-spinner" aria-hidden="true" />
          <p>Завантаження акаунтів...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="social-accounts-container">
      <header className="section-header">
        <div>
          <h1 className="page-title">Налаштування профілю</h1>
          <p className="page-subtitle">Підключіть акаунти для управління публікаціями.</p>
        </div>
        <div className="header-actions">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Фільтр за статусом"
          >
            <option value="all">Всі акаунти</option>
            <option value="connected">Підключені</option>
            <option value="disconnected">Відключені</option>
          </select>
        </div>
      </header>

      <section className="platforms-grid" aria-label="Доступні платформи">
        {Object.values(PLATFORMS).map((platform) => {
          const isConnected = accounts.some(acc => acc.platform === platform.id);
          return (
            <button
              key={platform.id}
              className={`platform-card ${isConnected ? 'connected' : ''}`}
              onClick={() => isConnected 
                ? openEditModal(accounts.find(a => a.platform === platform.id)) 
                : openAddModal(platform.id)
              }
              aria-label={`${isConnected ? 'Редагувати' : 'Додати'} ${platform.name}`}
            >
              <span className="platform-icon" style={{ color: platform.color }}>{platform.icon}</span>
              <span className="platform-name">{platform.name}</span>
              {isConnected && <span className="platform-status connected">●</span>}
            </button>
          );
        })}
      </section>

      {filteredAccounts.length > 0 && (
        <section className="accounts-list" aria-label="Підключені акаунти">
          <h2 className="section-subtitle">Ваші акаунти ({filteredAccounts.length})</h2>
          <div className="accounts-grid">
            {filteredAccounts.map((account) => {
              const platform = PLATFORMS[account.platform];
              
              return (
                <article 
                  key={account.id} 
                  className={`account-card ${account.status}`}
                  itemScope
                  itemType="https://schema.org/Organization"
                >
                  <div className="account-header">
                    <div className="account-platform" style={{ borderColor: platform.color }}>
                      <span className="platform-icon" style={{ color: platform.color }}>{platform.icon}</span>
                      <span className="platform-name">{platform.name}</span>
                    </div>
                    <span className={`status-badge ${account.status}`}>
                      {account.status === 'connected' ? 'Підключено' : 'Відключено'}
                    </span>
                  </div>

                  <div className="account-info">
                    <button 
                      className="account-username clickable" 
                      itemProp="name"
                      onClick={() => handleCopyUsername(account.username)}
                      title="Натисніть, щоб скопіювати"
                      aria-label={`Скопіювати ${account.username}`}
                    >
                      {account.username}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                    <div className="account-stats">
                      <span className="stat-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        {account.followers}
                      </span>
                      <span className="stat-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {account.lastSync}
                      </span>
                    </div>
                  </div>

                  <div className="account-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => openEditModal(account)}
                      aria-label={`Редагувати ${platform.name}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Редагувати
                    </button>
                    {account.status === 'connected' ? (
                      <button 
                        className="btn-danger" 
                        onClick={() => handleDisconnect(account.id)}
                        aria-label={`Відключити ${platform.name}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                          <line x1="12" y1="2" x2="12" y2="12"/>
                        </svg>
                        Відключити
                      </button>
                    ) : (
                      <button 
                        className="btn-success" 
                        onClick={() => handleReconnect(account.id)}
                        aria-label={`Підключити ${platform.name}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Підключити
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {filteredAccounts.length === 0 && accounts.length > 0 && (
        <div className="empty-state" role="status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p>Немає акаунтів у цій категорії</p>
          <button className="btn-clear" onClick={() => setFilterStatus('all')}>
            Показати всі
          </button>
        </div>
      )}

      {accounts.length === 0 && (
        <div className="empty-state" role="status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p>Ще немає підключених акаунтів</p>
          <p className="empty-subtitle">Оберіть платформу вище, щоб додати перший акаунт</p>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={modalMode === 'add' ? `Додати ${PLATFORMS[selectedPlatform]?.name}` : `Редагувати ${PLATFORMS[selectedPlatform]?.name}`}
        size="medium"
      >
        {selectedPlatform && (
          <form className="social-form" onSubmit={handleSave} noValidate>
            <div className="platform-preview">
              <span className="platform-icon" style={{ color: PLATFORMS[selectedPlatform].color }}>
                {PLATFORMS[selectedPlatform].icon}
              </span>
              <span className="platform-name">{PLATFORMS[selectedPlatform].name}</span>
            </div>

            {PLATFORMS[selectedPlatform].fields.map(renderFormField)}

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={closeModal}>
                Скасувати
              </button>
              <button type="submit" className="btn-save">
                {modalMode === 'add' ? 'Підключити' : 'Зберегти'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PersonalData;