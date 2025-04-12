import React, { useEffect } from 'react';

const Popup = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = 'default', 
  buttons = [] 
}) => {
  // Close popup when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Prevent scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="popup-overlay active" onClick={onClose}>
      <div 
        className={`popup active popup-${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <h3>{title}</h3>
          {/* Removed the close button (X) as requested */}
        </div>
        
        <div className="popup-content">
          {children}
        </div>
        
        {buttons.length > 0 && (
          <div className="popup-footer">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`btn ${button.className || 'btn-secondary'}`}
                onClick={button.onClick}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
