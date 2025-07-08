import React from "react";
import "./index.scss";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import { TravelData } from "types/languageData";

interface ChoosePlanProps {
  choosePlanData: TravelData;
}

const ChoosePlan: React.FC<ChoosePlanProps> = ({
  choosePlanData

}) => {



  return (
    <div className="choose-plan-container">
      <div className="choose-icon-container">

      <GppMaybeOutlinedIcon className="choose-icon" data-testid="choose-plan-img" />
      </div>
      <div className="col-md-12 text-container">
        <h2 className="choose-plan-heading">{choosePlanData.choose_your_plan_heading}</h2>
        <p className="choose-plan-description">{choosePlanData.choose_your_plan_description}</p>
      </div>
    </div>

  );
};

export default ChoosePlan;
