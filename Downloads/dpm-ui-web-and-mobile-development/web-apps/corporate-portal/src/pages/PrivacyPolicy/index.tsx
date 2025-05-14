import React from "react";
import Container from "react-bootstrap/Container";
import "./index.scss";
import { Col, Row } from "react-bootstrap";
import { RelatedLink } from "../../components/RelatedLink";
import { RelatedUrlProps } from "../../components/RelatedLink/RelatedUrls";
 
interface PrivacyProps { 
  content: string; 
  relatedTitle:string;
  relatedlink: RelatedUrlProps[]; 
 
}

export const PrivacyPolicy: React.FC<PrivacyProps> = ({ 
  content, 
  relatedTitle,
  relatedlink,
 
}) => {
 
  return (
  <div className="privacy_section">
    <Container fluid className="mid-container">
    <Row className="two-column-section">  
        <Col xl={8} lg={8} md={12} sm={12}  className="heading-section">
          <div className="para-content walaa-regular-400">
            <div dangerouslySetInnerHTML={{ __html: content }}/> 
          </div> 
        </Col>   
        <Col xl={4} lg={4} md={12} sm={12} className="about-privacy">
        <h3 className="walaa-medium-500">{relatedTitle}</h3>
        <RelatedLink type={'Privacy'} relatedUrlContent={relatedlink} />
        </Col>
    </Row>
    </Container>
    
  </div>
)};
