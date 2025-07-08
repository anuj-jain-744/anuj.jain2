import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./index.scss";

interface ChairmanData {
  title: string;
  designation: string;
  content: string;
  image_url: string;
  image_alt: string,
  weight: string;
  member_role_name: string
}

interface ChairmanDataProps {
  ChairmanData: ChairmanData[];
}

export const Chairman: React.FC<ChairmanDataProps> = ({
  ChairmanData,
}) => {

  return (
    <Container fluid className="bod-container-wrapper">
      <div className="ornament-left"></div>
      <div className="ornament-right"></div>
      {ChairmanData && (

        <Row className='row-chairman'>

          <Col xs={12} md={5} className='item-center padding-right'>
            <img src={ChairmanData[0].image_url} alt={ChairmanData[0].image_alt} data-testid='chairman-img' className="chairman-image" />
          </Col>

          <Col xs={12} md={7} className="custom-text">
            <h5 className="title-text walaa-medium-500" data-testid='ceo-title'>{ChairmanData[0].title}</h5>
            <h6 className="title-designation walaa-medium-500" data-testid='ceo-designation'>{ChairmanData[0].designation}</h6>
            <p className="text-content walaa-regular-400" data-testid='ceo-content'>{ChairmanData[0].content}</p>
          </Col>
        </Row>

      )}
    </Container>
  );
};
