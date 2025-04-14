import React, { useState } from "react";

interface RelatedStoriesProps {
  overviewImg: string;
}

const RightContent: React.FC<RelatedStoriesProps> = ({ overviewImg }) => {
  return (
    <div className="right-content-inner-body">
      <img src={overviewImg} alt="motor" title="motor" />
    </div>
  );
};

export default RightContent;
