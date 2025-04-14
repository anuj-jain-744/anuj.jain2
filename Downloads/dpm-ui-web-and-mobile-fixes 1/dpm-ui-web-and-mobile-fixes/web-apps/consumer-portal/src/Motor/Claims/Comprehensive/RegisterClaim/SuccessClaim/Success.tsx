import "./style.scss";
import SuccesRightComponent from "./SuccesRightComponent";
import SuccessTopComponent from "./SuccessTopComponent";
import SuccessLeftComponent from "./SuccessLeftComponent";
import PolicyFooter from "components/Footer";
import Feedback from "components/Feedback";

interface ISuccess {
  status: boolean;
  claimNo: any;
  claimLabel: any;
  validationData: any;
  claimsInfo?: any;
  claimResponse?: any;
}

function Success({
  status,
  claimNo,
  claimLabel,
  validationData,
  claimsInfo,
  claimResponse,
}: ISuccess) {
  const feedbackRequest = {
    SourceType: validationData?.SourceType,
    ClaimRequestType: validationData?.ClaimRequestType,
    caseReportId: claimsInfo?.refNo || validationData?.CaseReportId,
    ownerId: claimsInfo?.ownerId || validationData?.OwnerId,
    sequenceNo: validationData?.sequenceNo,
    vehicleOwnerDob: validationData?.dob,
    claimNo: claimResponse?.claimNo,
    subclaimNo: claimResponse?.subclaimNo,
    rating: 0,
    message: "Awosome",
  };
  return (
    <>
      <div className="success-container-main p-0 pb-3">
        <SuccessTopComponent status={status} />
        <div className="cards-container">
          <SuccessLeftComponent
            status={status}
            claimLabel={claimLabel}
            claimNo={claimNo}
            claimsInfo={claimsInfo}
          />
          <SuccesRightComponent />
        </div>
        <Feedback
          url="/Motor/Claim/V1/SubmitFeedback"
          feedbackData={feedbackRequest}
        />
      </div>
      <PolicyFooter />
    </>
  );
}

export default Success;
