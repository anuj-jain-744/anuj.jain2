import React from "react";
import style from "./CommercialVehicle.module.scss";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import ToggleButton from "../ToggleButton/ToggleButton";
import { LanguageData } from "types/languageData";

interface CommercialVehicleProps {
  languageData: LanguageData | undefined | null;
  vehicleAxleWeight: string | number;
  setVehicleAxleWeight: any;
  isFireExtinguisher: boolean;
  setIsFireExtinguisher: (value: boolean) => void;

}

const CommercialVehicle: React.FC<CommercialVehicleProps> = ({
  languageData,
  vehicleAxleWeight,
  setVehicleAxleWeight,
  isFireExtinguisher,
  setIsFireExtinguisher
}) => {
  const handleTextBoxChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setVehicleAxleWeight(value);
  };
  return (
    <div className={style.container}>
      <div className={style.heading}>{languageData?.commercial_vehicle}</div>
      <div className={style.row}>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.vehicle_axle_weight}</div>
          </div>
          <ThemeTextbox
            classes="form-control"
            type="text"
            value={vehicleAxleWeight}
            onChangehandler={(event) => handleTextBoxChange(event)}
            name={""}
          />
        </div>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.fire_extinguisher}</div>
          </div>
          <ToggleButton
            isActive={isFireExtinguisher}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setIsFireExtinguisher}
          />
        </div>
      </div>
    </div>
  );
};

export default CommercialVehicle;
