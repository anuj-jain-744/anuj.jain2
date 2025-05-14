import "./index.scss";

interface ThemeSwitchProps {
  isChecked: boolean;
  classes: string;
  onChangehandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fieldName: string;
  isRequired: boolean;
}
export default function ThemeSwitch({
  isChecked,
  classes,
  onChangehandler,
  fieldName,
  isRequired
}: ThemeSwitchProps) {
  return (
    <label className="switch">
      <input
        className={classes}
        type="checkbox"
        checked={isChecked}
        required={isRequired}
        name={fieldName}
        onChange={onChangehandler}
      />
      <span className="slider"></span>
    </label>
  )
}