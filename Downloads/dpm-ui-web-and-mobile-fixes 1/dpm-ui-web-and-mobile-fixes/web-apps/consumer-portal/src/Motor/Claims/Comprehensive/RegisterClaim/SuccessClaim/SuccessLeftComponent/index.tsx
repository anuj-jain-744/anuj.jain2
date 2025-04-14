import "./style.scss";
import Line from "assets/SuccessPage/Line_new.svg";
import Download from "assets/SuccessPage/Download.svg";
import Whatsapp from "assets/SuccessPage/Whatsapp.svg";
import Mail from "assets/SuccessPage/Mail.svg";
import Branch from "assets/SuccessPage/Branch.svg";
import FeedBack from "assets/SuccessPage/FeedBack.svg";
import Nissan from "assets/SuccessPage/Nissan.svg";
import { Card } from "react-bootstrap";
import ThemeButton from "../../../../../Endorsement/sharedComponent/ThemeButton";
import { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import mockData from "./../success.json";

interface ISuccessLeftComponent {
  status: boolean;
  claimNo: any;
  claimLabel: any;
  claimsInfo?: any;
}

function SuccessLeftComponent({
  status,
  claimNo,
  claimLabel,
  claimsInfo
}: ISuccessLeftComponent) {
  const [languageData, setLanguageData] = useState();

  const { VITE_CONTENT_BASE_URI } = import.meta.env;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    );
    setLanguageData(response?.config[0]);
  };

  const SuccessPolicyCancellationCard = (
    <Card className="policy-receipt-policy-cancellation">
      <div className="header">
        <div className="logo">
          <div>
            <img src={Nissan} />
          </div>
          <div>
            <div className="policy-number-heading walaa-regular-400">
              {languageData?.motor_claim_no}
            </div>
            <div className="policy-number walaa-medium-500">{claimNo}</div>
          </div>
        </div>
      </div>
      <div className="body-content">
        <div className="top-table">
          <div className="box">
            <div className="box-content">
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                {languageData?.case_reference_no}
                </div>
                <div className="package-value walaa-medium-500">{claimsInfo?.refNo}</div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="package-content">
                <div className="package-heading walaa-regular-400">{languageData?.owner_id_label}</div>
                <div className="package-value walaa-medium-500">{claimsInfo?.ownerId}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-links">
          <div className="link-container">
            <div>
              <img src={Download} />
            </div>
            <div className="links-content walaa-regular-400">
              {languageData?.download_claim_documents}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-note-container">
        <div className="footer-note">
          <div className="note walaa-medium-500">Note :</div>
          <div className="note-content walaa-regular-400">
            {languageData?.we_have_received_your_appl}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="left-card-container">
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
            title={languageData?.track_your_claim}
            classes={"other-product"}
            variant="link"
          />
        </div>
      </div>
    </div>
  );
}

export default SuccessLeftComponent;
