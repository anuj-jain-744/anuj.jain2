import Idea from "assets/DidYouKnowCard/Idea.svg";
import { DataContext } from "../../../../DataContext";
import { useContext } from "react";
import { Card } from "react-bootstrap";
import { DummyText } from "utils/DummyText";

function DidYouKnow() {
  //cms content
  const Data = useContext(DataContext);
  return (
    <Card className="right-card-background-2">
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <img src={Idea} alt="claim_reg_det" />
          </div>
          <div className="content walaa-medium-500 pt-1">
            <div>{Data?.did_you_know}</div>
          </div>
        </div>
      </div>
      <div className="header pt-1">
        <div className="header-content ps-4 ms-3">
          <div className="content">
            <div>1.</div>
            <div>{DummyText(0, 74)}</div>
          </div>
        </div>
      </div>

      <div className="header pt-1">
        <div className="header-content ps-4 ms-3">
          <div className="content">
            <div>2.</div>
            <div>{DummyText(0, 74)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DidYouKnow;
