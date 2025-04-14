import React from "react";
import { IconsSet } from "utils/icons";
import { ContactWidgetProps } from "./types";

export const ContactWidget: React.FC<ContactWidgetProps> = ({
  contactItem,
}) => (
  <div className="article-dynamic-contact d-flex">
    {contactItem &&
      contactItem?.map(({ label, class: className, url }, index) => (
        <a className="d-flex" href={url} key={index}>
          <img src={IconsSet[className]} alt={label} />
          <span>{label}</span>
        </a>
      ))}
  </div>
);
