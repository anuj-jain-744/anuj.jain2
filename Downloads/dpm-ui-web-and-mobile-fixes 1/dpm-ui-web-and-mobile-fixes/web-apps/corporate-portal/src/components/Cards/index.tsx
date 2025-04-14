import React from "react";
import Card from "react-bootstrap/Card";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "./index.scss";

export interface ContentProps {
  news_category: string;
  created_date: string;
  title: string;
  short_description: string;
  detail_url: string;
  image_url: string;
}

interface CardsProps {
  navigateTo: (url: string) => void;
  content: ContentProps;
  readMore: string;
}

export const Cards: React.FC<CardsProps> = ({ navigateTo, content, readMore }) => {
  const {
    news_category,
    created_date,
    title,
    short_description,
    detail_url,
    image_url,
  } = content;

  return (
    <Card className="shared-card-wrapper">
      <Card.Img variant="top" src={image_url} />
      <Card.Body>
        <span className="card-date walaa-regular-400">
          {news_category} | {created_date}
        </span>
        <Card.Title className="walaa-medium-500">{title}</Card.Title>
        <Card.Text className="walaa-regular-400">{short_description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <p
          className="card-readmore walaa-regular-400"
          onClick={() => navigateTo(detail_url)}
        >
          {readMore}
          <ChevronRightIcon />
        </p>
      </Card.Footer>
    </Card>
  );
};

