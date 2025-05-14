import React, { useState } from "react";
import { IconsSet } from "utils/icons";
import ThemeButton from "components/ThemeButton/ThemeButton";
import closeIcon from 'assets/AlertIcon/closeIcon.svg';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
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

  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);

  const closeAlert = () => {
    setCloseComponent(true)
  };

  const handleNavigateToProfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(navTo);
  };

  return (
  <div className={`alert-popup-container ${varaint} ${closeComponent ? 'd-none' : ''}`} role="alert">
    <div className="alert-container">
      <div className="alert-left-panel">
        <div className="content-icon">
          <img src={IconsSet[varaint]} alt={varaint} />
        </div>
      </div>
      <div className="alert-right-panel">
        <div className="content-title walaa-medium-500">{languageData?.add_your_email_id_to_the_profile}</div>
        <div className="content-message walaa-regular-400">{languageData?.please_add_your_email_id}</div>
        <div className="nav-button">
          <ThemeButton
            icon={true}
            variant={'addEmail'}
            iconName="ArrowRightRed"
            iconPosition="right"
            title={buttonName}
            classes="walaa-medium-500"
            onClickhandler={handleNavigateToProfile}
          />
        </div>
      </div>
      </div>
      <img src={closeIcon} alt="Close" className="close-email-box-icon" onClick={closeAlert} />
    </div>
  );
};

export default AlertPopUp;