import React from "react";
import "./style.scss";
import { LanguageData } from "types/languageData";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import { IconsSet } from "../../../../../../../corporate-portal/src/utils/icons";

interface ContactCardProps {
  languageData: LanguageData | undefined | null;
}

interface ChildMenu {
  linkName: string;
  menuUrl: string | null;
  link_content: string | null;
  attributes: {
    class: string[];
  };
}

interface Menu {
  linkName: string;
  childrens: ChildMenu[];
}

const ContactCard: React.FC<ContactCardProps> = () => {
  const { trackClaimInfo, contactData, handleNavigate } = useClaimContext();

  const contactUsMenu = (Array.isArray(contactData) && contactData.length > 0)
    ? (contactData.find((menu: Menu) => menu.linkName === "Contact Us") as Menu)
    : null;

  return (
    <div className="contact-card">
      <div className="contact-card-head">
        {trackClaimInfo?.contact_walaa}
      </div>
      <div className="shuffle-option-wrapper walaa-regular-400">
        {contactUsMenu?.childrens?.map((child, index) => {
          if (index === 0) {
            return (
              <React.Fragment key={child.menuUrl ?? index}>
                {child.link_content && (
                  <div
                    className="shuffle-card-header"
                    onClick={() => handleNavigate(child.menuUrl ?? "#")}
                    dangerouslySetInnerHTML={{ __html: child.link_content }}
                    role="button" tabIndex={0} onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNavigate(child.menuUrl ?? "#");
                      }
                    }}
                  ></div>
                )}
              </React.Fragment>
            );
          }
          return (
            <div
              key={child.menuUrl ?? index}
              data-testid="contact-menu-items"
              className="shuffle-card-content-item"
              onClick={() => handleNavigate(child.menuUrl ?? "#")}
              role="button" tabIndex={0} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNavigate(child.menuUrl ?? "#");
                }
              }}
            >
              <img
                src={IconsSet[child.attributes.class[0]] ?? ""}
                alt="shuffle-icon"
              />
              <span>{child.linkName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactCard;