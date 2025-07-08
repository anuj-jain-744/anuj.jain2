import React from "react";
import { Row, Col } from "react-bootstrap";
import { animated } from "@react-spring/web";
import { sanitizeHtml } from "@dpm/shared-module";
import { KnowMoreUrlProps } from "../../components/RelatedLink/KnowMore";
import { RelatedLink } from "../../components/RelatedLink";
import {createTableSpring} from "../../utils/createTableSpring";

interface AboutProps {
  content: string;
  isVisible: boolean;
  relatedTitle?: string;
  relatedlink?: KnowMoreUrlProps[];
}
export const AboutSection: React.FC<AboutProps> = ({ content, isVisible, relatedTitle, relatedlink }) => {

  const springs = createTableSpring(
    isVisible ?? false, // Provide a default value of false
    "translateX(0%) translateY(100%)",
    "translateX(0%) translateY(100%)",
    500
  );

  return (
    <div id="productToggle-0" className="about-content">
      <div className="container-fluid">
        <animated.div style={isVisible ? springs : {}} data-testid="aboutsection">
          <div className="two-column-section">
            <div className="top-back"></div>
            <Row>
              <Col
                xl={8} lg={8} md={12} sm={12}
                className="heading-section"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
              >
              </Col>
              <div className="bottom-back"></div>
              <Col xl={4} lg={4} md={12} sm={12} className="story-about">
                <h3 className="walaa-medium-500">{relatedTitle}</h3>
                <RelatedLink type={"AboutUs"} knowMoreUrls={relatedlink} />
              </Col>
            </Row>
          </div>
        </animated.div>
      </div>
    </div> 
  );
};
