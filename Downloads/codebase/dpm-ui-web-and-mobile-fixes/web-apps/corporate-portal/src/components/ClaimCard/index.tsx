import React from "react";
import "./index.scss";
import { Card, Col, Container, Row } from "react-bootstrap";

interface cardContentProps {
  title: string;
  content: string;
  image_url: string;
  image_alt: string;
  url: string;
}
 
interface claimCardProps {
  cardContent: cardContentProps[];
 
}
export const ClaimCard: React.FC<claimCardProps> = ({
  cardContent,

}) => { 

  return (
   
      <Container fluid id="claimCard-content">
        
        <Row className="card-section">
          {Array.isArray(cardContent) && cardContent.length > 0 ? (
            cardContent.map((cardCon, Idx) => (
              <Col md={4} key={Idx}>
                <Card className="mb-4 cards shared-utility-cards">
                  <div className="circlebox">
                    <img src={cardCon.image_url} alt={cardCon.image_alt} />
                  </div>
                  <Card.Body>
                    <Card.Title className="walaa-medium-500">
                      <a href={cardCon.url} target="_blank"> {cardCon.title} </a>
                    </Card.Title>
                    {/* <Card.Text
                      className="walaa-regular-400"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(cardCon.content),
                      }}
                    ></Card.Text>  */}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No card content available.</p>
          )}
        </Row>
      </Container>
 
  );
};
