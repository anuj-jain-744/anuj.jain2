import React from "react";
import Vector from "assets/Dashboard/HappyCardVector.svg";
import union from "assets/Dashboard/Union.svg";
import logo from "assets/Dashboard/Walaa_logo_video.mp4";
import "./HappyCard.scss";

interface HappyCardProps {
  title: string;
  description: string;
}

const HappyCard: React.FC<HappyCardProps> = ({ title, description }) => {
  return (
    <div className="happy-card-container">
      <div className="happy-card">
        <div className="happy">
          <video className="happy-logo-video" data-testid="happy-video" autoPlay loop muted>
            <source src={logo} type="video/mp4" />
          </video>
        </div>
        <img className="happy-vector" src={Vector} alt="happy-vector"/>
        <div className="happy-trust walaa-medium-500">{title}
        </div>
        <img className='happy-union' src={union} alt="happy-union"/>
      </div>
    </div>
  );
};

export default HappyCard;
