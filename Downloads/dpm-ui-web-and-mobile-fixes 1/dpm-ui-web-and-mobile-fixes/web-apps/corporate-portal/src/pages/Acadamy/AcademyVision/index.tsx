import React from "react";
 
import "./index.scss";
import { Row , Col } from "react-bootstrap"; 
 
interface AcadamyvisionProps {
  visiontitle: string;
  visiondiscription: string;
  imageurl:string;
  imagealt:string;
}

export const AcadamyVision: React.FC<AcadamyvisionProps> = ({
  visiontitle,
  visiondiscription,
  imageurl,
  imagealt
}) => (
   
<div className="vision-container">
<Row className="acadamy-vision container-fluid">  
    <Col className="vision-icon col-md-2 col-lg-2 col">
      <img src={imageurl} alt={imagealt} title={imagealt}/> 
    </Col>
    <Col className="vision-text col-md-10 col-lg-10 col">
      <h3 className="walaa-medium-500"> {visiontitle} </h3>
      <p className="walaa-regular-400">{visiondiscription}</p>
    </Col>
</Row>
</div> 

);
 
