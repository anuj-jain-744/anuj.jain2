import React from "react";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import AddIcon from "@mui/icons-material/Add";
import ThemeRadioCheckbox from "../../../claims/components/ThemeRadioCheckbox";

interface IVehicleInformation {
  iconName: string;
  titleText: string;
  description: string;
  radioLabel: string;
  radiokey: string;
  name: string;
  isChecked: boolean;
  type: "radio";
  onChangehandler: (key: string, isChecked: boolean, name?: string) => void;
}

function VehicleInformation({
  iconName,
  description,
  radioLabel,
  radiokey,
  name,
  titleText,
  isChecked,
  type,
  onChangehandler,
}: IVehicleInformation) {
  function icnFactory(name: string) {
    const IcnListObj = {
      recycle: <PublishedWithChangesIcon />,
      add: <AddIcon />,
    };
    return IcnListObj[name];
  }

  //onchage handler
  const onChange = (event: React.FormEvent<HTMLDivElement>) => {
    const { defaultValue, checked, name, value } =
      event.target as HTMLInputElement;
    onChangehandler(radiokey, checked, name);
  };

  return (
    <React.Fragment>
      <div className="row w-100 vehicleinformation">
        <div className="col-xs-12 col-sm-12 col-md-2">
          {icnFactory(iconName)}
        </div>
        <div className="col-xs-12 col-sm-12 col-md-8 walaa-medium-500 titleText">
          {titleText}
        </div>
        <div className="col-xs-12 col-sm-12 col-md-1">
          <ThemeRadioCheckbox
            classes=""
            defaultChecked={isChecked}
            label={radioLabel}
            name={name}
            type={type}
            onChangehandler={onChange}
          />
        </div>
      </div>
      <div className="row w-100">
        <div className="col description">{description}</div>
      </div>
    </React.Fragment>
  );
}

export default VehicleInformation;
