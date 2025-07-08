import Form from "react-bootstrap/Form";
import "./index.scss";
import { FocusEventHandler } from "react";

type ITextareaType = {
  placeholder: string;
  classes?: string;
  title?: string;
  value?: string;
  name?: string;
  isRequired?: boolean;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurhandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
};

function ThemeTextarea({
  placeholder,
  title,
  name,
  value,
  classes,
  isRequired,
  onChangehandler,
  onBlurhandler, 
  errorMessage
}: ITextareaType) {
  const className = `${classes ?? ""} dark-input-border`;
  return (
    <div className="input-textarea">
      {title && <label className="walaa-regular-400">{title}{isRequired && <span> *</span>}</label>}
      <Form.Control
        name={name}
        rows={3}
        as="textarea"
        required={isRequired}
        value={value}
        placeholder={placeholder}
        className={className}
        onChange={onChangehandler}
        onBlur={onBlurhandler as FocusEventHandler<FormControlElement>}
        maxLength={500}
      />
      {errorMessage && errorMessage !== "" && <span>{errorMessage}</span>}
    </div>
  );
}

export default ThemeTextarea;
