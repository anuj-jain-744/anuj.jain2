import { Card } from "react-bootstrap";
import idea from "assets/Claims/Idea.svg";
import { useState } from "react";
import ModalDialogBox from "Motor/Claims/Comprehensive/Components/ModalDialogBox";
import useTravelData from "Motor/Policy-services/AccessPolicyDocuments/hooks/useTravelData";

interface IClaimRegistrationDetails {}
const ClaimRegistrationDetails = ({}: IClaimRegistrationDetails) => {
  const [isModal, setShow] = useState<boolean>(false);
  //modal dialog handler functions
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 
  const {
    travelData,
  } = useTravelData();


  return (
    <Card className="right-card-background-2">
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <img src={idea} alt="claim_reg_det" />
          </div>
          <div className="content walaa-medium-500 pt-1">
            <div>{travelData?.claim_registration_details}</div>
          </div>
        </div>
      </div>
      <div className="header pt-1">
        <div className="header-content ps-4 ms-3">
          <div className="content">
            <div>1.</div>
            <div>
              <p className="walaa-regular-400">{travelData?.before_making_a_claim} 
                <span className="walaa-regular-400">
                <button
                  className="bg-transparent btn btn-link text-primary border border-0 text-decoration-none p-0"
                  title={travelData?.read_more}
                  type="button"
                  onClick={handleShow}
                > {travelData?.read_more}</button>
              </span></p>
              
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog Box */}
      {isModal && (
        <ModalDialogBox isModal={isModal} handleClose={handleClose} />
      )}
    </Card>
  );
};

export default ClaimRegistrationDetails;
