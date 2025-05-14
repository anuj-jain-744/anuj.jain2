import { Card } from "react-bootstrap";
import Car from "assets/Claims/Car.svg";
import { useContext } from "react";
import { DataContext } from "../../../../DataContext";
import { formatDate } from "utils/formatDate";

interface ICustomPolicyCard {
  policyNumber: string;
  effectiveDate: string;
  expiryDate: string;
  idv: string | null;
}

const CustomPolicyCard = ({
  policyNumber,
  effectiveDate,
  expiryDate,
  idv,
}: ICustomPolicyCard) => {
  //cms content
  const Data = useContext(DataContext);
  //date formater util fn call
  const formatedStartDate = formatDate(effectiveDate);
  const formatedExpiryDate = formatDate(expiryDate);
  return (
    <Card className="right-card">
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <img src={Car} alt="car" />
          </div>
          <div className="content">
            <div>{Data?.policy_no}</div>
            <div className="walaa-medium-500 policy-number">{policyNumber}</div>
          </div>
        </div>
      </div>

      <hr className="horizontal-line" />
      <div className="header">
        <div className="header-content">
          <div className="content">
            <div>{Data?.start_date}</div>
            <div className="walaa-medium-500 policy-number">
              {formatedStartDate}
            </div>
          </div>
        </div>
        <div className="header-content">
          <div className="content">
            <div>{Data?.expiry_date}</div>
            <div className="walaa-medium-500 policy-number">
              {formatedExpiryDate}
            </div>
          </div>
        </div>
      </div>

      <div className="header">
        <div className="header-content">
          <div className="content">
            <div>{Data?.insured_declared_value_idv}</div>
            <div className="walaa-medium-500 policy-number">
              {idv ? idv : "Not available"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomPolicyCard;
