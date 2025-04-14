import React from "react"
import Form from "react-bootstrap/Form"

type OptionType = {
  id?: string
  value?: Array<string>
  placeholder?: string
  classes: string
  onChangehandler?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  selectedValue?: string | number
}

function ThemeDropdown({
  id,
  value,
  placeholder = "Select",
  classes,
  onChangehandler,
  selectedValue,
}: Readonly<OptionType>) {
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
      {value?.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </Form.Select>
  )
}

export default ThemeDropdown