import React from "react";
import TypographyAndIcon from "components/ThemeComponents/TypographyAndIcon";
import "./style.scss";
import Done_Icon from "assets/QuoteAndBuy/Done_Icon.svg";

interface IListItemIcon {
  title: string;
}
const ListItemIcon: React.FC<IListItemIcon> = ({ title }) => {
  return (
    <React.Fragment>
      <div className="list-item-icn pe-1">
        <img src={Done_Icon} alt="check icon" />
      </div>
      <div className="list-item-sub-title">
        <TypographyAndIcon text={title} />
      </div>
    </React.Fragment>
  );
};

export default ListItemIcon;
