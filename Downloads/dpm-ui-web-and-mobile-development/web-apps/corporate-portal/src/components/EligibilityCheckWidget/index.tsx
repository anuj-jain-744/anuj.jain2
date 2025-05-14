import React from "react";
import { Button, Card } from "react-bootstrap";
import "./index.scss";

interface EligibilityProps {
  content: any;
  navigateTo: (url: string) => void;
}

export const EligibilityCheck: React.FC<EligibilityProps> = ({
  content,
  navigateTo,
}) => {
  const data = content?.sidebar_data[0];

  return (
    <Card className="mb-4 card-outer">
      <Card.Body className="card-space">
        <h4 data-testid="chk-title">{data?.title}</h4>
        <p data-testid="chk-desc">{data?.description}</p>
        <Button
          data-testid="chk-btn"
          onClick={() =>
            data?.check_eligibility_link
              ? navigateTo(data?.check_eligibility_link)
              : ""
          }
          className="btn-bg btn-text"
        >
          {data?.check_eligibility}
        </Button>
      </Card.Body>
    </Card>
  );
};
