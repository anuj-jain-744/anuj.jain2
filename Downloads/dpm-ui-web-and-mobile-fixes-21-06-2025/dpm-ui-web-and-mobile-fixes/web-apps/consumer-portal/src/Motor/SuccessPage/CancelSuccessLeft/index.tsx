import React, { useEffect, useState, useCallback } from "react";
import { Card } from "react-bootstrap";
import { LanguageData } from "types/languageData";
import "./style.scss";
import Line from "assets/SuccessPage/Line_new.svg";
import Download from "assets/SuccessPage/Download.svg";
import { formatDate } from "utils/formatDate";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { PolicyDetailsObj } from "types/policyDetails";
import { useApiCall, capitalizeNameFirstLetter } from "@dpm/shared-module";
import { getPlateNumber } from "utils/getPlateNumber";
import { getModelIcon } from "utils/getModelIcon";
import { MakeModelImageResponse } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
 
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
      <Card className="policy-receipt-policy-cancellation">
        <div className="header">
          <div className="logo">
            <div>
              <img
              className="car-logo"
              src={getModelIcon(policyData?.vehicleDetails?.vehicleMakeTextEn, policyData?.vehicleDetails?.vehicleMakeId, makeModelResponse ?? [])}
              alt="Car Logo" />
            </div>
            <div>
              <div className="policy-number-heading walaa-regular-400">
                {capitalizeNameFirstLetter(`${policyData?.vehicleDetails?.make} ${policyData?.vehicleDetails?.model}`)}
              </div>
              <div className="policy-number walaa-medium-500">
                {displayPlateNumber}
              </div>
            </div>
          </div>
          <div className="policy-number-container">
            <div className="policy-number-heading walaa-regular-400">
              {languageData?.policy_number}
            </div>
            <div className="policy-number walaa-medium-500">
              {policyData.policyNumber}
            </div>
          </div>
        </div>
        <div className="body-content">
          <div className="top-table">
            <div className="box">
              <div className="box-content">
                <div className="package-content">
                  <div className="package-heading walaa-regular-400">
                    {languageData?.cancellation_date}
                  </div>
                  <div className="package-value walaa-medium-500">
                    {todayDate}
                  </div>
                </div>
                <div>
                  <img src={Line} alt="Divider" />
                </div>
                <div className="package-content">
                  <div className="package-heading walaa-regular-400">
                    {languageData?.policy_status}
                  </div>
                  <div className="package-value walaa-medium-500">
                    {isCancelSuccess ? "Cancelled" : "Active"}
                  </div>
                </div>
                <div>
                  <img src={Line} alt="Divider" />
                </div>
                <div className="package-content">
                  <div className="package-heading walaa-regular-400">
                    {languageData?.refund_amount}
                  </div>
                  <div className="package-value walaa-medium-500">
                    {getAmountWithIcon(policyData?.refundValue)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-links">
            <div className="link-container">
              <div>
                <img src={Download} alt="Download Icon" />
              </div>
              <div className="links-content walaa-regular-400"  onClick={handleDownloadPolicy}>
                {languageData?.download_document}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-note-container">
          <div className="footer-note">
            <div className="note walaa-medium-500">{languageData?.note}</div>
            <div className="note-content walaa-regular-400">
              {languageData?.refund_process}
            </div>
          </div>
        </div>
      </Card>
  );
};
 
export default CancelSuccessLeft;