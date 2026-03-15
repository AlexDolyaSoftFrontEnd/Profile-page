import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import Sidebar from '../Sidebar/Sidebar';
import Notifications from '../Notifications/Notifications';
import './ProfilePage.css';

const ProfilePage = () => {
  /* ============================================
     СОСТОЯНИЕ АКТИВНОЙ ВКЛАДКИ
     ============================================ */
  const [activeTab, setActiveTab] = useState('personal-data');
  
  /* ============================================
     СОСТОЯНИЕ МОДАЛЬНОГО ОКНА
     ============================================ */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ============================================
     ДАННЫЕ ПРОФИЛЯ (ОСНОВНОЕ СОСТОЯНИЕ)
     ============================================ */
  const [profileData, setProfileData] = useState({
    fullName: 'Олександр Долинський',
    birthDate: '22 серпня 1992 р.',
    birthDateRaw: '1992-08-22',
    gender: 'Чоловіча',
    location: 'Україна',
    email: 'icegouse@gmail.com',
    phone: '+380973234711'
  });

  /* ============================================
     ДАННЫЕ ФОРМЫ (ДЛЯ МОДАЛЬНОГО ОКНА)
     ============================================ */
  const [formData, setFormData] = useState({ ...profileData });

  /* ============================================
     ОБРАБОТЧИК ПЕРЕКЛЮЧЕНИЯ ВКЛАДОК
     ============================================ */
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
  };

  /* ============================================
     ОТКРЫТИЕ МОДАЛЬНОГО ОКНА
     ============================================ */
  const openModal = () => {
    // Синхронизируем форму с текущими данными профиля
    setFormData({ ...profileData });
    setIsModalOpen(true);
  };

  /* ============================================
     ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
     ============================================ */
  const closeModal = () => setIsModalOpen(false);

  /* ============================================
     ОБРАБОТКА ИЗМЕНЕНИЙ В ФОРМЕ
     ============================================ */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* ============================================
     СОХРАНЕНИЕ ИЗМЕНЕНИЙ
     ============================================ */
  const handleSave = (e) => {
    e.preventDefault();
    
    // Форматируем дату в украинском формате
    const dateObj = new Date(formData.birthDateRaw);
    const formattedDate = !isNaN(dateObj)
      ? dateObj.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
      : formData.birthDateRaw;

    // Обновляем данные профиля
    setProfileData(prev => ({
      ...prev,
      ...formData,
      birthDate: formattedDate
    }));
    
    closeModal();
  };

  /* ============================================
     ОТМЕНА ИЗМЕНЕНИЙ
     ============================================ */
  const handleCancel = () => {
    // Возвращаем форму к исходным данным
    setFormData({ ...profileData });
    closeModal();
  };

  return (
    <div className="profile-container">
      {/* Боковая панель навигации */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Основной контент */}
      <main className="main-content">
        {/* ============================================
            ВКЛАДКА: ОСОБИСТІ ДАНІ
            ============================================ */}
        {activeTab === 'personal-data' && (
          <>
            <div className="content-header">
              {/* Хлебные крошки */}
              <nav aria-label="Хлебные крошки">
                <ol className="breadcrumb">
                  <li><span>Кабінет користувача</span></li>
                  <li className="breadcrumb-separator" aria-hidden="true">›</li>
                </ol>
              </nav>
              {/* Заголовок страницы */}
              <h1 className="page-title">Особисті дані</h1>
              <p className="page-subtitle">Вкажіть інформацію, яка буде доступна для роботодавців.</p>
            </div>

            {/* Кнопка редактирования */}
            <button className="edit-button" onClick={openModal} type="button">
              <span className="edit-icon" aria-hidden="true">✎</span>
              <span>Редагувати</span>
            </button>

            {/* Список данных профиля */}
            <dl className="personal-data-grid">
              {[
                { label: "Ім'я та прізвище", value: profileData.fullName },
                { label: 'Дата народження', value: profileData.birthDate },
                { label: 'Стать', value: profileData.gender },
                { label: 'Місце проживання', value: profileData.location },
                { label: 'Електронна пошта', value: profileData.email },
                { label: 'Номер телефону', value: profileData.phone },
              ].map((item, idx) => (
                <div className="data-row" key={idx}>
                  <dt className="data-label">{item.label}:</dt>
                  <dd className="data-value">{item.value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {/* ============================================
            ВКЛАДКА: СПОВІЩЕННЯ
            ============================================ */}
        {activeTab === 'notifications' && (
          <Notifications />
        )}
      </main>

      {/* ============================================
         МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ
         ============================================ */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Редагування профілю">
        <form className="edit-form" onSubmit={handleSave}>
          {[
            { id: 'fullName', label: "Ім'я та прізвище", type: 'text', required: true, autoComplete: 'name' },
            { id: 'birthDateRaw', label: 'Дата народження', type: 'date', required: true },
            { id: 'gender', label: 'Стать', type: 'select', options: ['Чоловіча', 'Жіноча'] },
            { id: 'location', label: 'Місце проживання', type: 'text', required: true, autoComplete: 'address-level1' },
            { id: 'email', label: 'Електронна пошта', type: 'email', required: true, autoComplete: 'email' },
            { id: 'phone', label: 'Номер телефону', type: 'tel', required: true, autoComplete: 'tel', pattern: '[\\+]?[0-9\\s\\-\\(\\)]+' },
          ].map((field) => (
            <div className="form-group" key={field.id}>
              <label htmlFor={field.id} className="form-label">
                {field.label} {field.required && <span aria-hidden="true">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  id={field.id} name={field.id} className="form-input"
                  value={formData[field.id]} onChange={handleInputChange}
                >
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type={field.type} id={field.id} name={field.id} className="form-input"
                  value={formData[field.id]} onChange={handleInputChange}
                  required={field.required} autoComplete={field.autoComplete} pattern={field.pattern}
                />
              )}
            </div>
          ))}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>Скасувати</button>
            <button type="submit" className="btn-save">Зберегти зміни</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;