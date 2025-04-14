import React, { useState } from "react";
import { IconsSet } from "utils/icons";
import ThemeButton from "components/ThemeButton/ThemeButton";
import closeIcon from './../../../../assets/AlertIcon/closeIcon.svg';
import { useNavigate } from "react-router-dom";
import "./AlertPopUp.scss";

interface AlertPopUpProps {
  varaint: string;
  title:string;
  message:string;
  buttonName:string;
  navTo:string;
}

const AlertPopUp: React.FC<AlertPopUpProps> = (
  { 
    varaint = 'success',
    title = '',
    message = '',
    buttonName = '',
    navTo,
  }
) => {
  const navigate = useNavigate();
  const [closeComponent, setCloseComponent] = useState(false);

  const closeAlert = () => {
    setCloseComponent(true)
  };

  const handleNavigateToProfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(navTo);
  };

  return (
  <div className={`alert-popup-container ${varaint} ${closeComponent ? 'd-none' : ''}`}>
      <div className="alert-leftPanel">
        <div className="contentIcon">
          <img src={IconsSet[varaint]} alt={varaint} />
        </div>
        <div className="contentDesc">
          <div className="contentTitle">{title}</div>
          <div className="contentMessage">{message}</div>
        </div>
      </div>
      <div className="alert-rightPanel">
        <div className="nav-button">
          <ThemeButton
            icon={true}
            variant={''}
            iconName="ArrowRightRed"
            iconPosition="right"
            title={buttonName}
            classes="button-text-medium walaa-medium-500"
            onClickhandler={handleNavigateToProfile}
          />
        </div>
      </div>
      <img src={closeIcon} alt="Close" className="closeEmailBoxIcon" onClick={closeAlert} />
    </div>
  );
};

export default AlertPopUp;