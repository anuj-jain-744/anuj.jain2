import { Card } from "react-bootstrap";
import Nissan from "assets/SuccessPage/Nissan.svg";
import Line from "assets/SuccessPage/Line_new.svg";
import Download from "assets/SuccessPage/Download.svg";
import "./style.scss";
import { LanguageData } from "types/languageData";

interface RegisterClaimCardProps {
  claimData: {
    claimNo?: string;
    claimsInfo?: {
      refNo?: string;
      ownerId?: string;
    };
  };
  langData: LanguageData;
}

const RegisterClaimCard = ({
  claimData,
  langData,
}: Readonly<RegisterClaimCardProps>) => {
  return (
    <Card className="policy-receipt-policy-cancellation">
      <div className="header">
        <div className="logo">
          <div>
            <img src={Nissan} alt={langData?.motor_claim_no} />
          </div>
          <div>
            <div className="policy-number-heading walaa-regular-400">
              {langData?.motor_claim_no}
            </div>
            <div className="policy-number walaa-medium-500">
              {claimData?.claimNo}
            </div>
          </div>
        </div>
      </div>
      <div className="body-content">
        <div className="top-table">
          <div className="box">
            <div className="box-content">
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                  {langData?.case_reference_no}
                </div>
                <div className="package-value walaa-medium-500">
                  {claimData?.claimsInfo?.refNo}
                </div>
              </div>
              <div>
                <img src={Line} alt={langData?.owner_id_label} />
              </div>
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                  {langData?.owner_id_label}
                </div>
                <div className="package-value walaa-medium-500">
                  {claimData?.claimsInfo?.ownerId}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-links">
          <div className="link-container">
            <div>
              <img src={Download} alt={langData?.download_claim_documents} />
            </div>
            <div className="links-content walaa-regular-400">
              {langData?.download_claim_documents}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-note-container">
        <div className="footer-note">
          <div className="note walaa-medium-500">Note :</div>
          <div className="note-content walaa-regular-400">
            {langData?.we_have_received_your_appl}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RegisterClaimCard;
