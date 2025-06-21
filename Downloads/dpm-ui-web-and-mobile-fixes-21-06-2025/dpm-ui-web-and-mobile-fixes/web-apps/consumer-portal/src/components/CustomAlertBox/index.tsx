import { FC, ReactNode } from "react";
import { WarningIcon } from "assets/CommonSVG";
import "./index.scss";

interface CustomAlertBoxProps {
  variant: string;
  children: ReactNode;
}

const CustomAlertBox: FC<CustomAlertBoxProps> = ({ variant, children }) => {
  return (
    <div className={`custom-alert-wrapper d-flex ${variant}`}>
      <img src={WarningIcon} className="alert-icon" />
      <div className="alert-content">{children}</div>
    </div>
  );
};

export default CustomAlertBox;