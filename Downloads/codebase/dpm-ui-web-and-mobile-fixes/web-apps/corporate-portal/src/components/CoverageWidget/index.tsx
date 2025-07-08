import React from "react";
import "./index.scss";
import { animated } from "@react-spring/web";
import { createTableSpring } from "../../utils/createTableSpring";

export interface CoverageProps {
  title: string;
  subtitle?: Array<{}>;
  comparr?: Array<{}>;
  description?: string; 
}

interface CoverageWidgetProps {
  content?: any; 
  isVisible?: boolean;
  typeClass?: string;
}

export const CoverageWidget: React.FC<CoverageWidgetProps> = ({
  content: { title, subtitle, comparr, description },
  isVisible = false,
  typeClass,
}) => {
  const headerSprings = createTableSpring(
    isVisible,
    "translateX(50%) translateY(0%)",
    "translateX(50%) translateY(0%)",
    0
  );
  const tableSprings = createTableSpring(
    isVisible,
    "translateX(0%) translateY(100%)",
    "translateX(0%) translateY(100%)",
    300
  );

  return (
    <div
      id="productToggle-2"
      className={`col-xl-12 col-lg-12 col-md-12 col-sm-12 widget-layout ${typeClass}`}
    >
      <animated.div
        style={isVisible ? headerSprings : {}}
        id="titleId"
        className="widget-title walaa-medium-500"
      >
        {title}
      </animated.div>

      {description && (
        <div className="widget-description walaa-regular-400">
          {description}
        </div>
      )}

      <animated.div style={isVisible ? tableSprings : {}}>
        <table id="tbl">
          <tbody>
            <tr className="table-th walaa-medium-500">
              {subtitle &&
                subtitle.map((itemHead: any, key: number) => (
                  <React.Fragment key={key}>
                    <td className="cell">{itemHead.left}</td>
                    <td className="cell">{itemHead.right}</td>
                  </React.Fragment>
                ))}
            </tr>
            {comparr &&
              comparr.map((itemData: any, index: number) => (
                <tr
                  id="trId"
                  key={index}
                  className="table-td walaa-regular-400 trRow"
                >
                  <td className="cell">{itemData.left}</td>
                  <td className="cell">{itemData.right}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </animated.div>
    </div>
  );
};
