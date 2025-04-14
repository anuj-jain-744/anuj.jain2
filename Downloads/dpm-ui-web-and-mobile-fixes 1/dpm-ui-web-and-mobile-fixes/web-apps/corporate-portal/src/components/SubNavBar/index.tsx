import React, { useState } from "react";
import { useSpring, animated, useSpringRef, useChain } from "@react-spring/web";


import {scrollToElement} from "@dpm/shared-module"; 
import "./index.scss";

interface SubNavBarWidgetProps {
  content: any;
  isVisible?: boolean;
}

export const SubNavBar: React.FC<SubNavBarWidgetProps> = ({ content = [],isVisible=false }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
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
  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
    scrollToElement(`productToggle-${tabIndex}`, -90);
  };
  return (
    <div className="tab-buttons-product">
      {content &&
        content.map((menu: any, index: number) => (
          <div
            key={index}
            data-testid={`productToggle-${index}`}
            onClick={() => handleTabClick(index)}
            className={`${activeTab === index ? "active" : ""} tab-list`}
          >
            <animated.div style={isVisible ? springs: {}}>
            {menu?.value}
            </animated.div>
          </div>
        ))}
    </div>
  );
};
