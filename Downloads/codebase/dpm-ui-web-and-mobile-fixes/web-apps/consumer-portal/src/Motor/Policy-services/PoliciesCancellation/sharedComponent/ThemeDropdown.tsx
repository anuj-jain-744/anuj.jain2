import React from "react";
import Form from "react-bootstrap/Form";

type OptionType = {
  id?: string;
  value?: Array<string> | string;
  placeholder?: string;
  classes: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

function ThemeDropdown({
  id,
  value,
  placeholder,
  classes,
  onChangehandler,
}: OptionType) {

  return (
    <Form.Select
      id={id}
      aria-label="Default select example"
      onChange={onChangehandler}
    >
      <option>Select</option>
      {Array.isArray(value) ? value.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      )) : null}
    </Form.Select>
  );
}

export default ThemeDropdown;
