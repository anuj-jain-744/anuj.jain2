import React, { useState } from 'react';
import SuccessImage from '../../../assets/GetQuoteForm/Popups Status.svg';
import CrossImage from '../../../assets/GetQuoteForm/Close.svg';
import './index.scss';

interface SuccessMessageProps {
  successMessage: string; 
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ successMessage }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="success-overlay">
      <div className="success-modal">
        <button className="close-button" onClick={handleClose}>
          <img src={CrossImage} alt="Close" />
        </button>
        
        <img src={SuccessImage} alt="Success" className="success-icon" />
        
        <h2>{successMessage}</h2>
      </div>
    </div>
  );
};

export default SuccessMessage;
