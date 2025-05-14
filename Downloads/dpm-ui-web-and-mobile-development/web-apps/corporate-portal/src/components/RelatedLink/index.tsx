import React from "react";
import "./index.scss";
import { Col } from "react-bootstrap";
import RelatedStories, { RelatedContentProps } from "./RelatedStories"; 
import RelatedUrls, { RelatedUrlProps } from "./RelatedUrls";
import KnowMore, {KnowMoreUrlProps} from "./KnowMore";

interface RelatedProps {
  type: "Academy" | "Privacy" | "AboutUs";
  showImage?: boolean;
  individualCards?: boolean;
  relatedContent?: RelatedContentProps [];
  relatedUrlContent?: RelatedUrlProps[];
  knowMoreUrls?: KnowMoreUrlProps[];
}

export const RelatedLink: React.FC<RelatedProps> = ({
  type,
  showImage=false,
  individualCards=false,
  relatedContent = [],
  relatedUrlContent = [],
  knowMoreUrls = []
}) => {
  return (
    <Col className={`col-lg-12 col-md-12 col-sm-12 col-xs-12 shared-related-links ${individualCards ? 'individual-link-cards': ''}`}>
      {
      type === "Academy" ? (
        <RelatedStories relatedContent={relatedContent} showImage={showImage}/>
      ) 
      : type === "AboutUs" ? <KnowMore knowMoreUrls={knowMoreUrls} /> 
      : (
        <RelatedUrls relatedUrlContent={relatedUrlContent} />
      )
      
      }
    </Col>
  );
};
