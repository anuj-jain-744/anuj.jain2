import React from "react";
import Form from "react-bootstrap/Form";
interface ThemeSelectProps {
  options: {
    codeID: string;
    codeDesc: string;
  }[];
  placeholder: string;
  value: string;
  onChangehandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isRequired: boolean;
  fieldName: string;
  classes: string;
  label?: string;
}

function ThemeMasterSelect({
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
    <div className="container-form-select">
      {/* {label && <label className="walaa-regular-400">{label}{isRequired && <span> *</span>}</label>} */}
      <Form.Select
        value={value}
        onChange={onChangehandler}
        required={isRequired}
        name={fieldName}
        className={className}
      >
        {placeholder && <option disabled value="">{placeholder}</option>}
        {options && options.length > 0 && options.map((item, index) => (
          <option
            key={index}
            value={item.codeId}
          >
            {item.codeDesc}
          </option>

        ))}
      </Form.Select>
    </div>
  );
}

export default ThemeMasterSelect;