import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Компонент модального окна
 * @param {Object} props
 * @param {boolean} props.isOpen - Открыто ли модальное окно
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {string} props.title - Заголовок модального окна
 * @param {React.ReactNode} props.children - Дочерние элементы (контент модального окна)
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // Ссылка на основной элемент модального окна
  const modalRef = useRef(null);
  // Сохраняем элемент, который был в фокусе до открытия модалки
  const previousActiveElement = useRef(null);

  /**
   * Получаем все фокусируемые элементы внутри модального окна
   * @returns {NodeList} Список фокусируемых элементов
   */
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    
    // Селекторы всех фокусируемых элементов
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ];

    return modalRef.current.querySelectorAll(focusableSelectors.join(', '));
  }, []);

  /* ============================================
     УПРАВЛЕНИЕ ФОКУСОМ ПРИ ОТКРЫТИИ/ЗАКРЫТИИ
     ============================================ */
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущий элемент в фокусе (чтобы вернуть после закрытия)
      previousActiveElement.current = document.activeElement;

      // Блокируем прокрутку body при открытом модальном окне
      document.body.style.overflow = 'hidden';

      // Устанавливаем фокус на первый фокусируемый элемент после рендера
      const timer = setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          modalRef.current?.focus();
        }
      }, 0);

      // Очистка при размонтировании
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      // Возвращаем прокрутку body
      document.body.style.overflow = '';
      // Возвращаем фокус на предыдущий элемент
      previousActiveElement.current?.focus();
    }
  }, [isOpen, getFocusableElements]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Закрытие модального окна по клавише Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Удержание фокуса внутри модального окна (Focus Trap)
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: если на первом элементе → переходим на последний
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: если на последнем элементе → переходим на первый
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Добавляем обработчик нажатий клавиш
    document.addEventListener('keydown', handleKeyDown);
    // Удаляем обработчик при размонтировании
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, getFocusableElements]);

  const handleOverlayClick = useCallback((e) => {
    // Закрываем только если клик был по самому overlay, а не по контенту
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Если модальное окно закрыто — ничего не рендерим
  if (!isOpen) return null;

  // Рендерим модальное окно через Portal в document.body
  return createPortal(
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick} 
      role="presentation"
      aria-hidden="false"
    >
      <div
        ref={modalRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        {/* Шапка модального окна */}
        <header className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          {/* Кнопка закрытия */}
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>
        {/* Тело модального окна (контент) */}
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
