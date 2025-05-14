import React from "react";
import style from "./CameraAndSensor.module.scss";
import ToggleButton from "../ToggleButton/ToggleButton";
import { LanguageData } from "types/languageData";

interface CameraAndSensorProps {
  languageData: LanguageData | undefined | null;
  rearParkingSensor: boolean;
  setRearParkingSensor: (value: boolean) => void;
  frontSensor: boolean;
  setFrontSensor: (value: boolean) => void;
  frontCamera: boolean;
  setFrontCamera: (value: boolean) => void;
  rearCamera: boolean;
  setRearCamera: (value: boolean) => void;
  degreeCamera: boolean;
  setDegreeCamera: (value: boolean) => void;
}

const CameraAndSensor: React.FC<CameraAndSensorProps> = ({
  languageData,
  rearParkingSensor,
  setRearParkingSensor,
  frontSensor,
  setFrontSensor,
  frontCamera,
  setFrontCamera,
  rearCamera,
  setRearCamera,
  degreeCamera,
  setDegreeCamera,
}) => {
  return (
    <div className={style.container}>
      <div className={style.heading}>{languageData?.cameras_sensors}</div>
      <div className={style.row}>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.rear_parking_sensors}</div>
          </div>
          <ToggleButton
            isActive={rearParkingSensor}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setRearParkingSensor}
          />
        </div>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.front_sensors}</div>
          </div>
          <ToggleButton
            isActive={frontSensor}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setFrontSensor}
          />
        </div>
      </div>
      <div className={style.row}>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.front_camera}</div>
          </div>
          <ToggleButton
            isActive={frontCamera}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setFrontCamera}
          />
        </div>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.rear_camera}</div>
          </div>
          <ToggleButton
            isActive={rearCamera}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setRearCamera}
          />
        </div>
        <div className={style.rowContainer}>
          <div className={style.title}>
            <div className={style.titleText}>{languageData?.degree_camera}</div>
          </div>
          <ToggleButton
            isActive={degreeCamera}
            leftLabel={languageData?.yes}
            rightLabel={languageData?.no}
            onChange={setDegreeCamera}
          />
        </div>
      </div>
    </div>
  );
};

export default CameraAndSensor;