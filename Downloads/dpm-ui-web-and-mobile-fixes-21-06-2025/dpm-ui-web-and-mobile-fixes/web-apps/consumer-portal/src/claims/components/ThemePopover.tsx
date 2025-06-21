import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReferenceTooltip from "../register/ReferenceTooltip";

type ITooltipType = {
  text?: string;
  iconclasses?: string;
  placement: "top" | "right" | "bottom" | "left";
  tooltipdataheader?: string;
  tooltipclasses?: string;
};

function ThemePopover({
  iconclasses,
  placement,
  tooltipclasses,
  tooltipdataheader,
}: ITooltipType) {
  const popover = (
    <Popover id="popover-basic" className={tooltipclasses}>
      {/* <Popover.Header as="h3" className="walaa-medium-500">{tooltipdataheader}</Popover.Header> */}
      <Popover.Body>
        <ReferenceTooltip />
      </Popover.Body>
    </Popover>
  );
  return (
    <OverlayTrigger key={placement} placement="bottom-start" overlay={popover}>
      <span className={iconclasses}>
        <InfoOutlinedIcon />
      </span>
    </OverlayTrigger>
  );
}

export default ThemePopover;
