import "./style.scss";
import SuccesRightComponent from "../../Motor/SuccessPage/SuccesRightComponent";
import SuccessTopComponent from "../../Motor/SuccessPage/SuccessTopComponent";
import TravelSuccessLeft from "../TravelSuccessLeft"
import PolicyFooter from "components/Footer";
import { DataContext } from '../../../../consumer-portal/src/DataContext'
import { Modal } from "react-bootstrap";
import Feedback from "components/Feedback";
import { useState, useEffect } from "react";
import useSaveRedisData from "hook/common/useSaveRedisData";
interface cancelPolicyData{
  policyNo: string;
  endoNo: string;
}
interface TravelSuccesProps {
  status: boolean;
  data: any;
  flag?: boolean;
  cancelPolicyData?:cancelPolicyData;
}

const feedbackRequest = {
  SourceType: "",
  ClaimRequestType: "",
  caseReportId: "",
  ownerId: "",
  sequenceNo: "",
  vehicleOwnerDob: "",
  claimNo: "",
  subclaimNo: "",
  rating: 0,
  message: "Awosome",
};

function TravelSucces({ status, data, flag = false, cancelPolicyData}: TravelSuccesProps) {
  const feedbackRequest = {};
  const [feedbackpopup, setFeedbackpopup] = useState(true);
  const handleClose = () => setFeedbackpopup(false);
  const { saveRedisData } = useSaveRedisData();
  useEffect(() => {
    saveRedisData("empty", null, 1);
  }, []);
  return (
    <>
      <div className="success-container-main p-0 pb-3">
        <SuccessTopComponent status={status} data={data} flag={flag} typeCode={true}/>
        <div className="cards-container">
        <TravelSuccessLeft status={status} data={data} flag={flag} cancelPolicyData={cancelPolicyData}/>
          <SuccesRightComponent flag={flag}  />
          
        </div>
        
        <div className="py-3 modal-wrapper" >

<Modal

  show={feedbackpopup}
  onHide={handleClose}
  className="modal-feedback">
  <Modal.Header closeButton>
  </Modal.Header>
  <Modal.Body >

    <DataContext.Provider value={data}>
      <Feedback
        url="/Motor/Claim/V1/SubmitFeedback"
        feedbackData={feedbackRequest}
        feedbackType={true}
        handleClose={handleClose}
      />
    </DataContext.Provider>
  </Modal.Body>
</Modal>


</div>
      </div>

     <PolicyFooter />
    </>
  );
}

export default TravelSucces;
