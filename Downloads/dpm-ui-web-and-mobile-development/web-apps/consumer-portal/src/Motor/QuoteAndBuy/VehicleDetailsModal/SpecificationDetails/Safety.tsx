import React from "react";
import style from "./Safety.module.scss";
import ThemeDropdown from "components/ThemeDropdown/ThemeDropdown";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import ToggleButton from "../ToggleButton/ToggleButton";
import { LanguageData } from "types/languageData";

interface SafetyProps {
  languageData: LanguageData | undefined | null;
  parkingValue: string;
  setParkingValue: (value: string) => void;
  antiTheftAlarmValue: string;
  setAntiTheftAlarmValue: (value: string) => void;
  antiLockBrakingSystemValue: number | string;
  setAntiLockBrakingSystemValue: (value: number | string) => void;
  isAutomaticBrakingSystem: boolean;
  setIsAutomaticBrakingSystem: (value: boolean) => void;
}

const Safety: React.FC<SafetyProps> = ({
  languageData,
  parkingValue,
  setParkingValue,
  antiTheftAlarmValue,
  setAntiTheftAlarmValue,
  antiLockBrakingSystemValue,
  setAntiLockBrakingSystemValue,
  isAutomaticBrakingSystem,
  setIsAutomaticBrakingSystem
}) => {
  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setParkingValue(value);
  };

  const handleAntiTheftAlarmChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setAntiTheftAlarmValue(value);
  };

  const handleTextBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setAntiLockBrakingSystemValue(value);
  };

  const parking = ['Street', 'HomeLane', 'Garage'];
  const antiTheftAlarm = ['Not Working', 'Working'];

  return (
    <div className={style.container}>
      <div className={style.heading}>{languageData?.safety}</div>
      <div className={style.row}>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.parking}</div>
          </div>
          <ThemeDropdown
            id="parking-dropdown"
            value={parking}
            classes={`form-select`}
            onChangehandler={handleDropdownChange}
            placeholder={'Select'}
            selectedValue={parkingValue}
          />
        </div>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.anti_theft_alarm}</div>
          </div>
          <ThemeDropdown
            id="anti-theft-alarm-dropdown"
            value={antiTheftAlarm}
            classes={`form-select`}
            onChangehandler={handleAntiTheftAlarmChange}
            placeholder={'Select'}
            selectedValue={antiTheftAlarmValue}
          />
        </div>
      </div>
      <div className={style.rowCenter}>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.anti_lock_braking_system}</div>
          </div>
          <ThemeTextbox
            classes="form-control"
            type="text"
            value={antiLockBrakingSystemValue}
            onChangehandler={handleTextBoxChange}
            name={""}
          />
        </div>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.automatic_braking_system}</div>
          </div>
          <ToggleButton
            isActive={isAutomaticBrakingSystem}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setIsAutomaticBrakingSystem}
          />
        </div>
      </div>
    </div>
  );
};

export default Safety;