import React from "react";
import "./style.scss";
import { LanguageData } from "types/languageData";
import { IconsSet } from "@dpm/corporate-portal/src/utils/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@dpm/shared-module";

interface ContactCardProps {
  languageData?: LanguageData | undefined | null;
}

const ContactCard: React.FC<ContactCardProps> = () => {
  const navigate = useNavigate();
  const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const {languageData:headerMenuCmsDataDetails,languageSidebarData} = useSelector((state: RootState) => state.headerMenuLanguage);
  const cmsArray = headerMenuCmsDataDetails?.[4]?.childrens ?? [];

  const handleNavigate = (url: string) => {
    const isExternalUrl = url.includes("mailto") || url.includes("wa.me");
    if(isExternalUrl) {
      window.open(url, "_blank");
      return;
    }
    navigate(url);
  }

  const getPositionHelpSection = (indices: number[], cmsArray: any[]) => {
    const updatedCmsArray = indices.map(index => cmsArray[index]);
    return updatedCmsArray;
  };

  const indices = [4, 2, 1, 3, 0];
  const rearrangedCmsArray = isAuthenticated? languageSidebarData:  getPositionHelpSection(indices, cmsArray);
  return (
    <div className="contact-cards">
      <div className="contact-card-heads">
        {languageData?.please_get_in_touch_with_us}
      </div>
      <div className="shuffle-option-wrapper walaa-regular-400">

        {rearrangedCmsArray.map((child, index) => {
           if (isAuthenticated && index==5) {
            return (
              <div
                className="shuffle-card-headers"
                key={index}
                onClick={() => handleNavigate(child.menuUrl || "#")}
              >
                <div className="contact-view-style">
                  <small>{cmsArray[0]?.linkName.substr(0, 16)}</small> <br />
                  <span>{cmsArray[0]?.linkName.split(" ").splice(-1)}</span>
                </div>
              </div>
            );
          }

          else if(!isAuthenticated && index === 4) {
            return (
              <div
                className="shuffle-card-headers"
                key={index}
                onClick={() => handleNavigate(child.menuUrl || "#")}
              >
                <div className="contact-view-style">
                  <small>{cmsArray[0]?.linkName.substr(0, 16)}</small> <br />
                  <span>{cmsArray[0]?.linkName.split(" ").splice(-1)}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={index} data-testid="contact-menu-items" className="shuffle-card-content-items" onClick={() => handleNavigate(child.menuUrl || "#")}>
              <img src={IconsSet[child.attributes.class[0]]} alt="shuffle-icon" />
              <span>{child.linkName}</span>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default ContactCard;