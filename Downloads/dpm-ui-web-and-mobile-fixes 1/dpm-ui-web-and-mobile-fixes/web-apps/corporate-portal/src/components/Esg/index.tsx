import React from "react";
import { sanitizeHtml } from "@dpm/shared-module";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import "./index.scss";

interface EsgData {
  introduction_title: string;
  introduction_image: { url: string; alt: string };
  introduction_description: string;
}
interface EsgProps {
  content: EsgData;
}
export const Esg: React.FC<EsgProps> = ({ content }) => {
  const {
    introduction_title,
    introduction_description,
    introduction_image: { url, alt },
  } = content;

  return (
    <section className="esg-commitment-wrapper">
      <Container fluid>
        <div className="content-wrapper">
          <h2 className="esg-commitment-heading walaa-medium-500">
            {introduction_title}
          </h2>
          <Row className="content-wrapper-row">
            <Col md={12} xs={12} sm={12} lg={6}>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(introduction_description),
                }}
                className="esg-commitment-description"
              />
            </Col>
            <Col md={12} xs={12} sm={12} lg={6}>
              <img src={url} className="esg-commitment-image" alt={alt} />
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};
