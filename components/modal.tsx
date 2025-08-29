'use client';
import React, { useEffect } from 'react';

export function Modal({
  children,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [modalSize, setModalSize] = React.useState<'modal-lg' | 'modal-xl'>(
    'modal-xl'
  );

  // Function to determine modal size based on content
  React.useEffect(() => {
    if (isOpen) {
      // Always use extra large modal for better image viewing
      setModalSize('modal-xl');
    }
  }, [isOpen]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      // Trigger reflow to ensure display:flex is applied before adding show class
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
        modal.style.alignItems = '';
        modal.style.justifyContent = '';
        document.body.style.overflow = 'unset';

        // Reset modal-dialog dimensions when fully closed
        const modalDialog = modal.querySelector('.modal-dialog') as HTMLElement;
        if (modalDialog) {
          modalDialog.style.width = '';
          modalDialog.style.height = '';
          modalDialog.style.minWidth = '';
          modalDialog.style.maxWidth = '';
        }
      }, 300);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    const modal = modalRef.current;
    if (!modal) {
      onClose();
      return;
    }

    // Freeze modal-dialog dimensions before zoom reset
    const modalDialog = modal.querySelector('.modal-dialog') as HTMLElement;
    if (modalDialog) {
      const currentWidth = modalDialog.offsetWidth;
      const currentHeight = modalDialog.offsetHeight;
      modalDialog.style.width = `${currentWidth}px`;
      modalDialog.style.height = `${currentHeight}px`;
      modalDialog.style.minWidth = 'auto';
      modalDialog.style.maxWidth = 'none';
    }

    // Reset any zoom state INSTANTLY
    const zoomedImages = modal.querySelectorAll('.zoom-image.zoomed');
    zoomedImages.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      imgElement.style.transition = 'none';
      imgElement.style.transform = 'scale(1)';
      imgElement.classList.remove('zoomed');
      void imgElement.offsetHeight;
      imgElement.style.transition = '';
    });
    const zoomedContainers = modal.querySelectorAll('.zoom-container.zoomed');
    zoomedContainers.forEach((container) => {
      const containerElement = container as HTMLElement;
      containerElement.classList.remove('zoomed');
    });

    // Close modal after zoom reset
    onClose();
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleEscapeKey = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    },
    [isOpen, handleClose]
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
      <div className={`modal-dialog ${modalSize}`} role="document">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <button
              type="button"
              className="close-button ml-auto"
              onClick={handleClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body overflow-hidden max-h-[85vh] p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
