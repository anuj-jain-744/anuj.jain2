import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Accordians } from "../../components/Accordians";
import "./index.scss";

import { animated } from "@react-spring/web";
import { createTableSpring } from "utils/createtableSpring";

interface FAQProps {
  faqCont: string;
  accordianData: Record<string, { qns: string; ans: string }[]>;
  labels?: { [key: string]: string };
  isVisible?: boolean;
}

export const FAQShared: React.FC<FAQProps> = ({
  faqCont,
  accordianData,
  labels,
  isVisible = false,
}) => {
  const AnimatedRow = animated(Row);

  const headerSprings = createTableSpring(
    isVisible,
    "translateX(50%) translateY(0%)",
    "translateX(50%) translateY(0%)",
    0
  );
  const accordianSprings = createTableSpring(
    isVisible,
    "translateX(0%) translateY(100%)",
    "translateX(0%) translateY(100%)",
    300
  );

  return (
    <div id="productToggle-4" className="sharedfaq-wrapper">
      <Container fluid id="faq-shared">
        <AnimatedRow
          className="heading-section"
          dangerouslySetInnerHTML={{ __html: faqCont }}
          style={isVisible ? headerSprings : {}}
        />
        <Row>
          <Col lg={12}>
            <animated.div
              style={isVisible ? accordianSprings : {}}
              className="accordian-wrapper"
            >
              <Accordians content={accordianData} labels={labels} />
            </animated.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
