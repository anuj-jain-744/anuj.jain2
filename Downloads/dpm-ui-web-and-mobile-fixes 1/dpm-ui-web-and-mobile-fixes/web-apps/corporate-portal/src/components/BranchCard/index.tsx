import { useState, Fragment } from "react";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import "./index.scss";
import {
  BranchCardProps,
  CardTextProps,
  ContactNoProps,
  EmailProps,
  WorkingHourProps,
  WorkingDayProps,
} from "./types";

const BranchCard = ({
  children,
  activeCard = false,
  theme = "default",
}: BranchCardProps) => {
  return (
    <div className={`branch-card ${activeCard ? "active-card" : ""} ${theme}`}>
      {children}
    </div>
  );
};

const CardText = ({ text, className }: CardTextProps) => (
  <span className={`branch-card-text ${className}`}>{text}</span>
);

BranchCard.Title = ({ title }: { title: string }) => (
  <CardText
    text={title}
    className="walaa-medium-500 d-block branch-card-text-title"
  />
);

BranchCard.Subtitle = ({ subTitle }: { subTitle: string }) => (
  <CardText
    text={subTitle}
    className="walaa-medium-500 d-block branch-card-text-bold"
  />
);

BranchCard.Address = ({ address }: { address: string }) => (
  <CardText
    text={address}
    className="walaa-regular-400 d-block branch-card-text-light"
  />
);

BranchCard.ContactNo = ({ phone, contentCustomClass }: ContactNoProps) => (
  <Fragment>
    <CallOutlinedIcon />{" "}
    <CardText
      text={phone}
      className={`walaa-medium-500 ${
        contentCustomClass || ""
      } branch-card-text-bold`}
    />
  </Fragment>
);

BranchCard.Email = ({ email, contentCustomClass }: EmailProps) => (
  <Fragment>
    <EmailOutlinedIcon />{" "}
    <CardText
      text={email}
      className={`walaa-medium-500 ${
        contentCustomClass || ""
      } branch-card-text-bold`}
    />
  </Fragment>
);

BranchCard.WorkingHour = function CardWorkingHour({
  label = "Working Hours",
  presetDayData,
  completeDaydata,
}: WorkingHourProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="working-hours-wrapper" onClick={toggleExpand} data-testid="working-hour-wrapper">
      <div className="expand-wrapper">
        <span className="branch-card-text-light walaa-regular-400 d-block" data-testid="working-hour-title">
          {label}
        </span>
        {isExpanded ? (
          <ExpandLessIcon data-testid="expand-less-icon" />
        ) : (
          <ExpandMoreIcon data-testid="expand-more-icon" />
        )}
      </div>
      {presetDayData &&
        presetDayData.length > 0 &&
        presetDayData.map(({ day, workingHour }, index) => (
          <div key={index}>
            <AccessTimeIcon />{" "}
            <CardText
              text={`${day} : ${workingHour}`}
              className="walaa-medium-500 branch-card-text-bold"
            />
          </div>
        ))}
      <div className={`branch-expand ${isExpanded ? "expanded" : ""}`}>
        {completeDaydata &&
          completeDaydata.length > 0 &&
          completeDaydata.map(({ day, workingHour }, index) => (
            <span key={index} data-testid="expanded-content">
              {day} : {workingHour || "Not Open"}
              <br />
            </span>
          ))}
      </div>
    </div>
  );
};

BranchCard.WorkingDay = ({
  working_days,
  label = "Working Days",
}: WorkingDayProps) => (
  <div className="working-days-wrapper">
    <CardText
      text={label}
      className="walaa-regular-400 d-block branch-card-text-light"
    />
    <EventAvailableOutlinedIcon />{" "}
    <CardText
      text={working_days}
      className="walaa-medium-500 branch-card-text-bold"
    />
  </div>
);

export default BranchCard;
