import React, { useContext, useState } from "react";
import { DataContext } from "../../../DataContext";
import VehicleInformation from "./VehicleInformation";
import AdditionalVehicle from "./AdditionalVehicle";
import CustomCardVehSequence from "./CustomCardVehSequence";
import { DummyText } from "../../../../src/utils/DummyText";

function ChangeVehicleInformation() {
  const [isVehicleSequenceChecked, setVehicleSequenceChecked] =
    useState<boolean>(true);
  const [isAddAdditionalVehicleChecked, setAddAdditionalVehicleChecked] =
    useState<boolean>(false);
  //cms content
  const Data = useContext(DataContext);

  //change handler return accept fn
  const updatedValue = (key: string, isChecked: boolean, name?: string) => {
    switch (key) {
      case "additional_vehicle":
        setAddAdditionalVehicleChecked(isChecked);
        setVehicleSequenceChecked(!isChecked);
        break;
      case "vehicle_sequence":
        setVehicleSequenceChecked(isChecked);
        setAddAdditionalVehicleChecked(!isChecked);
        break;
    }
  };

  return (
    <div className="left-card walaa-regular-400">
      <div className="header walaa-medium-500">
        <div className="header-body">{Data?.change_vehicle_information}</div>
      </div>
      <div className="header-border"></div>
      <div className="body">
        {/* row 1 */}
        <div className="row radio-btns gap-0">
          <div className="col">
            <div
              className={
                isVehicleSequenceChecked
                  ? "radio-btn-checked w-100"
                  : "radio-btn-unchecked w-100"
              }
            >
              <VehicleInformation
                iconName="recycle"
                titleText={Data?.change_from_custom_card_no}
                description={DummyText(0, 86)}
                // radiobtn properties
                radiokey="vehicle_sequence"
                isChecked={isVehicleSequenceChecked}
                radioLabel=""
                type="radio"
                name="VehicleInformation"
                onChangehandler={updatedValue}
              />
            </div>
          </div>
          <div className="col">
            <div
              className={
                isAddAdditionalVehicleChecked
                  ? "radio-btn-checked w-100"
                  : "radio-btn-unchecked w-100"
              }
            >
              <VehicleInformation
                iconName="add"
                titleText={Data?.add_additional_vehicle}
                description={DummyText(0, 86)}
                // radiobtn properties
                radiokey="additional_vehicle"
                isChecked={isAddAdditionalVehicleChecked}
                radioLabel=""
                type="radio"
                name="VehicleInformation"
                onChangehandler={updatedValue}
              />
            </div>
          </div>
        </div>
        {/* row 2 */}
        <div className="row radio-btns">
          <div className="col">
            {isAddAdditionalVehicleChecked ? (
              <AdditionalVehicle />
            ) : (
              <CustomCardVehSequence />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangeVehicleInformation;
