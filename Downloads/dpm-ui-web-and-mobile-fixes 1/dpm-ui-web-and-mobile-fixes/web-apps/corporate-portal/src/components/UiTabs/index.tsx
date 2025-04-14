import React, { useState } from "react";
import "./index.scss";

interface Tab {
  webform_name: string;
}

interface UiTabsProps {
  tabsData: Tab[];
  activeTab: number;
  setActiveTab: (val:number) => void;
}

export const UiTabs: React.FC<UiTabsProps> = ({ tabsData, activeTab, setActiveTab }): JSX.Element => {

  const handleTabClick = (tabName: number) => {
    setActiveTab(tabName);
  };

  return (
    <div className="tabs-rounded-tabs">
      {tabsData.map((tab, index) => (
        <div 
          key={tab.webform_name}
          className={`tab-wrapper ${activeTab === index ? "selected" : ""}`} 
          onClick={() => handleTabClick(index)}
          role="button"
          tabIndex={0}
        >
          <div className="tab">{tab.webform_name}</div>
        </div>
      ))}
    </div>
  );
};
