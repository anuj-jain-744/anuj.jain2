import React, { ReactNode } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IconsSet } from "utils/icons";
import "./index.scss";

interface HighlighterWidgetProps {
  children: ReactNode;
  title: string;
  iconsClass: string;
}

interface CardContentProps {
  label: string;
  Icon?: React.ComponentType;
  details: string;
  infoWindow?: boolean;
}

// HighlighterWidget component
export const HighlighterWidget: React.FC<HighlighterWidgetProps> & {
  CardContent: React.FC<CardContentProps>;
  ContentSeparator: React.FC;
} = ({ children, title, iconsClass }) => {
  return (
    <div className="highlighter-widget-wrapper d-flex">
      <div className="icon-wrapper">
        <img src={IconsSet[iconsClass]} alt={title} />
      </div>
      <div className="d-flex child-outer-wrapper">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
};

// CardContent component
const CardContent: React.FC<CardContentProps> = ({
  label,
  Icon,
  details,
  infoWindow,
}) => (
  <div className="child-inner-wrapper d-flex">
    <span className="label">{label}</span>
    <div className="description-wrapper d-flex">
      {Icon && <Icon />}
      <span className="details">{details}</span>
      {infoWindow && <InfoOutlinedIcon />}
    </div>
  </div>
);

// ContentSeparator component
const ContentSeparator: React.FC = () => (
  <div className="content-separator-wrapper" />
);

// Attach CardContent and ContentSeparator to HighlighterWidget
HighlighterWidget.CardContent = CardContent;
HighlighterWidget.ContentSeparator = ContentSeparator;
