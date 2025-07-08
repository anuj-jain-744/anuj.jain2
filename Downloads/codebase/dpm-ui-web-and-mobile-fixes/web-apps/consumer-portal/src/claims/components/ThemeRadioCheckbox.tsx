import Form from "react-bootstrap/Form";

type ThemeRadioCheckboxType = {
  label: string;
  type: "radio" | "checkbox" | "switch";
  defaultChecked: boolean;
  classes: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  dataTestId?: string;
  isDisabled?: boolean;
};

function ThemeRadioCheckbox({
  label,
  type,
  defaultChecked,
  classes,
  onChangehandler,
  name,
  dataTestId,
  isDisabled,
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
      data-testid={dataTestId}
      disabled={isDisabled}
    />
  );
}

export default ThemeRadioCheckbox;
