import React from "react";
import Form from "react-bootstrap/Form";
import "./index.scss";

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
  errorMessage?: string;
  parentClasses?: string;
  maxLength?: number;
  handleOnBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  children?: React.ReactNode; // Allow icon/children rendering
};

function ThemeTextbox({
  type = "text",
  title,
  name,
  placeholder,
  onChangehandler,
  value,
  classes,
  disabled,
  selectedValue,
  onBlurHandler,
  errorMessage = "",
  parentClasses,
  children, // For icon/children rendering
  maxLength,
  handleOnBlur,
}: Readonly<ITextboxType>) {
  return (
    <div className={parentClasses ?? "w-100 theme-textbox-container"}>
      {title && <label htmlFor={name}>{title}</label>}
      <Form.Control
        type={type}
        as="input"
        name={name}
        placeholder={placeholder}
        className={`${classes} theme-textbox-input`}
        onChange={onChangehandler}
        value={selectedValue ? selectedValue : value}
        disabled={disabled}
        autoComplete="off"
        maxLength={maxLength}
        isInvalid={errorMessage !== ""}
        onBlur={(e) => {
          if (onBlurHandler && value && name) {
            onBlurHandler(value, name);
          } else if (handleOnBlur) {
            handleOnBlur(e as React.FocusEvent<HTMLInputElement>);
          } 
        }}
      />
      {errorMessage && <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>}
      {children && <div className="theme-textbox-icon">
        {children}
      </div>}
    </div>
  );
}

export default ThemeTextbox;