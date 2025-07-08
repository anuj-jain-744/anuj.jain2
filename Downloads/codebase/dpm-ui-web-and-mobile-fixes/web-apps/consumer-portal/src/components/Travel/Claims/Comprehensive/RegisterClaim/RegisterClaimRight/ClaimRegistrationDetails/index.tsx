import { useState } from "react";
import { Card } from "react-bootstrap";
import ideaIcon from "assets/Claims/Idea.svg";
import RegisterClaimModalDialog from "../../../Components/RegisterClaimModalDialog";
import { LanguageData } from "types/languageData";

interface Props {
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
}

const ClaimRegistrationDetails = ({ langData }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  //modal dialog handler functions
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Card className="right-card-background-2">
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <img src={ideaIcon} alt="claim_reg_det" />
          </div>
          <div className="content walaa-medium-500 pt-1">
            <div>{langData.product?.claim_registration_details}</div>
          </div>
        </div>
      </div>
      <div className="header pt-1">
        <div className="header-content ps-4 ms-3">
          <div className="content">
            <div>
              <p className="walaa-regular-400">
                {Array.isArray(langData.product.claim_register_popup_content) &&
                  langData.product?.claim_register_popup_content[0]}
                &nbsp;
                <button
                  className="bg-transparent btn-link text-primary border-0 text-decoration-none p-0"
                  title={langData.product?.read_more}
                  type="button"
                  onClick={handleShow}
                >
                  {langData.product?.read_more}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {show && (
        <RegisterClaimModalDialog
          langData={langData}
          showRegModal={show}
          setShowRegModal={handleClose}
        />
      )}
    </Card>
  );
};

export default ClaimRegistrationDetails;
