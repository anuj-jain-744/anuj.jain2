import React, {useRef} from "react";
import Container from "react-bootstrap/Container";
import "./index.scss";
import { Row , Col } from "react-bootstrap";
import { AcadamyVision } from "./AcademyVision";
import { WalaaObjective } from "./WalaaObjective";
import { RelatedLink } from "../../components/RelatedLink";
import { RelatedContentProps } from "../../components/RelatedLink/RelatedStories"; 
import { commonKeywords } from "constant";
// import ImageIcons from "../../assets/Academy/Branding_new_WA.svg";


export interface AcadamyProps { 
  content: string;
  relatedTitle?: string;
  relatedlink?: RelatedContentProps[];
  trainingdiscription: string;
  trainingimageurl: string;
  trainingimagealt: string;
  visiontitle: string;
  visiondiscription: string;
  visionimageurl: string;
  visionimagealt: string;
  missiontitle: string;
  missiondiscription: string;
  missionimageurl: string;
  missionimagealt: string;
  aimtitle: string;
  aimdiscription: string;
  aimimageurl: string;
  aimimagealt: string;
  objectivesTitle?: string;
  objectivesPoints?: {
    icon: string;
    description: string;
  }[];
  sidebarTitle:string;
  sidebarButton:string;
  sidebarImage?: string;


}

export const Acadamy: React.FC<AcadamyProps> = ({
  content,
  trainingdiscription,
  trainingimageurl,
  trainingimagealt,
  visiontitle,
  visiondiscription,
  visionimageurl,
  visionimagealt,
  missiontitle,
  missiondiscription,
  missionimageurl,
  missionimagealt,
  aimtitle,
  aimdiscription,
  aimimageurl,
  aimimagealt,
  relatedTitle,
  objectivesTitle,
  objectivesPoints,
  sidebarTitle,
  sidebarButton,
  sidebarImage,
  relatedlink}) =>  
{ const isMobileDeviceRef = useRef<boolean>(window.innerWidth <= commonKeywords.mobileDeviceBreakpoint);
  
  return (
    <div className="Acadamy_section">
      <Container fluid className="mid-container ">
        {/* Walaa Acadamy content Starts */}
        <Row className="two-column-section">
        

          <Col className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col heading-section" dangerouslySetInnerHTML={{ __html: content }}>
          </Col>
          {!isMobileDeviceRef && (
            <Col className="story-about col-md-4 col-lg-4">
              <h3 className="walaa-medium-500">{relatedTitle}</h3>
              <RelatedLink type={'Academy'} relatedContent={relatedlink} />
            </Col>
          )}          
        <Col className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col image-section">
        <img src={sidebarImage} />
          <div className="image-content-wrapper">
          <p className="image-text">{sidebarTitle}</p>
         <button className="register-button">{sidebarButton}</button>
          </div>
        </Col>
 
        </Row>
         {/* Walaa Acadamy content ends */}
      </Container>
      {/* <AcadamyVision visionTitle={visiontitle} visionDescription={visiondiscription} imageurl={imageurl} imagealt={imagealt} /> */}
     
      {/* Pass dynamic values from the Acadamy component */}
      <AcadamyVision
        visionTitle={visiontitle}
        visionDescription={visiondiscription}
        missionTitle={missiontitle}
        missionDescription={missiondiscription}
        aimTitle={aimtitle}
        aimDescription={aimdiscription}
        visionImage={visionimageurl}
        missionImage={missionimageurl}
        aimImage={aimimageurl}
      />

      {/* Pass dynamic cards and title to WalaaObjective */}
      {objectivesTitle && objectivesPoints && (
        <WalaaObjective
          title={objectivesTitle}
          cards={objectivesPoints.map((point, index) => ({
            icon: point.icon,
            alt: `Objective ${index + 1} Icon`,
            description: point.description
          }))}
        />
      )}
     
      <Container fluid className="mid-container ">
        <Row className="training-sections">
          <Col className="col-xl-4 col-lg-5 col-md-5 col-sm-12 col training-about">
            <img className="photo-corner" src={trainingimageurl} alt={trainingimagealt} title={trainingimagealt} />
          </Col>
          <Col className="col-xl-8 col-lg-7 col-md-7 col-sm-12 col training-heading" dangerouslySetInnerHTML={{ __html: trainingdiscription }}>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
