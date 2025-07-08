import React from "react";
import "./EnhanceExperience.scss";
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";

interface EnhanceExperienceProps {}

const EnhanceExperience: React.FC<EnhanceExperienceProps> = () => {
    const { languageData } = useSelector((state: RootState) => state.dashbaordLanguageData);
    const { languageData: footerLanguageData } = useSelector((state: RootState) => state.footerMenuLanguage);

    
    const footerData = footerLanguageData?.blocks?.download;
    const {title, data} = footerData  || {};

    return (
    <div className="enhance-experience-container">
      <div className="enhance-header">
        <div className="header-content">
          <div className="header-text">
            <div className="header-title walaa-medium-500">
              {languageData?.sidebar_image2_title}
            </div>
            <div className="header-description walaa-regular-400">
              {languageData?.sidebar_image2_desc}
            </div>
          </div>
        </div>
      </div>
      <div className="enhance-body">
        <div className="image-container">
          <img src={languageData?.sidebar_image2} alt="Sidebar image" />
        </div>
        <div className="download-container">
          <div className="download-section">
            <div className="download-title walaa-medium-500">{title}</div>
            <div className="app-store-links">
              <div className="app-store-item">
                <img src={(Array.isArray(data) && data.length > 1) && data[0]?.image} alt="Google Play" />
              </div>
              <div className="app-store-item">
                <img src={(Array.isArray(data) && data.length > 1) && data[1]?.image} alt="App Store" />
              </div>
              <div className="app-store-item">
                <img src={(Array.isArray(data) && data.length > 1) && data[2]?.image} alt="App Gallery" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhanceExperience;
