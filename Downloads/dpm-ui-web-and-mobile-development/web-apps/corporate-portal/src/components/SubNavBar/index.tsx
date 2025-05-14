import React, { useState } from "react";
import { useSpring, animated, useSpringRef, useChain } from "@react-spring/web";
import {productIDs } from "../../../../corporate-portal/src/constant";

import {scrollToElement} from "@dpm/shared-module"; 
import "./index.scss";

interface SubNavBarWidgetProps {
  content: any;
  isVisible?: boolean;
}

export const SubNavBar: React.FC<SubNavBarWidgetProps> = ({ content = [],isVisible=false }) => {
  const [activeTab, setActiveTab] = useState<string | number>(0);
  const springs = useSpring({
    from: { 
      transform: isVisible ? 'translateX(100%) translateY(-50%)' : "translateX(0%) translateY(-50%)",
    },
    to: { 
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(100%) translateY(-50%)",
    },
    config: { tension: 50, friction: 30 },
    delay: 500,
  });


  // Handle tab click
  const handleTabClick = (tabIndex: string  | number) => {
    setActiveTab(tabIndex);
    scrollToElement(`productToggle-${tabIndex}`, -90);
  };
  return (
    <div className="tab-buttons-product">
      {content &&
        content.map((menu: any, index: number) => {
          const menuId =  menu?.value.toLowerCase() === productIDs.services || menu?.value.toLowerCase() === productIDs.faqs ? menu?.value.toLowerCase() : index;
          return(
          <div
            key={index}
            data-testid={`productToggle-${menuId}`} 
            onClick={() => handleTabClick(menuId)}
            className={`${activeTab === menuId ? "active" : ""} tab-list`}
          >
            <animated.div style={isVisible ? springs: {}}>
            {menu?.value}
            </animated.div>
          </div>);
    })}
    </div>
  );
};
