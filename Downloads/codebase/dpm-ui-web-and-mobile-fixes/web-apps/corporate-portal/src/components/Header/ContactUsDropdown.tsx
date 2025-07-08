import React from "react";
import { sanitizeHtml } from "@dpm/shared-module";

import { IconsSet } from "../../utils/icons";

interface ContactUsDropdownProps {
  attributes: {
    class: string[];
  };
  link_content: string;
  idx: number;
  menuUrl: string;
  linkName: string;
  navigateTo: (url: string) => void;
}

const ContactUsDropdown: React.FC<ContactUsDropdownProps> = ({
  attributes,
  link_content,
  idx,
  menuUrl,
  linkName,
  navigateTo
}) => {
  const sanitizedContent = sanitizeHtml(link_content);

  return (
    <React.Fragment>
      {attributes?.class[0] === "call" ? (
        <div
          className="shuffle-card-header"
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />
      ) : (
        <div
          className="shuffle-card-content-item"
          key={idx}
          onClick={() => navigateTo(menuUrl)}
          role="button" tabIndex={0} onKeyDown={(e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                navigateTo(menuUrl);
            }
        }}
        >
          <img src={IconsSet[attributes.class[0]]} alt="shuffle-icon" />
          <span>{linkName}</span>
        </div>
      )}
    </React.Fragment>
  );
};

export default ContactUsDropdown;