import "./style.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Green from "assets/SuccessPage/Popups Status.svg";
import { Card } from "react-bootstrap";

function SuccessTopComponent(status: any, travelData: any) {
  return (
    <Card className="success-container-travel-success">
      <div className="success-container-body">
        <div>
          {status.status && (
            <img src={Green} alt={travelData?.success} />
          )}
        </div>
        <div className="content">
          <div className="success-msg walaa-medium-500">
            {travelData?.success}
          </div>
          <div className="success-content walaa-regular-400">
            {travelData?.success_msg}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SuccessTopComponent;
