import React, { useState, useCallback } from "react";
// import "../Endorsement/style.scss";
import style from "./style.module.scss";
import { LanguageData } from "types/languageData";
import { AddDriverProps } from "types/endorsement";
import Download from "../../../../assets/SuccessPage/Download.svg";
import ShareIcon from "../../../../assets/SuccessPage/Share.svg";
import { useEndorsementDocuments } from "hook/common/usePrintDoc";
import {  docType } from "constant";
import { useDownloadPDF } from "hook/common/useDownloadPdf";
import { AlertBox } from "components/AlertBox";
import { PolicyDetail } from "./PolicyDetail";
import { getClaimForPolicyDetails, getEndorsementDataForPolicyDetails, makeDataBuyMotor } from "./MotorSuccessUtils";
import { PolicyHeader } from "./PolicyHeader";
import { PolicyDataProps } from "types/viewQuote";
import CarIcon from "assets/PolicyCard/Car.svg";
import { ClaimDataProps, EndorsementDataProps } from "Motor/SuccessPage/SuccessDataTypes";

export interface PolicyCardSuccessProps {
  endorsementData?: EndorsementDataProps;
  policyData?: PolicyDataProps;
  languageData: LanguageData;
  endorsementNumber?: string;
  coverageName: string;
  policyPeriod?: string;
  plateNumber?: string;
  repairCondition?: string;
  handleDownloadPolicy?: () => void; 
  isEndosementPolicy?: boolean;
  endoEffectiveDate?:string;
  headerLabel: string;
  headerValue: string;
  claimData: ClaimDataProps
}


const PolicyCardSuccess: React.FC<PolicyCardSuccessProps> = ({
  endorsementData,
  languageData,
  endorsementNumber,
  coverageName,
  policyData,
  policyPeriod,
  plateNumber,
  repairCondition,
  handleDownloadPolicy,
  isEndosementPolicy,
  endoEffectiveDate,
  headerLabel,
  headerValue,
  claimData
}) => {
  const [alertDescription, setAlertDescription] = useState<string | undefined>(undefined);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
 

  const { processPDFs } = useDownloadPDF();

   const { data: endorsementLetterData, error: endorsementLetterError, isError: isEndorsementLetterError } =
    useEndorsementDocuments({
      policyNo: endorsementData?.policyNo,
      docType: docType.Endorsement.Endorsement_Letter,
      endorsementNo: endorsementNumber,
    });


  const handleDownload = useCallback(
    (docTypeKey: string) => {
      let data, error, isError;

      if (docTypeKey === docType.Endorsement.Endorsement_Letter || docType.Endorsement.Endorsement_Letter) {
        data = endorsementLetterData;
        error = endorsementLetterError;
        isError = isEndorsementLetterError;
      } 

      try {
        processPDFs(data, { format: "pdf", autoDownload: true });
      } catch (err) {
        setAlertDescription(error?.messageEn || "Error processing PDFs.");
        setShowAlertModal(true);
      }

      if (isError) {
        setAlertDescription(error?.messageEn);
        setShowAlertModal(true);
      }
    },
    [endorsementLetterData, endorsementLetterError, isEndorsementLetterError, processPDFs]
  );
const endoDetails=getEndorsementDataForPolicyDetails(endorsementData,endoEffectiveDate,languageData);
const claimDetails = claimData && getClaimForPolicyDetails(claimData, languageData);

  
  
  return (
    <div className={style.successCardWrapper}>
      <AlertBox
        title={"Payment"}
        description={alertDescription}
        showAlertModal={showAlertModal}
        setShowAlertModal={() => setShowAlertModal(false)}
      />
     <PolicyHeader label={headerLabel} value={headerValue} coverageName={coverageName} repairCondition={repairCondition} imgSrc={CarIcon} />
      <div className={style.PolicyCardSection}>
        <div className={style.policyCardContent}>
          {isEndosementPolicy && endoDetails && <PolicyDetail data={endoDetails} />}
          {!isEndosementPolicy && policyData && <PolicyDetail data={makeDataBuyMotor(policyData, policyPeriod,plateNumber, languageData)} />}
          {claimDetails && <PolicyDetail data={claimDetails} />}
          <div className={style.cardBottomDownload}>
              <div>
                <img src={Download} alt="download" />
                <p onClick={() => isEndosementPolicy ? handleDownload(docType.Endorsement.Endorsement_Letter):handleDownloadPolicy()}>
                  {isEndosementPolicy? languageData?.endorsement_document : claimData? languageData?.claim_documents: languageData?.policy_documents}
                </p>
              </div>
              <div>
                <img src={ShareIcon} alt="download" />
                <p>
                  {languageData?.share}
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyCardSuccess;