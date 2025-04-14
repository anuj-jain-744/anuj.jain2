import "./style.scss";
import Line from "assets/SuccessPage/Line_new.svg";
import Download from "assets/SuccessPage/Download.svg";
import Whatsapp from "assets/SuccessPage/Whatsapp.svg";
import Mail from "assets/SuccessPage/Mail.svg";
import Branch from "assets/SuccessPage/Branch.svg";
import FeedBack from "assets/SuccessPage/FeedBack.svg";
import Nissan from "assets/SuccessPage/Nissan.svg";
import { Card } from "react-bootstrap";
import ThemeButton from "./../../../Motor/Endorsement/sharedComponent/ThemeButton";
import { useEffect, useState } from "react";
import { callAPI } from "@dpm/shared-module";
import mockData from "./../success.json";
import { formatDate } from "utils/formatDate";

function SuccessLeftComponent({ status, data, flag = false }) {
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
    setLanguageData(response.config[0]);
  };

  const today = new Date().toISOString();
  const todayDate = formatDate(today);

  const SuccessEndorsementCard = (
    <Card className="policy-receipt-endorsement">
      <div className="header">
        <div>
          <div className="policy-number-heading walaa-regular-400">
            {languageData?.policy_no}
          </div>
          {data?.policyNumber && <div className="policy-number walaa-medium-500">
            {data?.policyNumber}
          </div>}
        </div>
      </div>
      <div className="body-content">
        <div className="top-table">
          {Array.isArray(data?.addBenefitDatas) &&
            data.addBenefitDatas.map((benefit, index) => (
              <div key={index} className="box">
                <div className="box-content">
                  <div className="package-content">
                    <div className="package-heading walaa-regular-400">
                      {mockData["extra-benefit"]}
                    </div>
                    <div className="package-value walaa-medium-500">
                      {benefit.benefitNameEn}
                    </div>
                  </div>
                  <div>
                    <img src={Line} alt="line" />
                  </div>
                  <div className="package-content">
                    <div className="package-heading walaa-regular-400">
                      {mockData["date"]}
                    </div>
                    <div className="package-value walaa-medium-500">
                      {todayDate}
                    </div>
                  </div>
                  <div>
                    <img src={Line} alt="line" />
                  </div>
                  <div className="package-content">
                    <div className="package-heading walaa-regular-400">
                      {mockData["amount"]}
                    </div>
                    <div className="package-value walaa-medium-500">
                      SAR {benefit.benefitPrice}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="bottom-links">
          <div className="link-container">
            <div>
              <img src={Download} />
            </div>
            <div className="links-content walaa-regular-400">
              {languageData?.endorsement_schedule}
            </div>
          </div>
          <div className="link-container">
            <div>
              <img src={Download} />
            </div>
            <div className="links-content walaa-regular-400">
              {languageData?.payment_receipt}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const SuccessPolicyCancellationCard = (
    <Card className="policy-receipt-policy-cancellation">
      <div className="header">
        <div className="logo">
          <div>
            <img src={Nissan} />
          </div>
          <div>
            <div className="policy-number-heading walaa-regular-400">
              Nissan Magnite XE
            </div>
            <div className="policy-number walaa-medium-500">7403 - RUA</div>
          </div>
        </div>
        <div className="policy-number-container">
          <div className="policy-number-heading walaa-regular-400">
            {languageData?.policy_no}
          </div>
          <div className="policy-number walaa-medium-500">
            {data?.policyNumber}
          </div>
        </div>
      </div>
      <div className="body-content">
        <div className="top-table">
          <div className="box">
            <div className="box-content">
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                  Cancellation Date
                </div>
                <div className="package-value walaa-medium-500">
                  {todayDate}
                </div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                  Policy Status
                </div>
                <div className="package-value walaa-medium-500">Cancelled</div>
              </div>
              <div>
                <img src={Line} />
              </div>
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                  Refund Amount
                </div>
                <div className="package-value walaa-medium-500">
                  SAR 5,000.00
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
            <div className="links-content walaa-regular-400">
              Download Document
            </div>
          </div>
        </div>
      </div>
      <div className="footer-note-container">
        <div className="footer-note">
          <div className="note walaa-medium-500">Note :</div>
          <div className="note-content walaa-regular-400">
            The refund process will take 5 to 7 working days, and the amount
            will be credited to your account.
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="left-card-container">
      {data && status ? SuccessEndorsementCard : !flag ? SuccessPolicyCancellationCard: <></>}

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
            title={languageData?.explore_other_insurance_pr}
            classes={"other-product"}
            variant="link"
          />
        </div>
        <div>
          <ThemeButton
            title={status ? "View My Dashboard" : "Go to Dashboard"}
            classes={"endorsement-link"}
          />
        </div>
      </div>
    </div>
  );
}

export default SuccessLeftComponent;
