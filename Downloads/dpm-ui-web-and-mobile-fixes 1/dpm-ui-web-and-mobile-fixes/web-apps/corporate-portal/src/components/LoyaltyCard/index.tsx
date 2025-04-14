import React from "react";
import "./index.scss";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { sanitizeHtml } from "@dpm/shared-module";
import { animated } from "@react-spring/web";
import { createTableSpring } from "utils/createtableSpring";

interface cardContentProps {
  title: string;
  content: string;
  image_url: string;
  image_alt: string;
  button_link: string;
}
interface LoyaltyProps {
  loyaltyTitle: string;
  loyaltyDiscription: string;
  cardContent: cardContentProps[];
  learnMore: string;
  navigateTo?: (url: string) => void;
  isVisible?: boolean;
}

export const LoyaltyCard: React.FC<LoyaltyProps> = ({
  loyaltyTitle,
  loyaltyDiscription,
  cardContent = [],
  learnMore,
  navigateTo,
  isVisible = false,
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

  const AnimatedRow = animated(Row);

  return (
    <div className="loyalty_section">
      <Container fluid id="loyalty-content">
        <Row className="heading-section">
          <animated.h3
            style={isVisible ? headerSprings : {}}
            className="walaa-medium-500"
          >
            {loyaltyTitle}
          </animated.h3>
          <animated.div
            style={isVisible ? headerSprings : {}}
            dangerouslySetInnerHTML={{ __html: loyaltyDiscription }}
          ></animated.div>
        </Row>
        <AnimatedRow
          style={isVisible ? tableSprings : {}}
          className="card-section"
        >
          {Array.isArray(cardContent) &&
            cardContent.length > 0 &&
            cardContent.map((cardCon, Idx) => (
              <Col md={4} key={Idx}>
                <Card className="mb-4 cards">
                  <div className="circlebox">
                    <img src={cardCon.image_url} alt={cardCon.image_alt} />
                  </div>
                  <Card.Body>
                    <div>
                      <Card.Title className="walaa-medium-500">
                        {cardCon.title}
                      </Card.Title>
                      <Card.Text
                        className="walaa-regular-400"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(cardCon.content),
                        }}
                      ></Card.Text>
                    </div>
                    <div>
                      <Button
                        className="walaa-medium-500"
                        onClick={() =>
                          navigateTo
                            ? navigateTo(cardCon.button_link ?? "")
                            : ""
                        }
                      >
                        {" "}
                        {learnMore}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </AnimatedRow>
      </Container>
    </div>
  );
};
