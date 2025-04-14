import React from "react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';


export interface RelatedContentProps {
  title?: string;
  created_date?: string;
  detail_url?: string;
  image_url?: string;
}

//This will be removed in future sprint.
const readTime= "4 mins read."

interface RelatedStoriesProps {
  relatedContent?: RelatedContentProps[];
  showImage?: boolean;
}

const RelatedStories: React.FC<RelatedStoriesProps> = ({
  relatedContent = [],
  showImage,
}) => {
  const hasRelatedContent = relatedContent.length > 0;

  const renderRelatedContent = () => {
    return relatedContent.map(({ title, created_date,image_url, detail_url }, index) => (
      <li key={index} className="d-flex">
        {showImage && (
          <div className="links-img-wrapper">
            <img src={image_url} alt={title}/>
          </div>
        )}
        <div className="links-content-wrapper">
          <div className="story-date walaa-regular-400"> {created_date} </div>
          <div className="story-link-para walaa-medium-500">
            {" "}
            <a href={detail_url}> {title} </a>
          </div>
          <div className="story-reads walaa-regular-400">{showImage && (<AccessTimeIcon />)} <span>{readTime}</span></div>
        </div>
      </li>
    ));
  };

  return <ul>{hasRelatedContent && renderRelatedContent()}</ul>;
};

export default RelatedStories;
