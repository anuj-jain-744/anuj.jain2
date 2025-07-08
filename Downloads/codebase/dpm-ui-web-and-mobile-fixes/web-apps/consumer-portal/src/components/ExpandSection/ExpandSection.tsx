import React from "react";

import style from "./ExpandSection.module.scss";
import downArrow from "assets/Dashboard/Chevron Down.svg";

interface ExpandSectionProps {
  text?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  showDownArrow?: boolean;
}

const ExpandSection: React.FC<ExpandSectionProps> = ({ onClick, text, icon, showDownArrow = false }) => (
  <div className={style.container} onClick={onClick} tabIndex={0} role="button">
    <hr className={style.horizontalLine} />
    <div className={style.expandText}>
      <span className={style.expandText}>{text}</span>
      {icon && <span className={style.icon}>{icon}</span>}
      {showDownArrow && <span className={style.icon}><img
        src={downArrow}
        alt="Down Arrow"
      /></span>}
    </div>
    <hr className={style.horizontalLine} />
  </div>
);

export default ExpandSection;
