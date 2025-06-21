import React from "react";
import style from "./DriverDetailsModal.module.scss";
import CardDetailsFrameValue from "./CardDetailsFrameValue";

interface Props {
  frameValues: {
    label: string | undefined;
    type: "dropdown" | "textbox";
    value: string | string[];
    selectedValue?: string | number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  }[];
}

const CardDetailsFrame: React.FC<Props> = ({ frameValues }) => {
  
  return (
    <div className={style.cardDetailsFrame}>
      {frameValues.map((frameValue, index) => (
        <CardDetailsFrameValue key={index} {...frameValue} />
      ))}
    </div>
  );
}

export default CardDetailsFrame;