import React from "react";

import style from "./ExpandSection.module.scss";

interface ExpandSectionProps {
  text?: string;
  onClick: () => void;
}

const ExpandSection: React.FC<ExpandSectionProps> = ({ onClick, text }) => (
  <div className={style.container} onClick={onClick}>
    <hr className={style.horizontalLine} />
    <div className={style.expandText}>{text}</div>
    <hr className={style.horizontalLine} />
  </div>
);

export default ExpandSection;
