import React, { useState } from 'react';
import SuccessImage from '../../../../corporate-portal/src/assets/contactWalaa/Popups Status.svg';
import CrossImage from '../../../../corporate-portal/src/assets/contactWalaa/cancelIcon.svg';
// import './sucessContact.scss';  

interface Props {
  caseNumber: string;
}

 
 const SuccessMessage: React.FC<Props> = ({  caseNumber }) => {

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
        <h2> Your case has been created successfully. {caseNumber}</h2> 
        
      </div>
    </div>
  );
};

export default SuccessMessage;