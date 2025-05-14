import React from "react";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

export interface KnowMoreUrlProps {
  page_title: string;
  page_link: string; 
}

interface RelatedUrlsProps {
  knowMoreUrls: KnowMoreUrlProps[];
}

const KnowMore: React.FC<RelatedUrlsProps> = ({ knowMoreUrls }) => {

  const hasRelatedUrls = knowMoreUrls && knowMoreUrls.length > 0; 
  const renderRelatedUrls = () => {
    return knowMoreUrls.map(({ page_title, page_link }, index) => (
      <li className="know-more-space" key={index}> 
        <div className="walaa-regular-400 know-more-color">
          <ChevronRightRoundedIcon className="east-icon-color" />
          <a className="know-more-color" href={page_link}> {page_title} </a>
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

export default KnowMore;
