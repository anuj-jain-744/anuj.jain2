import React from "react";
import { useSpring, animated } from "@react-spring/web";

import "./index.scss";
import { sanitizeHtml } from "@dpm/shared-module";
import { Col, Container, Row } from "react-bootstrap";
import RightContent from "./RightContent";

interface OverviewProps {
  overviewCont: string;
  overviewImg: string;
  isVisible?: boolean;
}

export const OverviewContent: React.FC<OverviewProps> = ({
  overviewCont,
  overviewImg,
  isVisible = false,
}) => {

  const springs = useSpring({
    from: {
      transform: isVisible ? 'translateX(0%) translateY(100%)' : "translateX(0%) translateY(0%)",
      opacity: isVisible ? 0 : 1,
    },
    to: {
      transform: isVisible ? 'translateX(0%) translateY(0%)' : "translateX(0%) translateY(100%)",
      opacity: isVisible ? 1 : 0,
    },
    config: { tension: 70, friction: 30 },
    delay: 300,
  });

  const AnimatedCol = animated(Col);

  return (
    <div id="productToggle-0" className="overview_section">
      <Container fluid id="overview-content">
        <Row>
          <AnimatedCol
            className="col-xl-8 col-lg-7 col-md-12 col-sm-12 col-xs-12 col heading-section"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(overviewCont) }}
            style={isVisible ? springs: {}}
          />
          <AnimatedCol className="col-xl-4 col-lg-5 col-md-12 col-sm-12 col-xs-12 blue-container"
          style={isVisible ? springs: {}}
          >
            <RightContent overviewImg={overviewImg} />
          </AnimatedCol>
        </Row>
      </Container>
    </div>
  );
};
