import React, {useRef} from "react";
import NewsLetter from "./NewsLetter";
import RegisterLink from "./RegisterLinks";
import "./index.scss";
import { CardContentProps } from "./RegisterLinks";
import { Col, Row } from "react-bootstrap";
import { RelatedLink } from "../../components/RelatedLink";
import {commonKeywords} from 'constant';

export interface HighlighterDataProps {
  title: string;
  placeholder: string;
  label: string;
  read_more: string;
}
interface HighlighterCardProps {
  type: "newsletter" | "default";
  navigateTo?: (url: string) => void;
  highlighterData?: HighlighterDataProps;
  cardContent?: CardContentProps;
  relatedTitle?: string;
  relatedContent?: any;
}

export const HighlighterCard: React.FC<HighlighterCardProps> = ({
  type,
  highlighterData,
  navigateTo = () => { },
  cardContent = {} as CardContentProps,
  relatedContent,
  relatedTitle,
}) => {
  const isMobileDeviceRef = useRef<boolean>(window.innerWidth <= commonKeywords.mobileDeviceBreakpoint);
  return (
    <div className="indi-ent-section">
      <div className="highlighter-content">
        {type === "newsletter" ? (
          <NewsLetter highlighterData={highlighterData!} />
        ) : (
          <RegisterLink cardContent={cardContent} navigateTo={navigateTo} />
        )}
      </div>
     
      {isMobileDeviceRef.current && relatedContent && relatedTitle && (
        <div className="story-about col-md-12 mt-100 walaa-academy-change-story-about">
          <h3 className="walaa-medium-500">{relatedTitle}</h3>
          <RelatedLink type={"Academy"} relatedContent={relatedContent} />
        </div>
      )}
    </div>
  );
};
