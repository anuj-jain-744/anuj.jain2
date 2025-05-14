import "./style.scss";
import Line from "assets/SuccessPage/Line_new.svg";
import Download from "assets/SuccessPage/Download.svg";
import Whatsapp from "assets/SuccessPage/WhatsApp.svg";
import Mail from "assets/SuccessPage/Mail.svg";
import Branch from "assets/SuccessPage/Branch.svg";
import FeedBack from "assets/SuccessPage/FeedBack.svg";
import travelinfo from "assets/QuoteAndBuy/flightIcon.png";
import { Card } from "react-bootstrap";
import ThemeButton from "Motor/Endorsement/sharedComponent/ThemeButton";
import mockData from "./../success.json";

interface ISuccessLeftComponent {
  status: boolean;
  claimNo: any;
  claimLabel: any;
  claimsInfo?: any;
  travelData: any;
  handleClaimDownload: any;
  handleNavigate:any;
  policyNo:string;
}

function SuccessLeftComponent({
  status,
  claimNo,
  claimLabel,
  claimsInfo,
  travelData,
  handleClaimDownload,
  handleNavigate,
  policyNo
}: ISuccessLeftComponent) {
  const SuccessPolicyCancellationCard = (
    <Card className="policy-receipt-policy-cancellation">
      <div className="header">
        <div className="logo">
          <div>
            <img src={travelinfo} />
          </div>
          <div className="">
            <div className="policy-number-heading walaa-regular-400">
              {travelData?.policy_no}
            </div>
            <div className="policy-number walaa-medium-500">
              {policyNo}
            </div>
          </div>
          <div className="travel-section">
            <div className="policy-number-heading walaa-regular-400">
              {travelData?.travel_no}
            </div>
            <div className="policy-number walaa-medium-500">
              {claimNo}
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
                  {travelData?.policy_holder}
                </div>
                <div className="package-value walaa-medium-500">
                  {claimsInfo?.refNo || "Javed Al-Mutairi"}
                </div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                  {travelData?.date_of_loss}
                </div>
                <div className="package-value walaa-medium-500">
                  {claimsInfo?.ownerId || "21/02/2025"}
                </div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                  {travelData?.claim_amount}
                </div>
                <div className="package-value walaa-medium-500">
                  {claimsInfo?.ownerId || "SAR 1212.00"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-links">
          <div className="link-container">
            <div>
              <img src={Download} />
            </div>
            <div
              onClick={() => { handleClaimDownload();} }
              className="links-content walaa-regular-400"
            >
              {travelData?.download_document}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-note-container">
        <div className="footer-note">
          <div className="note walaa-medium-500">{travelData?.note}</div>
          <div className="note-content walaa-regular-400">
            {travelData?.note_msg}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="left-card-container-travel-success">
      {SuccessPolicyCancellationCard}

      <Card className="select-policy-left-card">
        <div className="select-policy">
          <div className="select-policy-header walaa-medium-500">
            {mockData["getInTouch"]}
          </div>
          <hr className="horizontal-line" />
          <div className="policy-list">
            <div className="policy-support">
              <div className="top">
                <div className="support-text c">{mockData["callSupport"]}</div>
                <div className="support-number walaa-medium-500">
                  {mockData["supportNumber"]}
                </div>
              </div>
              <div className="bottom">
                <div className="whatsapp-logo">
                  <img src={Whatsapp} />
                </div>
                <div className="whatsapp-text walaa-regular-400">
                  {mockData["whatsappSupport"]}
                </div>
              </div>
            </div>
            <div className="contact">
              <div className="logo-text">
                <div className="whatsapp-logo">
                  <img src={Mail} />
                </div>
                <div className="whatsapp-text walaa-regular-400">
                  {mockData["mail"]}
                </div>
              </div>
              <div className="logo-text">
                <div className="whatsapp-logo">
                  <img src={Branch} />
                </div>
                <div className="whatsapp-text walaa-regular-400">
                  {mockData["branchLocator"]}
                </div>
              </div>
              <div className="logo-text">
                <div className="whatsapp-logo">
                  <img src={FeedBack} />
                </div>
                <div className="whatsapp-text walaa-regular-400">
                  {mockData["feedback"]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="bottom-links walaa-medium-500">
        <div>
          <ThemeButton
            title={travelData?.track_your_claim || "Track Your Claim"}
            classes={"other-product"}
            variant="link"
            onClickhandler={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
}

export default SuccessLeftComponent;
