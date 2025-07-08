import React from "react";
import { Container, Col, Row } from "react-bootstrap";

import "./index.scss";
import { Cards } from "../../components/Cards";
import { HighlighterCard } from "../../components/HighlighterCard";
import { HighlighterDataProps } from "../../components/HighlighterCard";
import { ContentProps } from "../../components/Cards";

interface NewsroomScreenProps {
  navigateTo: (url: string) => void;
  title: string;
  newsItem: Array<ContentProps>;
  highlighterData: HighlighterDataProps;
}

export const NewsroomScreen: React.FC<NewsroomScreenProps> = ({
  navigateTo,
  title,
  newsItem,
  highlighterData,
}) => {

  return (
    <section className="newsroom-wrapper">
      <Container fluid className="newsroom-container">
        <h2 className="heading walaa-medium-500">{title}</h2>
        <Row>
          {newsItem.map((item, index) => (
            <Col key={index} lg={4} md={6} sm={12} className="mb-3">
              <Cards navigateTo={navigateTo} content={item} readMore={highlighterData.read_more} />
            </Col>
          ))}
        </Row>
      </Container>
      <div className="highlighter-wrapper">
        <HighlighterCard type="newsletter" highlighterData={highlighterData} />
      </div>
    </section>
  );
};
