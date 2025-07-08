import React, { useEffect, useState, useCallback } from "react";
import { Card } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import "./style.scss";
import Download from "assets/SuccessPage/Download.svg";
import { formatDate } from "utils/formatDate";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { PolicyDetailsObj } from "types/policyDetails";
import { useApiCall, capitalizeNameFirstLetter } from "@dpm/shared-module";
import { getPlateNumber } from "utils/getPlateNumber";
import { getModelIcon } from "utils/getModelIcon";
import { MakeModelImageResponse } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import Ellipse from "assets/Dashboard/Ellipse_icon.svg";
import { MOTOR_COMP } from "constant";
import cancelMotorIcon from "assets/CancelPolicy/cancelMotorIcon.svg";
interface CancelSuccessLeftProps {
  isCancelSuccess: boolean;
  policyData: PolicyDetailsObj;
  handleDownloadPolicy?: () => void;
}
 
const CancelSuccessLeft: React.FC<CancelSuccessLeftProps> = ({
  policyData,
  isCancelSuccess,
  handleDownloadPolicy,
}) => {
 
  const [languageData, setLanguageData] = useState<LanguageData | undefined>();
  const [makeModelResponse, setMakeModelResponse] = useState();
 
  const displayPlateNumber = getPlateNumber({
    plateNo: policyData?.vehicleDetails?.plateNumber,
    plateNoText1: policyData?.vehicleDetails?.plateNoText1,
    plateNoText2: policyData?.vehicleDetails?.plateNoText2,
    plateNoText3: policyData?.vehicleDetails?.plateNoText3,
  });
 
  const { makeApiCall, data: cmsData, error } = useApiCall<
    { config: LanguageData[] },
    unknown
  >(1, "consumerportal-config", "get");
 
  const fetchData = useCallback(async () => {
    try {
      await makeApiCall();
    } catch (err) {
      console.error("Error fetching CMS data:", err);
    }
  }, [makeApiCall]);
 
  const today = new Date().toISOString();
  const todayDate = formatDate(today);
 
  const { makeApiCall: makeModelImageApiCall, data: modelImageResponse } =
  useApiCall<{ motor_makes: MakeModelImageResponse[] }, undefined>(
    1,
    "consumerportal-config",
    "post",
    "en"
  );
 
  useEffect(() => {
    makeModelImageApiCall();
  }, []);
 
  useEffect(() => {
    if (modelImageResponse) {
      setMakeModelResponse(modelImageResponse?.motor_makes);
    }
  }, [modelImageResponse]);
 
  useEffect(() => {
    fetchData();
  }, [fetchData]);
 
  useEffect(() => {
    if (cmsData) {
      setLanguageData(cmsData.config[0]);
    }
  }, [cmsData]);

  return (
      <><Card className="policy-receipt-policy-cancellation-new-one">
      <div className="header">
        <div className="policy-number-container">
          <div className="policy-number-heading walaa-regular-400">
            {languageData?.policy_number}
          </div>
          <div className="policy-number walaa-medium-500">
            {policyData.policyNumber}
          </div>
          
        </div>
        <div className="logo">
          <div>
            <img
              className="car-logo"
              src={cancelMotorIcon}
              alt="Car Logo" />
          </div>
          </div>
      </div>
      <div className="body-content">
      <div className="policy-type walaa-medium-500">
                <div className="type">
                  {policyData.coverageName}
                </div>
                {policyData.coverageType === MOTOR_COMP &&(<>
                <div>
                  <img src={Ellipse} />
                </div>
                <div className="type">
                  {policyData.repairType}
                </div>
                </>)}
              </div>
        <div className="top-table">
          <div className="box">
            <div className="box-content">
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                 
                {capitalizeNameFirstLetter(`${policyData?.vehicleDetails?.make} ${policyData?.vehicleDetails?.model}`)}
                </div>
                <div className="package-value walaa-medium-500">
                 
                  {displayPlateNumber}
                </div>
              </div>
              
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                {languageData?.start_date}
                </div>
                <div className="package-value walaa-medium-500">
                {policyData?.startDate ? formatDate(policyData.startDate) : ""}
                </div>
              </div>
              
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                {languageData?.cancellation_date}
                </div>
                <div className="package-value walaa-medium-500">
                {todayDate}
                </div>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="box-content">
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                {languageData?.policy_status}
                </div>
                <div className="package-value walaa-medium-500">
                {isCancelSuccess ? languageData?.cancelled : languageData?.active}
                </div>
              </div>
              
              <div className="package-content">
                <div className="package-heading walaa-regular-400">
                {languageData?.refund_amount}
                </div>
                <div className="package-value walaa-medium-500">
                {getAmountWithIcon(policyData.refundValue)}
                </div>
              </div>
              
            </div>
          </div>
        </div>
       
      </div>
      <div className="bottom-links-new">
          <div className="link-container">
            <div className="download-icon-wrapper">
              <img src={Download} alt="Download Icon" />
            </div>
            <div className="links-content walaa-regular-400" onClick={handleDownloadPolicy}>
              {languageData?.download_document}
            </div>
          </div>
        </div>
    </Card><>
        <Card className="policy-receipt-note-section">
        <div className="footer-note-section">
          <div className="note-section walaa-medium-500">{languageData?.note}</div>
          <div className="note-section-content walaa-regular-400">
            {languageData?.refund_process}
          </div>
        </div>
        </Card>
      </></>
  );
};
 
export default CancelSuccessLeft;