import VehicleSequenceNo from "./VehicleSequenceNo";
import ClaimRegistrationDetails from "./ClaimRegistrationDetails";
import NoteRight from "./NoteRight";

interface ClaimCheckResponse {
  caseReportId : string;
  city : string;
  claimRequestType : string;
  email : string;
  estimatedAmount : number;
  feedback : string;
  liability : string;
  mobileNo : number;
  ownerId : number;
  ownerName : string;
  referenceNo : string;
  sequenceNo : string;
  status : string;
  vehicleOwnerDob : Date;
  vehicleOwnerDobArabicH : Date;
  }
  
interface IRegisterClaimRight {
  claimsInfo: any;
  validationData: any;
  claimCheckData: ClaimCheckResponse;
}
const RegisterClaimRight = ({
  claimsInfo,
  validationData,
  claimCheckData,
}: IRegisterClaimRight) => {
  return (
    <div className="right-card-container">
      <VehicleSequenceNo
        claimsInfo={claimsInfo}
        validationData={validationData}
        claimCheckData={claimCheckData}
      />
      <ClaimRegistrationDetails />
      <NoteRight />
    </div>
  );
};

export default RegisterClaimRight;
