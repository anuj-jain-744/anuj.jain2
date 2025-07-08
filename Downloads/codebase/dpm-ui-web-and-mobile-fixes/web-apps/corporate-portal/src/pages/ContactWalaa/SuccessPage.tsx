import ThemeButton from "components/ThemeButton";
import React from "react";
import { Card } from "react-bootstrap";
import GreenSuccessIcon from "assets/contactWalaa/GreenSuccess.svg";
interface SucessPageProps {
  heading?: string;
  title?: string;
  description?: string;
  dashboardBtnLabel?: string;
  TicketBtnLabel?: string;
  handleDashboardButton?: () => void;
  handleTicketButton?: () => void;
}

const SucessPage: React.FC<SucessPageProps> = ({
  heading,
  title,
  description,
  dashboardBtnLabel = "",
  TicketBtnLabel = "",
  handleDashboardButton,
  handleTicketButton,
}) => {
  return (
    <div className="success-wrapper-box">
      <h4 className="head-text">{heading}</h4>
      <Card className="card-container">
        <img src={GreenSuccessIcon} />
        <h5 className="card-title">{title}</h5>
        <p>{description}</p>
        <div className="nav-footer">
          <ThemeButton
            handleClick={handleDashboardButton}
            className="left-btn"
            name={dashboardBtnLabel}
            type="button"
          />
          <ThemeButton
            handleClick={handleTicketButton}
            className="right-btn"
            name={TicketBtnLabel}
            type="button"
          />
        </div>
      </Card>
    </div>
  );
};

export default SucessPage;
