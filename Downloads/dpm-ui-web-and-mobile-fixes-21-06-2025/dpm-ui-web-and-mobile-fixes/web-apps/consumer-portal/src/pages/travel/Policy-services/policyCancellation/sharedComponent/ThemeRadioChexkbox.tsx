import Form from "react-bootstrap/Form";

type ThemeRadioCheckboxType = {
  label: string;
  type: "radio" | "checkbox" | "switch";
  defaultChecked?: boolean;
  classes: string;
  onChangehandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  htmlFor?:string;
  id?:string;
  value?:string;
  disabled?:boolean;
  checked?:boolean;
  datatestid?:string;
};

function ThemeRadioCheckbox({
  label,
  type,
  defaultChecked,
  classes,
  onChangehandler,
  value,
  name,
  id,
  disabled,
  checked,
  datatestid,
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
      value={value}
      id={id}
      disabled={disabled}
      checked={checked}
      data-testid={datatestid}
      
      
    />
  );
}

export default ThemeRadioCheckbox;
