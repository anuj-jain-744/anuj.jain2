import Form from "react-bootstrap/Form";

type ThemeRadioCheckboxType = {
  label: string;
  type: "radio" | "checkbox" | "switch";
  defaultChecked: boolean;
  classes: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

function ThemeRadioCheckbox({
  label,
  type,
  defaultChecked,
  classes,
  onChangehandler,
  name,
}: ThemeRadioCheckboxType) {
  return (
    <Form.Check
      inline
      label={label}
      name={name ? name : "group1"}
      type={type}
      defaultChecked={defaultChecked}
      className={classes}
      onChange={onChangehandler}
      value={label}
    />
  );
}

export default ThemeRadioCheckbox;
