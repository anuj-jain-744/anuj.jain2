import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./index.scss";
import { sanitizeHtml } from "@dpm/shared-module";

interface ProductProps {
  data: string;
  icons: [];
}
export const QualityWidget: React.FC<ProductProps> = ({ data, icons }) => {
  return (
    <Container id="productToggle-3" fluid className="quality-container">
      <div className="how-section1">
        <div className="row">
          <div className="col-md-8">

            <div className="quality-content"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(data) }}
          >           
          </div>
          </div>
          <div className="col-md-4">
            <div className="how-img">

            {icons && icons.map((iconUrl, index) => (
              <img
              src={iconUrl}
              className="rounded-img"
              key={index}
            />
            ))}
            
            </div>



          </div>
        </div>
      </div>
    </Container>
  );
};
