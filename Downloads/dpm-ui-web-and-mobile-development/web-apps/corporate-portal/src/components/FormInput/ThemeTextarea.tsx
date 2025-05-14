import Form from "react-bootstrap/Form";
import "./index.scss";

type ITextareaType = {
  placeholder: string;
  classes?: string;
  title?: string;
  value?: string;
  name?: string;
  isRequired?: boolean;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function ThemeTextarea({
  placeholder,
  title,
  name,
  value,
  classes,
  isRequired,
  onChangehandler,
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
        maxLength={500}
      />
    </div>
  );
}

export default ThemeTextarea;
