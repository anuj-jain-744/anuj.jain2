import CustomPolicyCard from "./CustomPolicyCard";
import DidYouKnow from "./DidYouKnow";

interface ICustomCardRight {
  policyNumber: string;
  effectiveDate: string;
  expiryDate: string;
  idv: string | null;
}

const CustomCardRight = ({
  policyNumber,
  effectiveDate,
  expiryDate,
  idv,
}: ICustomCardRight) => {
  return (
    <div className="right-card-container">
      <CustomPolicyCard
        policyNumber={policyNumber}
        effectiveDate={effectiveDate}
        expiryDate={expiryDate}
        idv={idv}
      />
      <DidYouKnow />
    </div>
  );
};

export default CustomCardRight;
