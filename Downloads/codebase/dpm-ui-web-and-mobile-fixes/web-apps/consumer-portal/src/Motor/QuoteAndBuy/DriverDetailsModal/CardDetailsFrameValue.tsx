import React from "react";
import ThemeDropdown from "components/ThemeDropdown/ThemeDropdown";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import style from "./DriverDetailsModal.module.scss";

interface Props {
  label: string | undefined;
  type: "dropdown" | "textbox";
  value: string | string[] | number;
  selectedValue?: string | number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

const CardDetailsFrameValue: React.FC<Props> = ({ label, type, value, onChange, selectedValue }) => {
  return   (
    <div className={style.cardDetailsFrameValue}>
      <div className={style.cardDetailsFrameLabel}>{label}</div>
      {type === "dropdown" ? (
        <ThemeDropdown
                onChangehandler={onChange}
                value={value as string[]}
                classes={`form-select`}
                placeholder={'Select'}
                selectedValue={selectedValue}
            />
      ) : (
        <ThemeTextbox
          classes="form-control"
          type="text"
          value={selectedValue ?? value as string}
          onChangehandler={(event) => {
            const newValue = event.target.value;
            onChange({
              ...event,
              target: {
                ...event.target,
                value: newValue === "" ? '0' : String(newValue),
              },
            });
          }}
          name={""}
        />
      )}
    </div>
  );
}

export default CardDetailsFrameValue;