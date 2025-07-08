import ThemeButton from "components/ThemeButton";
import React from "react";
import { Card } from "react-bootstrap";
import GreenSuccessIcon from "assets/contactWalaa/GreenSuccess.svg";
import { useLocation } from 'react-router-dom';
import "./index.scss";


function SucessPage() {
  const location = useLocation();
  const state = location.state;

  const handleDashboardButton = () => { 
    window.location.href = "/careers";
  }
  
  return (
    <div className="success-wrapper-box1">
      <h4 className="head-text1">{location?.state?.common_lables?.thankyou_title}</h4>
      <Card className="card-container">
        <img src={GreenSuccessIcon} />
        <h5 className="card-title">{location?.state?.common_lables?.application_submitted}</h5>
        <p className="paragraph-text">{location?.state?.common_lables?.thankyou_description}</p>
        <p className="paragraph-text1">{location?.state?.common_lables?.thankyou_description2}</p>
        <div className="nav-footer">
          <ThemeButton
            handleClick={handleDashboardButton}
            className="left-btn"
            name={location?.state?.common_lables?.thankyou_button_text}
            type="button"
          />
        </div>
      </Card>
    </div>
  );
};

export default SucessPage;
