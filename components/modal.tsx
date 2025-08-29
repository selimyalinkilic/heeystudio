'use client';
import React, { useEffect } from 'react';

export function Modal({
  title,
  children,
  isOpen,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.style.display = 'block';
      // Trigger reflow to ensure display:block is applied before adding show class
      void modal.offsetHeight;
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      modal.classList.remove('show');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'unset';
      }, 300);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  return (
    <div
      className="modal fade"
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="modalTitle"
      aria-hidden={!isOpen}
      onClick={handleBackdropClick}
      style={{ display: 'none' }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="modalTitle" className="modal-title">
              {title}
            </h2>
            <button
              type="button"
              className="close-button"
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body overflow-auto max-h-[70vh]">
            {children}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
