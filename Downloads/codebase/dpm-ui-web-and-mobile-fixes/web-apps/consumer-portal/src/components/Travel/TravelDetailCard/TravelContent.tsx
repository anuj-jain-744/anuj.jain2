import { Col, Row } from "react-bootstrap";
import "./index.scss";

export interface TravelItem {
  label: string;
  value: string | number;
}
 
interface TravelContentProps {
  travelData: TravelItem[]; 
}

const TravelContent = ({travelData }: TravelContentProps) => {
  return ( 
    <Row className="vehi-bot">
    {Array.isArray(travelData) && travelData.map((travelItem:TravelItem) => (
      <Col key={travelItem.label} className="label-container text-start">
        <span className="vehi-label">{travelItem.label}</span>
        <span className="vehi-value">{travelItem.value}</span>
      </Col>
    ))}
    </Row>
  );
};

export default TravelContent;
