import { useState } from "react";
import "./style.scss";
import SuccesRightComponent from "./SuccesRightComponent";
import SuccessTopComponent from "./SuccessTopComponent";
import SuccessLeftComponent from "./SuccessLeftComponent";
import PolicyFooter from "components/Footer";
import Feedback from "../../../../../../components/Feedback";
import { Modal } from "react-bootstrap";

interface ISuccess {
  status: boolean;
  claimNo: any;
  claimLabel: any;
  validationData: any;
  claimsInfo?: any;
  claimResponse?: any;
  travelData: any;
  handleClaimDownload:any;
  handleNavigate: any;
  policyNo:string;
}

function Success({
  status,
  claimNo,
  claimLabel,
  validationData,
  claimsInfo,
  claimResponse,
  travelData,
  handleClaimDownload,
  handleNavigate,
  policyNo
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

  const [feedbackpopup, setFeedbackpopup] = useState(true);
  const handleClose = () => setFeedbackpopup(false);

  return (
    <>
      <div className="success-container-main-travel-success">
        <SuccessTopComponent status={status} travelData={travelData} />
        <div className="cards-container">
          <SuccessLeftComponent
            status={status}
            claimLabel={claimLabel}
            claimNo={claimNo}
            claimsInfo={claimsInfo}
            travelData={travelData}
            handleClaimDownload={handleClaimDownload}
            handleNavigate={handleNavigate}
            policyNo={policyNo}
          />
          <SuccesRightComponent travelData={travelData} />
        </div>
        <div className="py-3 modal-wrapper">
          <Modal
            show={feedbackpopup}
            onHide={handleClose}
            className="modal-feedback"
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <Feedback
                url="/Motor/Claim/V1/SubmitFeedback"
                feedbackData={feedbackRequest}
                feedbackType={true}
              />
            </Modal.Body>
          </Modal>
        </div>
      </div>
      <PolicyFooter />
    </>
  );
}

export default Success;
