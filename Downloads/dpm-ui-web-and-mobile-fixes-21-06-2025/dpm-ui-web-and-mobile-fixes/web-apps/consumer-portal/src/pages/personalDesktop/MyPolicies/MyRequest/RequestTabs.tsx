import React from "react";
import ThemeButton from "components/ThemeButton/ThemeButton";
import { LanguageData } from "types/languageData";
import { REQUEST_TYPES } from 'constant';

interface RequestTabsProps {
  activeTab: string;
  handleTabClick: (tabType: string) => void;
  isTabDisabled: (tabType: string) => boolean;
  languageData: LanguageData;
}

const RequestTabs: React.FC<RequestTabsProps> = ({
  activeTab,
  handleTabClick,
  isTabDisabled,
  languageData
}) => {
  const tabs = [
    { type: REQUEST_TYPES.ALL, title: languageData?.all },
    { type: REQUEST_TYPES.CLAIM, title: languageData?.claim },
    { type: REQUEST_TYPES.ENQUIRY, title: languageData?.enquiry },
    { type: REQUEST_TYPES.APPROVAL, title: languageData?.approval },
    { type: REQUEST_TYPES.CANCELLATION, title: languageData?.cancellation },
    { type: REQUEST_TYPES.QUOTATION, title: languageData?.quotation },
    { type: REQUEST_TYPES.ENDORSEMENT, title: languageData?.endorsement },
  ];

  return (
    <div className="my-request-tabs">
      <div className="single-tab">
        {tabs.map((tab) => (
          <ThemeButton
            key={tab.type}
            title={tab.title}
            variant={isTabDisabled(tab.type) ? "filterBtnsDisabled" : activeTab === tab.type ? "filterBtnsActive" : "filterBtnsInactive"}
            classes={"btns-content walaa-medium-500"}
            onClickhandler={() => handleTabClick(tab.type)}
            isDisabled={isTabDisabled(tab.type)}
          />
        ))}
        <div className="tab-btns"></div>
      </div>
    </div>
  );
};

export default RequestTabs;