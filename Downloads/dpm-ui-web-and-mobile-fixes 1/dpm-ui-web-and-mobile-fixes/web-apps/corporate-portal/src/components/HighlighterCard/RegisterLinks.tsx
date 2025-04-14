import React from "react";
import { Button } from "react-bootstrap";

export interface CardContentProps {
  register_label: string;
  indvidual_button_link: string;
  enterprise_button_link: string;
  indvidual_button_text: string;
  enterprise_button_text: string;
}

interface RegisterLinkProps {
  cardContent: CardContentProps;
  navigateTo: (url: string) => void;
}

const RegisterLink: React.FC<RegisterLinkProps> = ({ cardContent, navigateTo }) => {
  const {
    register_label,
    indvidual_button_link,
    enterprise_button_link,
    indvidual_button_text,
    enterprise_button_text,
  } = cardContent;

  return (
    <div className="register-wrapper">
      <p className="walaa-medium-500">{register_label}</p>
      <div className="blue-button-grp">
        <Button
          className="walaa-medium-500 action-button"
          onClick={() => navigateTo(indvidual_button_link)}
        >
          {indvidual_button_text}
        </Button>
        <Button
          className="walaa-medium-500 action-button"
          onClick={() => navigateTo(enterprise_button_link)}
        >
          {enterprise_button_text}
        </Button>
      </div>
    </div>
  );
};

export default RegisterLink;