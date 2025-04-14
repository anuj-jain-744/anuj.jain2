import React from "react";
import {Container} from "react-bootstrap"; 
import "react-multi-carousel/lib/styles.css";
 
import "./index.scss";
import ProductTab from "components/ProductCatelog/ProductTab";
 
interface EsgProps { 
  esgCont: { [key: string]: string }[];
  esgDataTit: string;
  esgDataDisc: string;
}

export function EsgScreen({ esgCont, esgDataTit ,esgDataDisc }: EsgProps) {
   
  return (
  
     <div className="productCat productCat-Esg">
       <div className="ornament-btm"></div>
       <div className="ornament-top"></div>
        <Container fluid className="midContainer"> 
          <h2 className="walaa-medium-500">{esgDataTit}</h2>
          <p>{esgDataDisc}</p> 
          <ProductTab compData={{ personal: esgCont }} showTab={false}/> 
        </Container>
      </div> 
 
  );
}