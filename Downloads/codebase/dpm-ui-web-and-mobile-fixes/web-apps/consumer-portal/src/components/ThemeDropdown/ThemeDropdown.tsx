import React, { useMemo } from "react";
import Form from "react-bootstrap/Form";
import { SelectOptions } from "types/global";

type OptionType = {
  id?: string;
  value?: Array<string> | SelectOptions;
  placeholder?: string;
  classes: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedValue?: string | number;
};

function ThemeDropdown({
  id,
  value,
  placeholder = "Select",
  classes,
  onChangehandler,
  selectedValue,
}: Readonly<OptionType>) {
  const options = useMemo(() => {
    let result: SelectOptions = [];
    if (Array.isArray(value) && value.length > 0) {
      if (value[0] instanceof Object) result = value as SelectOptions;
      else
        result = value.map((item) => ({
          label: item as string,
          value: item as string,
        }));
    }
    return result;
  }, [value]);
  return (
    <Form.Select
      id={id}
      data-testid={"theme-dropdown"}
      aria-label="Dropdown"
      onChange={onChangehandler}
      value={selectedValue || ""}
      className={classes}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </Form.Select>
  );
}

export default ThemeDropdown;
