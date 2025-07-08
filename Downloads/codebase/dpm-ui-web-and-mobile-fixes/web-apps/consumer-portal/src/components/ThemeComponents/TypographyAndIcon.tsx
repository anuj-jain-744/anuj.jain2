import ThemePopover from "./ThemePopover";
type ITypographyType = {
  text: string;
  isIcon?: boolean;
  iconclasses?: string;
  tooltip?: boolean;
  tooltipdataheader?: string;
  tooltipclasses?: string;
  required?: boolean;
};
function TypographyAndIcon({
  text,
  isIcon,
  iconclasses,
  tooltip,
  tooltipdataheader,
  tooltipclasses,
  required,
}: ITypographyType) {
  return (
    <span>
      <span>{text}&nbsp;</span>
      {required && <span style={{ color: "red" }}>*</span>}
      {isIcon && (
        <span>
          {tooltip && (
            <ThemePopover
              iconclasses={iconclasses}
              placement="bottom"
              tooltipdataheader={tooltipdataheader}
              tooltipclasses={tooltipclasses}
            />
          )}
        </span>
      )}
    </span>
  );
}

export default TypographyAndIcon;
