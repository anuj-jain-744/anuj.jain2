import React, { useEffect, useRef, useState } from "react";
import LeftPanelClose from "assets/LeftPanel/summary-details.svg";
import CloseIcon from "assets/LeftPanel/CloseIcon.svg";

interface RightSecProps {
  children?: React.ReactNode; // Allow icon/children rendering
  rightClassName: string;
  sumaryTitle: string;
}

const RightPanelResp: React.FC<RightSecProps> = ({ children, rightClassName, sumaryTitle }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const handleHamburgerClick = () => {
    setIsPanelOpen(true);
  };

  const handleCloseClick = () => {
    setIsPanelOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      rightPanelRef.current &&
      !rightPanelRef.current.contains(event.target as Node)
    ) {
      setIsPanelOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button id="hamburger-menu-btn" onClick={handleHamburgerClick}>
        <img src={LeftPanelClose} alt="summary-details-icon" />
        <span className="summary-details-text">{sumaryTitle}</span>
      </button>

      <div className={`${rightClassName} ${isPanelOpen ? 'open' : 'closed'}`}>  
         
          <div className="summaryTitle">{sumaryTitle}</div>
          <button id="close-btn" onClick={handleCloseClick}>
            <img src={CloseIcon} alt="close summary" />
          </button>
          
          {children}
        
      </div>

    </>
  );
};

export default RightPanelResp;
