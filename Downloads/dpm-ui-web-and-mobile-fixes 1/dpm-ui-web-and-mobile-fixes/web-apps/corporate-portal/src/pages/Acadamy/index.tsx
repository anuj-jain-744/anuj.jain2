import React, {useRef} from "react";
import Container from "react-bootstrap/Container";
import "./index.scss";
import { Row , Col } from "react-bootstrap";
import { AcadamyVision } from "./AcademyVision";
import { RelatedLink } from "../../components/RelatedLink";
import { RelatedContentProps } from "../../components/RelatedLink/RelatedStories"; 
import { commonKeywords } from "constant";


export interface AcadamyProps { 
  content: string;  

  relatedTitle?:string;
  relatedlink?: RelatedContentProps[]; 

  trainingdiscription: string;
  trainingimageurl:string;
  trainingimagealt:string;
 
  visiontitle:string;
  visiondiscription:string;
  imageurl:string;
  imagealt:string;

}

export const Acadamy: React.FC<AcadamyProps> = ({content,
  trainingdiscription,
  trainingimageurl,
  trainingimagealt , 
  visiontitle,
  visiondiscription,
  imageurl,
  imagealt,
  relatedTitle,
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
          
      </Row>
      {/* Walaa Acadamy content ends */}  
    </Container> 
    
    <AcadamyVision visiontitle={visiontitle} visiondiscription={visiondiscription} imageurl={imageurl} imagealt={imagealt}  />
    
    <Container fluid className="mid-container ">
      <Row className="training-section">  
            <Col className="col-xl-4 col-lg-5 col-md-5 col-sm-12 col training-about">
                <img className="photo-corner" src={trainingimageurl} alt={trainingimagealt} title={trainingimagealt}/>
            </Col>
            <Col  className="col-xl-8 col-lg-7 col-md-7 col-sm-12 col training-heading" dangerouslySetInnerHTML={{ __html: trainingdiscription }}> 
            </Col> 
      </Row> 
    </Container>
   
 
  </div>
);
}
