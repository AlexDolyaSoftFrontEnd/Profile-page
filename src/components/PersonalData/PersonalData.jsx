import React, { useState } from 'react';
import Modal from './../Modal/Modal';
import './PersonalData.css';

const PersonalData = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Дані профілю
  const [profileData, setProfileData] = useState({
    birthDate: '22 серпня 1992 р.',
    birthDateRaw: '1992-08-22',
    location: 'Вул. Балукова 1 кв. 52',
    email: 'icegouse@gmail.com',
    phone: '+380973234711'
  });
  
  const [formData, setFormData] = useState({ ...profileData });

  const openModal = () => {
    setFormData({ ...profileData });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const dateObj = new Date(formData.birthDateRaw);
    const formattedDate = !isNaN(dateObj)
      ? dateObj.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
      : formData.birthDateRaw;

    setProfileData(prev => ({ ...prev, ...formData, birthDate: formattedDate }));
    closeModal();
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    closeModal();
  };

  return (
    <>
      <div className="content-header">
        <h1 className="page-title">Особисті Дані</h1>
        <p className="page-subtitle">Вкажіть інформацію, яка буде доступна.</p>
      </div>

      {/* Сітка даних */}
      <dl className="personal-data-grid">
        {[
          { label: 'Дата народження', value: profileData.birthDate },
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

      <div className="edit-button-wrapper">
        <button 
          className="edit-button edit-button-bottom" 
          onClick={openModal} 
          type="button"
        >
          <span className="edit-icon" aria-hidden="true">✎</span>
          <span>Редагувати</span>
        </button>
      </div>

      {/* Модальне вікно редагування */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Редагування профілю">
        <form className="edit-form" onSubmit={handleSave}>
          {[
            { id: 'birthDateRaw', label: 'Дата народження', type: 'date', required: true },
            { id: 'location', label: 'Місце проживання', type: 'text', required: true },
            { id: 'email', label: 'Електронна пошта', type: 'email', required: true },
            { id: 'phone', label: 'Номер телефону', type: 'tel', required: true },
          ].map((field) => (
            <div className="form-group" key={field.id}>
              <label htmlFor={field.id} className="form-label">
                {field.label} {field.required && <span aria-hidden="true">*</span>}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                className="form-input"
                value={formData[field.id]}
                onChange={handleInputChange}
                required={field.required}
              />
            </div>
          ))}
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Скасувати
            </button>
            <button type="submit" className="btn-save">
              Зберегти зміни
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PersonalData;