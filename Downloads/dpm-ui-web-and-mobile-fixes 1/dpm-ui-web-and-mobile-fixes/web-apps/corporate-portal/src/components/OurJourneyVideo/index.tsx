import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./index.scss";

interface VideoProps {
  content: string;
  video_url: string;
}
export const OurJourney: React.FC<VideoProps> = ({ content, video_url }) => {
  return (
    <Container id="productToggle-1" fluid className="insurance-container">
      <div className="how-section1">
        <div className="row">
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <div>
            
            <iframe
                    width="100%"
                    height="632"
                    className="video-align"
                    src={video_url}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
            </div>
        </div>
      </div>
    </Container>
  );
};
