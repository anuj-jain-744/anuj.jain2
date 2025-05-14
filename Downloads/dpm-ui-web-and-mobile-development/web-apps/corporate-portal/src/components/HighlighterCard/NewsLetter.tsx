import React from "react";
import { Button, Form } from "react-bootstrap";
import { HighlighterDataProps } from "./index";

interface NewsLetterProps {
  highlighterData: HighlighterDataProps;
}

const NewsLetter: React.FC<NewsLetterProps> = ({ highlighterData }) => {
  const { title, placeholder, label } = highlighterData;
  return (
    <div className="newsletter-wrapper">
      <p className="walaa-medium-500">{title}</p>
      <div className="form-wrapper">
        <Form.Control type="email" placeholder={placeholder} />
        <Button className="walaa-medium-500 action-button">{label}</Button>
      </div>
    </div>
  );
};

export default NewsLetter;
