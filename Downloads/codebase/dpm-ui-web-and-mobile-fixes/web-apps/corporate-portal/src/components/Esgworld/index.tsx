import React from "react";
import { sanitizeHtml } from "@dpm/shared-module";
import { Container, Row, Col } from "react-bootstrap";
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
            <Col md={12} xs={12} sm={12} lg={6} className="big-img-container">
              <img
                src={bigImage.url}
                alt={bigImage.alt}
                className="big-image"
              /> 
            
             {bigImage.view_esg_profile &&
            <button
            className="esg-world-button"
            onClick={() => window.open(bigImage.view_esg_profile_link, "_blank")}> {bigImage.view_esg_profile} </button>
            }
             
             

            </Col>
            <Col md={12} xs={12} sm={12} lg={6} className="esg-world-content d-flex">
              {title && <h2 className="esg-title walaa-medium-500">{title}
              {smallImage && (
                <img
                  src={smallImage.url}
                  alt={smallImage.alt}
                  className="small-image"
                />
              )}
                </h2>}
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
