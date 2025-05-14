import React from "react";
import Form from "react-bootstrap/Form";

type ITextboxType = {
  type?: "text" | "number" | "password";
  title?: string;
  name: string;
  placeholder?: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  classes?: string;
  disabled?: boolean;
  selectedValue?: string | number;
  onBlurHandler?: (val: string | number, name: string) => void;
};

function ThemeTextbox({
  type,
  title,
  name,
  placeholder,
  onChangehandler,
  value,
  classes,
  disabled,
  selectedValue,
  onBlurHandler,
}: ITextboxType) {
  return (
    <Form.Control
      as="input"
      placeholder={placeholder}
      className={classes}
      onChange={onChangehandler}
      value={selectedValue ? selectedValue : value}
      disabled={disabled}
      onBlur={() => {
        if(onBlurHandler && value && name) {
          onBlurHandler(value, name)
        }
      }}
    />
  );
}

export default ThemeTextbox;
