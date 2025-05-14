import React from "react";
import "./index.scss";

interface Tab {
  webform_name: string;
}

interface SwitchTabsProps {
  tabsData: Tab[];
  activeTab: { activeIndex: number; activelabel: string };
  setActiveTab: (val: number, label: string) => void;
}

export const SwitchTabs: React.FC<SwitchTabsProps> = ({
  tabsData,
  activeTab,
  setActiveTab,
}): JSX.Element => {
  const handleTabClick = (tabName: number, label: string) => {
    setActiveTab(tabName, label);
  };
  const { activeIndex, activelabel } = activeTab;
  return (
    <div className="shared-tabs-wrapper">
      {tabsData.map((tab, index) => (
        <div
          key={index}
          className={`tab-wrapper ${
            activeIndex === index || activelabel === tab.webform_name
              ? "selected"
              : ""
          }`}
          onClick={() => handleTabClick(index, tab.webform_name)}
          role="button"
          tabIndex={0}
        >
          <div className="tab walaa-medium-500">{tab.webform_name}</div>
        </div>
      ))}
    </div>
  );
};
