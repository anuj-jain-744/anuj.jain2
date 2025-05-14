import React  from "react";
import "./DidYouKnowCard.scss";
import Idea from "assets/DidYouKnowCard/Idea.svg"; 
import { Card } from "react-bootstrap"; 
import { sanitizeHtml } from "@dpm/shared-module";

interface DidyouknowProps {
  did_you_know_content: string;
  did_you_know_text: string; 
}
 
  const DidYouKnowCard: React.FC<DidyouknowProps> = ({ did_you_know_content , did_you_know_text}) => {

  return (
    <Card className="did-you-know-card-container">
      <div>
        <img src={Idea} />
      </div>
      <div>
        <div className="head walaa-medium-500">{did_you_know_text}</div>
        <div className="content-box walaa-regular-400">
          <div className="content">
          <div dangerouslySetInnerHTML={ did_you_know_content ? { __html: sanitizeHtml(did_you_know_content) } : { __html: "" }}></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DidYouKnowCard;
