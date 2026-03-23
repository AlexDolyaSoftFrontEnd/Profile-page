import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

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

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;

      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

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
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, getFocusableElements, initialFocus]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !modalRef.current?.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
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

  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose, closeOnOverlay]);

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!isOpen || !isMounted) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <section 
      className={`modal-overlay modal-overlay--${size}`}
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
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
        <header className="modal-header">
          <h1 id={titleId} className="modal-title">
            {title}
          </h1>
          
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

        <main className="modal-main">
          {description && (
            <p id={descriptionId} className="modal-description">
              {description}
            </p>
          )}
          {children}
        </main>

        <footer className="modal-footer">
          <slot name="actions"></slot>
        </footer>
      </dialog>
    </section>,
    modalRoot
  );
};

export default Modal;