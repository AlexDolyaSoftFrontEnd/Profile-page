import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Семантичний компонент модального вікна з білим фоном
 * Повна підтримка доступності (WCAG 2.1 AA)
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Стан відкриття модалки
 * @param {Function} props.onClose - Функція закриття
 * @param {string} props.title - Заголовок (обов'язковий для aria-labelledby)
 * @param {string} props.description - Опис для aria-describedby (опціонально)
 * @param {React.ReactNode} props.children - Контент модалки
 * @param {string} props.size - Розмір: 'small' | 'medium' | 'large' | 'fullscreen'
 * @param {boolean} props.closeOnOverlay - Закриття при кліку на оверлей
 * @param {boolean} props.closeOnEscape - Закриття по клавіші Escape
 * @param {string} props.initialFocus - Селектор елемента для початкового фокусу
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  size = 'medium',
  closeOnOverlay = true,
  closeOnEscape = true,
  initialFocus = null
}) => {
  const modalRef = useRef(null);
  const titleId = 'modal-title';
  const descriptionId = 'modal-description';
  const previousActiveElement = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Отримуємо фокусовані елементи для focus trap
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    
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
     МОНТУВАННЯ ПОРТАЛУ
     ============================================ */
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  /* ============================================
     УПРАВЛІННЯ ФОКУСОМ ТА БЛОКУВАННЯМ СКРОЛУ
     ============================================ */
  useEffect(() => {
    if (isOpen) {
      // Зберігаємо поточний фокус для повернення
      previousActiveElement.current = document.activeElement;

      // Блокуємо скролл основної сторінки
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // Фокус на модалку після рендеру
      const timer = setTimeout(() => {
        if (initialFocus) {
          const element = modalRef.current?.querySelector(initialFocus);
          element?.focus();
        } else {
          const focusableElements = getFocusableElements();
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            modalRef.current?.focus();
          }
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        // Відновлюємо скролл
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        // Повертаємо скролл на попередню позицію
        window.scrollTo(0, scrollY);
        // Повертаємо фокус
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, getFocusableElements, initialFocus]);

  /* ============================================
     ОБРОБКА КЛАВІШ (Escape, Tab)
     ============================================ */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Закриття по Escape
      if (closeOnEscape && e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      // Focus Trap для Tab
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement || !modalRef.current?.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement || !modalRef.current?.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose, closeOnEscape, getFocusableElements]);

  /* ============================================
     ОБРОБКА КЛІКІВ ПО ОВЕРЛЕЮ
     ============================================ */
  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose, closeOnOverlay]);

  /* ============================================
     ЗАПОБІГАННЯ КЛІКАМ ВСЕРЕДИНІ МОДАЛКИ
     ============================================ */
  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Нічого не рендеримо, якщо модалка закрита або не змонтована
  if (!isOpen || !isMounted) return null;

  // Semantic Portal: рендеримо в <div id="modal-root"> або document.body
  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <section 
      className={`modal-overlay modal-overlay--${size}`}
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
      {/* Семантичний діалог з правильними ARIA */}
      <dialog
        ref={modalRef}
        className="modal-dialog"
        open
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        onClick={handleModalClick}
      >
        {/* Шапка модалки */}
        <header className="modal-header">
          <h1 id={titleId} className="modal-title">
            {title}
          </h1>
          
          {/* Кнопка закриття з семантикою */}
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Закрити модальне вікно"
            tabIndex={0}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </header>

        {/* Основний контент */}
        <main className="modal-main">
          {description && (
            <p id={descriptionId} className="modal-description">
              {description}
            </p>
          )}
          {children}
        </main>

        {/* Футер для дій (опціонально) */}
        <footer className="modal-footer">
          <slot name="actions"></slot>
        </footer>
      </dialog>
    </section>,
    modalRoot
  );
};

export default Modal;