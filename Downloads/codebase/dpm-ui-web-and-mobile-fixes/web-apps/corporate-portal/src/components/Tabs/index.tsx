import React from "react";
import { IconsSet } from "../../utils/icons";
import "./index.scss";

interface TabItem {
  class: string;
  name: string;
}

interface ActiveTabItem {
  index: number;
}

interface TabsProps {
  tabItems: TabItem[];
  activeTabItem: ActiveTabItem;
  handleSelectTab: (item: TabItem, index: number) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabItems,
  activeTabItem,
  handleSelectTab,
}) => {
  const { index } = activeTabItem;

  return (
    <div className="tab-wrapper">
      {tabItems.length > 0 &&
        tabItems.map((item, idx) => (
          <div
            className={`tab-item ${index === idx ? "active" : ""}`}
            key={idx}
            onClick={() => handleSelectTab(item, idx)}
            role="button" tabIndex={0} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSelectTab(item, idx)
              }
            }}
          >
            <img src={IconsSet[item.class]} alt="faq" className="tab-icon" />
            <span className="walaa-medium-500">{item.name}</span>
          </div>
        ))}
    </div>
  );
};
