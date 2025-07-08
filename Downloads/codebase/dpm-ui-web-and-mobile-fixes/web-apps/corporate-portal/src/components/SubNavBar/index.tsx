import React, { useState } from "react";
import { animated } from "@react-spring/web";
import {productIDs } from "../../../../corporate-portal/src/constant";
import {createTableSpring} from "../../utils/createTableSpring";
import {scrollToElement} from "@dpm/shared-module";
import "./index.scss";

interface SubNavBarWidgetProps {
  content: any;
  isVisible?: boolean;
  hasGetQuoteWidget?: boolean;
}

export const SubNavBar: React.FC<SubNavBarWidgetProps> = ({ content = [],isVisible=false,hasGetQuoteWidget }) => {
  const [activeTab, setActiveTab] = useState<string | number>(0);

  const springs = createTableSpring(
    isVisible,
    "translateX(100%) translateY(-50%)",
    "translateX(100%) translateY(-50%)",
    500
  );
  // Handle tab click
  const handleTabClick = (tabIndex: string  | number) => {
    setActiveTab(tabIndex);
    scrollToElement(`productToggle-${tabIndex}`, -90);
  };
  return (
    <div className={`tab-buttons-product ${hasGetQuoteWidget ? "getQuoteWidget" : ""}`}>
      <div className="tab-mid">
        {content &&
           content.map((menu: any, index: number) => {
          const menuId = menu?.value.toLowerCase() === productIDs.services || menu?.value.toLowerCase() === productIDs.faqs ? menu?.value.toLowerCase() : index;
          return (
            <div
              key={index}
              data-testid={`productToggle-${menuId}`}
              onClick={() => handleTabClick(menuId)}
              className={`${activeTab === menuId ? "active" : ""} tab-list`}
              role="button" tabIndex={0} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTabClick(menuId)
                }
              }}
            >
              <animated.div style={isVisible ? springs : {}}>
                {menu?.value}
              </animated.div>
            </div>);
        })}
     </div>
</div>
  );
};