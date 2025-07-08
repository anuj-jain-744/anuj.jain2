import { Fragment } from "react";
import { Card } from "react-bootstrap";
import MotorIcon from "assets/SuccessPage/Nissan.svg";
import Line from "assets/SuccessPage/Line_new.svg";
import Download from "assets/SuccessPage/Download.svg";
import HomeLogo from "assets/SuccessPage/HomeLogo.svg";
import travelIcon from "assets/Dashboard/Travel-icon.svg";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { PRODUCTCODE_MOTOR, PRODUCTCODE_HOME, TRAVEL } from "constant";
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
  handleDownloadPolicy?: () => void;
}

const RegisterClaimCard = ({
  claimData,
  langData,
  handleDownloadPolicy,
}: Readonly<RegisterClaimCardProps>) => {
  function ListData({ claimData, langData }) {
    const productCode = claimData?.productCode ?? PRODUCTCODE_MOTOR;
    const claimInfo = {
      "01": [
        {
          label: langData?.case_reference_no,
          value: claimData?.claimsInfo?.refNo,
        },
        {
          label: langData?.owner_id_label,
          value: claimData?.claimsInfo?.ownerId,
        },
      ],
      "02": [
        {
          label: langData?.policy_holder,
          value: claimData?.policyHolder,
        },
        {
          label: langData?.date_of_loss,
          value: claimData?.dateOfLoss,
        },
        {
          label: claimData?.languageData?.estimatedClaimAmount,
          value: getAmountWithIcon(claimData?.estimatedClaimAmount),
        },
      ],
      [TRAVEL]: [
        {
          label: langData?.policy_holder,
          value: claimData?.policyHolder,
        },
        {
          label: langData?.date_of_loss,
          value: claimData?.dateOfLoss,
        },
        {
          label: langData?.estimated_claim_amount,
          value: getAmountWithIcon(claimData?.estimatedClaimAmount),
        },
      ],
    };

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
    <><Card className="policy-receipt-policy-cancellation-new">
      <div className="header">
        {claimData?.productCode === PRODUCTCODE_HOME ? (
          <>
          <div className="policy-number-container">
            <div className="policy-cancel-number-heading walaa-regular-400">
              {langData?.label_claim_no}
            </div>
            <div className="policy-cancel-number walaa-medium-500">
              {claimData?.claimNo}
            </div>
          </div><div className="policy-number-container">
              <div className="home-logo">
                <img src={HomeLogo} alt={langData?.motor_claim_no} />
              </div>
            </div>
            </>
        ) : claimData?.productCode === TRAVEL ? (
          <>
          <div className="header-travel">
            <div className="policy-number-container">
                <div className="policy-cancel-number-heading walaa-regular-400">
                  {langData?.travel_claim_no}
                </div>
              <div className="policy-cancel-number walaa-medium-500">
                {claimData?.claimNo}
                </div>                                
            </div>
            <div className="travel-logo">
                <div>
                  <img src={travelIcon} alt={langData?.travel_claim_no} />
                </div>
            </div>
          </div>
          </>
        ) : (
      <div className="header-new">
            <div className="policy-number-container">
            <div className="policy-cancel-number-heading walaa-regular-400">
              {langData?.motor_claim_no}
            </div>
            <div className="policy-cancel-number walaa-medium-500">
              {claimData?.claimNo}
            </div>
          </div><div className="policy-number-container">
              <div className="home-logo">
               <img src={MotorIcon} alt={langData?.motor_claim_no} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="body-content">
        <ListData claimData={claimData} langData={langData} />
      </div>
        
        <div
          className="bottom-links"
          onClick={() => handleDownloadPolicy?.()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleDownloadPolicy?.();
            }
          }}
        >
          <div className="link-container">
            <div className="download-icon-wrapper">
              <img src={Download} alt={langData?.download_claim_documents} />
            </div>
            <div className="links-content walaa-regular-400">
              {langData?.download_claim_documents}
            </div>
          </div>
        </div>
    </Card>
    <Card className="policy-receipt-note-section">
        <div className="footer-note-section">
          <div className="note-section walaa-medium-500">{'Note'}</div>
          <div className="note-section-content walaa-regular-400">
            {langData?.we_have_received_your_appl}
          </div>
        </div>
      </Card></>
  );
};

export default RegisterClaimCard;
