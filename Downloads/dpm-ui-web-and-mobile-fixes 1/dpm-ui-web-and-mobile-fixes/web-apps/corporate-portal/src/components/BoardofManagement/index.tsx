import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "./index.scss";

interface ceoData {
  title: string,
  designation: string,
  content: string,
  image_url: string,
  image_alt: string,
  weight: string,
  member_role_name: string
}
interface ceoSectionProps {
  ceoData: ceoData
}
export const CeoSection: React.FC<ceoSectionProps> = ({ ceoData }) => {
  return (
    <Container fluid className='py-5 ceo-section-container'>
      <Row className='justify-content-enter align-items-center text-center ceo-main'>
        <Col md={4}>
          <div className="ornament-board-bottom"></div>

          <img src={ceoData?.image_url} alt={ceoData?.image_alt} className='ceo-image' data-testid='ceo-img' />
        </Col>
        <Col md={6}>
          <h3 className='walaa-medium-500 heading-name'>{ceoData?.title}</h3>
          <h5 className='walaa-medium-500 heading-position'>{ceoData?.designation}</h5>
          <div className='description-section'>
            <div className="ornament-board-top"></div>

            <p className='mt-3 walaa-regular-400 heading-description'>
              {ceoData?.content}
            </p>
          </div>
        </Col>
      </Row>

    </Container>
  );

};


