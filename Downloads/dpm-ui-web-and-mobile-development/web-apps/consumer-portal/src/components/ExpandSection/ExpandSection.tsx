import React from "react";

import style from "./ExpandSection.module.scss";

interface ExpandSectionProps {
  text?: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

const ExpandSection: React.FC<ExpandSectionProps> = ({ onClick, text, icon }) => (
  <div className={style.container} onClick={onClick} role="button">
    <hr className={style.horizontalLine} />
    <div className={style.expandText}>
      <span className={style.expandText}>{text}</span>
      {icon && <span className={style.icon}>{icon}</span>}
    </div>
    <hr className={style.horizontalLine} />
  </div>
);

export default ExpandSection;
