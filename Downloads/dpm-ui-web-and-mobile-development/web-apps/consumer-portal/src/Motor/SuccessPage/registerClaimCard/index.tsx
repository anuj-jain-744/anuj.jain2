import { Fragment } from "react";
import { Card } from "react-bootstrap";
import Nissan from "assets/SuccessPage/Nissan.svg";
import Line from "assets/SuccessPage/Line_new.svg";
import Download from "assets/SuccessPage/Download.svg";
import HomeLogo from "assets/SuccessPage/HomeLogo.svg";
import "./style.scss";
import { PRODUCTCODE_MOTOR, PRODUCTCODE_HOME } from "constant";
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

  function ListData({ claimData, langData }) {
    const productCode = claimData?.productCode ?? PRODUCTCODE_MOTOR;
    const claimInfo = {
      "01": [
        {
          label: langData?.case_reference_no,
          value: claimData?.claimsInfo?.refNo
        },
        {
          label: langData?.owner_id_label,
          value: claimData?.claimsInfo?.ownerId
        },
      ],
      "02": [
        {
          label: langData?.policy_holder,
          value: claimData?.policyHolder
        },
        {
          label: langData?.date_of_loss,
          value: claimData?.dateOfLoss
        },
        {
          label: claimData?.languageData?.estimatedClaimAmount,
          value: claimData?.estimatedClaimAmount
        }
      ]
    }
    return (
      <div className="top-table">
        <div className="box">
          {claimData?.productCode === PRODUCTCODE_HOME &&
            <div>
              <div>{langData?.property}</div>
              <div>{claimData?.address}</div>
            </div>
          }
          <div className="box-content">
            {claimInfo[productCode]?.map((item, index) => (
              <Fragment key={index}>
                <div className="package-content">
                  <div className="package-heading walaa-regular-400">
                    {item?.label}
                  </div>
                  <div className="package-value walaa-medium-500">
                    {item?.value}
                  </div>
                </div>
                {index < Number(claimInfo[productCode]?.length - 1) && <div>
                  <img src={Line} alt={langData?.owner_id_label} />
                </div>}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="policy-receipt-policy-cancellation">
      <div className="header">
        {claimData?.productCode === PRODUCTCODE_HOME ? (
          <div className="header-home-success-container">
            <div className="home-left">
              <div className="icon">
                <div className="homo-logo">
                  <img src={HomeLogo} alt={langData?.motor_claim_no} />
                </div>
              </div>
              <div className="main">
                <div className="claim-num">
                  <div className="home-claim-number-heading walaa-regular-400">
                    {langData?.label_claim_no}
                  </div>
                  <div className="home-claim-number walaa-medium-500">
                    {claimData?.claimNo}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}

      </div>
      <div className="body-content">
        <ListData claimData={claimData} langData={langData} />
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
