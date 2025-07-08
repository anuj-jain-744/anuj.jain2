import React from "react";
import EastIcon from "@mui/icons-material/East";

export interface RelatedUrlProps {
  page_title: string;
  page_link: string; 
}

interface RelatedUrlsProps {
  relatedUrlContent: RelatedUrlProps[];
}

const RelatedUrls: React.FC<RelatedUrlsProps> = ({ relatedUrlContent }) => {

  const hasRelatedUrls = relatedUrlContent && relatedUrlContent.length > 0; 
  
  const renderRelatedUrls = () => {
    return relatedUrlContent.map(({ page_title, page_link }, index) => (
      <li key={index}> 
        <div className="walaa-regular-400">
          <EastIcon className="east-icon-color" />
          <a href={page_link}> {page_title} </a>
        </div>
      </li>
    ));
  };

  return (
    <ul className="blue-related"> 
      {hasRelatedUrls && renderRelatedUrls()}
    </ul> 
  );
};

export default RelatedUrls;
