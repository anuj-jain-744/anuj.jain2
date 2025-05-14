import React from "react";
import ThemeMasterSelect from "components/ThemeComponents/ThemeMasterSelect";
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
      {value && type === "dropdown" ? (
        <ThemeMasterSelect
          options={ value}
          placeholder={'Select'}
          value={selectedValue}
          isRequired={true}
          fieldName={label}
          onChangehandler={onChange}
          classes={`form-select`}
          label={label}
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