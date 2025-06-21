import Form from "react-bootstrap/Form";

type ThemeRadioCheckboxType = {
  label: string;
  type: "radio" | "checkbox" | "switch";
  defaultChecked?: boolean;
  checked?: boolean;
  classes: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  isDisabled?: boolean;
};

function ThemeRadioCheckbox({
  label,
  type,
  defaultChecked,
  checked,
  classes,
  onChangehandler,
  name,
  isDisabled = false
}: ThemeRadioCheckboxType) {
  return (
    <Form.Check
      inline
      label={label}
      name={name ? name : "group1"}
      type={type}
      defaultChecked={defaultChecked}
      checked={checked}
      className={classes}
      onChange={onChangehandler}
      value={label}
      disabled={isDisabled}
    />
  );
}

export default ThemeRadioCheckbox;
