import Form from "react-bootstrap/Form";
import "./index.scss";

interface ThemeSelectProps {
  options: {
    key: string;
    value: string;
  }[];
  placeholder: string;
  value: string;
  onChangehandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isRequired: boolean;
  fieldName: string;
  classes: string;
  label?: string;
}

function ThemeSelect({
  options,
  placeholder,
  value,
  isRequired,
  fieldName,
  onChangehandler,
  classes,
  label
}: ThemeSelectProps) {
  const className = `${classes ?? ""} dark-input-border`;

  return (
    <div>
      {label && <label className="walaa-regular-400">{label}{isRequired && <span> *</span>}</label>}
      <Form.Select
        value={value}
        onChange={onChangehandler}
        required={isRequired}
        name={fieldName}
        className={className}
      >
        {placeholder && <option disabled value="">{placeholder}</option>}
        {options && options.length > 0 && options.map((val: { key: string, value: string }, index: number) => (
          <option
            key={index}
            value={val?.key}
          >
            {val?.value}
          </option>

        ))}
      </Form.Select>
    </div>
  );
}

export default ThemeSelect;
