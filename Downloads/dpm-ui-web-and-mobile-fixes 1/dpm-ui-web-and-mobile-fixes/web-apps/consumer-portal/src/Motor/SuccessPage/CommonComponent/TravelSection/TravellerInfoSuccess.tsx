import React from "react";
import Line from "assets/SuccessPage/Line_new.svg";
import "./style.scss";
import { LanguageData } from "types/languageData";
import Travel from "assets/Dashboard/Travel.svg";

interface TravellerInfoSuccessProps {
  travellerType: string | null;
  noOfTravellers: number;
  languageData: LanguageData
}

const TravellerInfoSuccess: React.FC<TravellerInfoSuccessProps> = ({
  travellerType,
  noOfTravellers,
  languageData
}) => (
  <div className="travel-card-for-travel-section">
    <div className="body-content-for-travel-section">
      <div className="top-table">
        <div className="box">
          <div className="box-content">
            {/* adding image for travel section  */}
          <img src={Travel} /> 
            <div className="package-content">              
              <div className="package-heading walaa-regular-400">              
                {languageData?.travellerType}
              </div>
              <div className="package-value walaa-medium-500">
                {travellerType || ""}
              </div>
            </div>
            <div>
              <img src={Line} />
            </div>
            <div className="package-content-2">
              <div className="package-heading walaa-regular-400">
                {languageData?.noOfTravellers}
              </div>
              <div className="package-value walaa-medium-500">
                {noOfTravellers || ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TravellerInfoSuccess;
