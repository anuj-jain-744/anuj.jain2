import React from "react";
import { Container } from "react-bootstrap";
import { animated } from "@react-spring/web";
import "./index.scss";
import { sanitizeHtml } from "@dpm/shared-module";
import {createTableSpring} from "../../utils/createTableSpring";

interface ProductProps {
  data: string;
  icons: [];
  isVisible?:boolean;
}
export const QualityWidget: React.FC<ProductProps> = ({ data, icons, isVisible }) => {
  const springs = createTableSpring(
    isVisible ?? false, // Provide a default value of false
    "translateX(50%) translateY(0%)",
    "translateX(50%) translateY(0%)",
    500
  );
  return (
    <Container id="productToggle-3" fluid className="quality-container">
      <div className="how-section1">
      <animated.div style={isVisible ? springs : {}}>
        <div className="row">
          <div className="col-md-8">

            <div className="quality-content"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(data) }}
          >           
          </div>
          </div>
          {/* <div className="col-md-4"> */}
            <div className="how-img">

            {icons && icons.map((iconUrl, index) => (
              <img
              src={iconUrl}
              className="rounded-img"
              key={index}
            />
            ))}
            
            </div>



          </div>
          </animated.div>
        </div>
      {/* </div> */}
    </Container>
  );
};
