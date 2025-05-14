import { Card } from "react-bootstrap";
import idea from "assets/Claims/Idea.svg";
import { useContext, useState } from "react";
import ModalDialogBox from "Motor/Claims/Comprehensive/Components/ModalDialogBox";
import { DataContext } from "../../../../../../DataContext";

interface IClaimRegistrationDetails {}
const ClaimRegistrationDetails = ({}: IClaimRegistrationDetails) => {
  const [isModal, setShow] = useState<boolean>(false);
  //modal dialog handler functions
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const Data = useContext(DataContext);

  return (
    <Card className="right-card-background-2" data-testid="claim-registration-details">
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <img src={idea} alt="claim_reg_det" />
          </div>
          <div className="content walaa-medium-500 pt-1">
            <div>{Data?.claim_registration_details}</div>
          </div>
        </div>
      </div>
      <div className="header pt-1">
        <div className="header-content ps-4 ms-3">
          <div className="content">
            <div>1.</div>
            <div>
             {Data?.popup_body_content_one[0]?.value}
              <span className="modal-link walaa-regular-400 ps-1">
                <button
                  className="bg-transparent btn btn-link text-primary border border-0 text-decoration-none p-0"
                  title="Read More"
                  type="button"
                  onClick={handleShow}
                >
                  Read More
                </button>
              </span>
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
