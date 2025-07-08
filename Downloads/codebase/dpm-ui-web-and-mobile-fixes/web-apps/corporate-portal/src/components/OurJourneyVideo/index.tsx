import React from "react";
import { Container } from "react-bootstrap";
import { animated } from "@react-spring/web";
import {createTableSpring} from "../../utils/createTableSpring";
import "./index.scss";

interface VideoProps {
  content: string;
  video_url: string;
  isVisible?: boolean;
}
export const OurJourney: React.FC<VideoProps> = ({ content, video_url, isVisible }) => {
  const springs = createTableSpring(
    isVisible ?? false, // Provide a default value of false
    "translateX(50%) translateY(0%)",
    "translateX(50%) translateY(0%)",
    500
  );  
  
  return (
    <Container id="productToggle-1" fluid className="insurance-container our-journey">
      <div className="how-section1">
      <animated.div style={isVisible ? springs : {}}>
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
      </animated.div>
      </div>
    </Container>
  );
};
