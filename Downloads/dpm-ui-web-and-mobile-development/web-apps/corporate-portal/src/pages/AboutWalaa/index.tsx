import React from "react";
import Container from "react-bootstrap/Container";
import "./index.scss";
import { Row, Col } from "react-bootstrap";
import { RelatedLink } from "../../components/RelatedLink";
import { KnowMoreUrlProps } from "../../components/RelatedLink/KnowMore";
import { Support, QualityWidget } from "../../components";
import { SubNavBar } from "../../components";
import { ManagementTeam } from "../../components";
import { OurJourney } from "../../components";
import { sanitizeHtml } from "@dpm/shared-module";

export interface AcadamyProps {
  content: string;
  relatedTitle?: string;
  relatedlink?: KnowMoreUrlProps[];
  tabs: [];
  visionmission: string;
  missionCards: [];
  quality: string;
  qualityIcons: [];
  creditTitle: string;
  creditData: [];
  ourJourneyData: string;
  ourJourneyVideo: string;
}

export const AboutWalaa: React.FC<AcadamyProps> = ({
  content,
  qualityIcons,
  quality,
  missionCards,
  visionmission,
  ourJourneyData,
  ourJourneyVideo,
  tabs,
  creditTitle,
  creditData,
  relatedTitle,
  relatedlink,
}) => {
  const regex = /<h3>(.*?)<\/h3>/;
  const missionTitle = visionmission ? visionmission.match(regex) : null;
  const removeH3 = /<h3>.*?<\/h3>/;
  const removeTag = visionmission ? visionmission.replace(removeH3, "") : null;
  const missionDesc = removeTag ? removeTag.replace("<br>", "") : "";
  const creditRatingTitle = creditTitle ? creditTitle.match(regex) : [];
  const creditDesc = creditTitle ? creditTitle.replace(removeH3, "") : "";
  const creditRatingData = creditData ? creditData : [];
  const creditRatingTitleDesc = {
    desc: creditDesc,
    walaa_team_title: creditRatingTitle ? creditRatingTitle[1] : "",
  };
  return (
    <>
    
      
      <div className="About_section">
      <SubNavBar content={tabs} />
      
        <div className="mid-container ">
          {/* content Starts */}

          <div id="productToggle-0" className="about-content">
            <div className="container-fluid">

            <div className="two-column-section">
            <div className="top-back"></div>
            <Row>
                <Col
                xl={8} lg={8} md={12} sm={12} 
                  className="heading-section"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                >
                  
                </Col>
                <div className="bottom-back"></div>
                <Col xl={4} lg={4} md={12} sm={12} className="story-about">
                  <h3 className="walaa-medium-500">{relatedTitle}</h3>
                  <RelatedLink type={"AboutUs"} knowMoreUrls={relatedlink} />
                </Col>
              </Row>
            </div>

            </div>
          </div>

          {/* content ends */}
          <OurJourney content={ourJourneyData} video_url={ourJourneyVideo} />
          <div id="productToggle-2" className="training-section">
            <Support
              supportData={missionCards}
              title={missionTitle ? missionTitle[1] : ""}
              description={missionDesc}
              className="bottom-margin"
              carouselSetFlag={true}
            />
          </div>

          <QualityWidget data={quality} icons={qualityIcons} />
          <ManagementTeam
            teamData={creditRatingData}
            teamHeading={creditRatingTitleDesc}
          />
        </div>
      </div>
    </>
  );
};
