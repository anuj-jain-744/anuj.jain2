import "./index.scss";
interface SwitchProps {
  isOn: boolean;
  handleToggle: () => void;
}
const Switch = ({ isOn, handleToggle,  }: SwitchProps) => {
    return (
      <>
        <input
          checked={isOn}
          onChange={handleToggle}
          className="switch-checkbox"
          id={`switch`}
          type="checkbox"
        />
        <label
          className={`switch-label ${isOn ? "background-grey" : "background-blue"}`}
          htmlFor={`switch`}
        >
          <span className={`switch-button`} />{" "}
        </label>
      </>
    );
  };
  
export default Switch;