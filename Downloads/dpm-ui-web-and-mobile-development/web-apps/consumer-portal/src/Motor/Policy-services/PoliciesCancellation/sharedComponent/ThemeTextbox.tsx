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
  onKeyPress: (e: any) => void;
  maxlength?: number;
  dataTestId?: string;
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
  onKeyPress,
  maxlength,
  dataTestId
}: ITextboxType) {
  return (
    <Form.Control
      as="input"
      placeholder={placeholder}
      className={classes}
      onChange={onChangehandler}
      value={selectedValue ? selectedValue : value}
      disabled={disabled}
      onKeyUp={onKeyPress}
      onKeyDown={onKeyPress}
      maxLength={maxlength}
      onBlur={() => {
        if (onBlurHandler && value && name) {
          onBlurHandler(value, name);
        }
      }}
      data-testid={dataTestId}
    />
  );
}

export default ThemeTextbox;
