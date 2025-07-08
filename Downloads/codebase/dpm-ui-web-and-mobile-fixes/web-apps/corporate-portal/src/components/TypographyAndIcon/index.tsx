import React from "react";

type ITypographyType = {
  text: string;
  isIcon?: boolean;
  iconclasses?: string;
  tooltip?: boolean;
  tooltipdataheader?: string;
  tooltipclasses?: string;
  required?: boolean;
};

export const TypographyAndIcon:React.FC<ITypographyType> = ({
  text,
  isIcon,
  iconclasses,
  tooltip,
  tooltipdataheader,
  tooltipclasses,
  required,
}) => {
  return (
    <span>
      <span>{text}&nbsp;</span>
      {required && <span style={{ color: "red" }}>*</span>}
    </span>
  )
}