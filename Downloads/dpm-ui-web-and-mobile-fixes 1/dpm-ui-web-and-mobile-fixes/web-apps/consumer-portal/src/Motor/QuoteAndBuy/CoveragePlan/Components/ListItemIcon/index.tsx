import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import "./style.scss";

interface IListItemIcon {
  title: string;
}
const ListItemIcon: React.FC<IListItemIcon> = ({ title }) => {
  return (
    <React.Fragment>
      <div className="list-item-icn pe-1">
        <DoneIcon color="success" />
      </div>
      <div className="list-item-sub-title">
        <TypographyAndIcon text={title} />
      </div>
    </React.Fragment>
  );
};

export default ListItemIcon;
