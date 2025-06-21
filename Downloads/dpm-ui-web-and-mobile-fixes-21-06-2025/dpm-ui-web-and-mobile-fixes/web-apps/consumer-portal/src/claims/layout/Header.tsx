import React from "react";
import { Card } from "react-bootstrap";

function Header({
  src,
  alt,
  className,
  titleclassName,
  title,
}: IRegisterNewClaim) {
  return (
    <React.Fragment>
      <Card.Header className="register-card-header">
        <div className="title-colored">
          <div className="walaa-medium-500 title">{title}</div>
          <div className="register-row-spacing-bottom"></div>
        </div>
      </Card.Header>
      {/* <Card.Title>
        <div className="d-flex align-items-center">
          <div>
            <img src={verifiedUser} alt={alt} className={className} />
          </div>
          <div className={titleclassName}>{title}</div>
        </div>
      </Card.Title> */}
    </React.Fragment>
  );
}

export default Header;
