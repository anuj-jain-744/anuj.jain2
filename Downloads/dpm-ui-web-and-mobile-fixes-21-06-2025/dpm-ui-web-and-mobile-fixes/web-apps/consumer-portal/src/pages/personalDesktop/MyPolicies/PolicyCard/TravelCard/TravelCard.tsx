import React from "react";
import Vector from "assets/Dashboard/TravelVector.svg";
import union from "assets/Dashboard/Union.svg";
import "./TravelCard.scss";
import ArrowRight from "assets/Dashboard/Arrow_Right.svg";
import TravelIcon from "assets/Dashboard/Travel-icon.svg";

interface TravelCardProps {
  title: string;
  description: string;
}

const TravelCard: React.FC<TravelCardProps> = ({ title, description }) => {
  return (
    <div className="travel-card-wrapper">
      <img src={Vector} className="vector-img" alt="vector-img"/>
      <img src={union} className="union-img" alt="union-img"/>
      <div className="card-content">
        <div className="left-section">
          <div className="title-text walaa-medium-500">{title}</div>
          <div className="description-text walaa-regular-400">
            <div className="description">{description}</div>
            <div className="arrow-icon"><img src={ArrowRight} alt="arrow-icon"/></div>
          </div>
        </div>
        <div className="right-section">
          <div className="icon-container"><img src={TravelIcon} alt="icon-container"/></div>
        </div>
      </div>
    </div>
  );
};

export default TravelCard;
