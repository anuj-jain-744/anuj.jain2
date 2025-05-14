import React from "react";
import "./index.scss";
import { Col, Row } from "react-bootstrap";

export interface TravelItem {
  label: string;
  value: string;
}
 
interface TravelContentProps {
  travelData: TravelItem[]; 
}

const TravelContent: React.FC<TravelContentProps> = React.memo(({travelData }) => {
  return ( 
    
    <Row className="vehi-bot">
    {Array.isArray(travelData) && travelData.map((travelItem:TravelItem, idx: number) => (
      <Col key={idx} className="label-container text-start">
        <span className="vehi-label">{travelItem.label}</span>
        <span className="vehi-value">{travelItem.value}</span>
      </Col>
    ))}
    </Row>
 
  );
});

export default TravelContent;
