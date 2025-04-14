import { Form } from "react-bootstrap";

type ITextboxType = {
  type: "text" | "number" | "password" | "email" | "tel";
  title?: string;
  name: string;
  placeholder: string;
  isRequired?: boolean;
  onChangehandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurhandler?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?:string;
  errorMessage?: string;
};

function ThemeTextbox({
  type,
  title,
  name,
  placeholder,
  onChangehandler,
  onBlurhandler,
  value,
  isRequired,
  errorMessage
}: ITextboxType) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxLength = (type === "number" || type === "tel") ? 10 : 50;
    let inputValue = event.target.value;

    if (type === "number" || type === "tel") {
      // Remove non-numeric characters
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }

    if (inputValue.length <= maxLength) {
      event.target.value = inputValue;
      onChangehandler(event);
    }
  };
  
  return (
    <div className="input-text">
      {title && <label className="walaa-regular-400">{title}{isRequired && <span> *</span>}</label>}
      <Form.Control
        type={type === "number" ? 'tel' : type}
        placeholder={placeholder}
        className={`w-100 register-input  ${type==='number'?'noScroll':''}`}
        name={name}
        required={isRequired}
        onChange={handleChange}
        onBlur={onBlurhandler}
        value={value}
        min={0}
        maxLength={(type === "number" || type === "tel") ? 10 : 50} 
        max={9999999999}
      />
      {errorMessage && errorMessage !== "" && <span>{errorMessage}</span>}
    </div>
  );
}

export default ThemeTextbox;
