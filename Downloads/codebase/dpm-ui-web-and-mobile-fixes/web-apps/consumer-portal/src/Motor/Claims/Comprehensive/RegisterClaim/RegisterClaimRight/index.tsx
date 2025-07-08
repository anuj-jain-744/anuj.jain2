import VehicleSequenceNo from "./VehicleSequenceNo";
import ClaimRegistrationDetails from "./ClaimRegistrationDetails";
import NoteRight from "./NoteRight";
import { OthersClaimInfo } from "@corporate-portal/components/GetQuoteWidget/getQuoteInterface";

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
  othersClaimInfo?: OthersClaimInfo;
}
const RegisterClaimRight = ({
  claimsInfo,
  validationData,
  claimCheckData,
  othersClaimInfo
}: IRegisterClaimRight) => {
  return (
    <div className="rightcardcontainer">
      <VehicleSequenceNo
        claimsInfo={claimsInfo}
        validationData={validationData}
        claimCheckData={claimCheckData}
        othersClaimInfo={othersClaimInfo}
      />
      <ClaimRegistrationDetails />
      <NoteRight />
    </div>
  );
};

export default RegisterClaimRight;
