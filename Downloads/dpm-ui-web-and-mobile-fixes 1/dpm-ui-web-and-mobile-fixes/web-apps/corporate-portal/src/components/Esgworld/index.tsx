import React from "react";
import { sanitizeHtml } from "@dpm/shared-module";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import "./index.scss";

interface EsgworldData {
  title: string | null;
  description: string;
  smallImage: { url: string; alt: string };
  bigImage: { url: string; alt: string };
}

interface EsgworldProps {
  content: EsgworldData[];
}

export const Esgworld: React.FC<EsgworldProps> = ({ content }) => {
  return (
    <Container fluid className="esg-world-container">
      <div className="esg-wrapper">{content.length > 0 &&
        content.map(({ bigImage, smallImage, title, description }, index) => (
          <Row
            className={`esg-world-row ${index % 2 === 1 ? "row-reverse" : ""}`}
            key={index}
          >
            <Col md={12} xs={12} sm={12} lg={6}>
              <img
                src={bigImage.url}
                alt={bigImage.alt}
                className="big-image"
              />
            </Col>
            <Col md={12} xs={12} sm={12} lg={6} className="esg-world-content d-flex">
              {smallImage && (
                <img
                  src={smallImage.url}
                  alt={smallImage.alt}
                  className="small-image"
                />
              )}
              {title && <h2 className="esg-title walaa-medium-500">{title}</h2>}
              {description && (
                <div
                  className="esg-description"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(description),
                  }}
                />
              )}
            </Col>
          </Row>
        ))}</div>
    </Container>
  );
};
