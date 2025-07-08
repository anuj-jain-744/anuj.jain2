import React, { useState, useCallback } from "react";
import "./style.scss";
import { LanguageData } from "types/languageData";
import { AddDriverProps } from "types/endorsement";
import { getAmountWithIcon } from "@app-shell/utils/common";
import Download from "../../../../assets/SuccessPage/Download.svg";
import { useEndorsementDocuments } from "hook/common/usePrintDoc";
import {  docType ,PRODUCTCODE_HOME} from "constant";
import { useDownloadPDF } from "hook/common/useDownloadPdf";
import { AlertBox } from "components/AlertBox";
import { formatDateDmy } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";

export interface EndorsementSuccessProps {
  endorsementData: {
    benefitsPremiumData: {
      benefitNameEn: string;
      effectiveDate: string;
      benefitPrice: string | number;
      vatAmount: string | number;
      expiryDate: string;
    }[];
    driversPremiumData?: AddDriverProps[];
    productType?: string; 
  };
  languageData: LanguageData;
  endorsementNumber?: string;
}

const isEndrosement = true;

const EndorsementSuccess: React.FC<EndorsementSuccessProps> = ({
  endorsementData,
  languageData,
  endorsementNumber,
  productType=PRODUCTCODE_HOME,
}) => {
  const [alertDescription, setAlertDescription] = useState<string | undefined>(undefined);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
 

  const { processPDFs } = useDownloadPDF();

   const { data: endorsementLetterData, error: endorsementLetterError, isError: isEndorsementLetterError } =
    useEndorsementDocuments({
      policyNo: endorsementData?.policyNo,
      docType: docType.Endorsement.Endorsement_Letter.code,
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

  const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
  const address = userDetails?.userProfileData?.address;

  
  return (
    <>
      <AlertBox
        title={"Payment"}
        description={alertDescription}
        showAlertModal={showAlertModal}
        setShowAlertModal={() => setShowAlertModal(false)}
      />
      <div className="endorsement-card-section">
        <div className="body-content-for-endorsement-section">
          {productType==PRODUCTCODE_HOME && endorsementData?.benefitsPremiumData?.map((item, index) => (
            <div className="top-table" key={item.benefitNameEn + index}>
              <div className="box">
                <div className="box-content">
                  <div className="package-content package-border">
                    <div className="package-heading walaa-regular-400">
                       {languageData?.property}  
                    </div>
                    
                    <div className="package-value walaa-medium-500"> 
                      {address}
                    </div>
                  </div>

                  <div className="package-content-2 package-border two-row-div">

                    <div className="package-left-side">
                      <div className="package-heading walaa-regular-400">
                        {languageData?.sum_insured}
                      </div>
                      <div className="  walaa-medium-500">
                        {getAmountWithIcon(item?.benefitPrice)}
                      </div> 
                    </div>
                    <div className="package-right-side">
                      <div className="package-heading walaa-regular-400">
                        {languageData?.policy_period}
                      </div>
                      <div className="package-value walaa-medium-500">
                      {formatDateDmy(item?.effectiveDate)} -  {formatDateDmy(item?.expiryDate)}
                      </div>
                    </div>

                  </div>

                  <div className="package-content-2">
                    <div className="package-heading">{languageData?.premium_amount}</div>
                    <div className="package-value walaa-medium-500">
                      {getAmountWithIcon(item?.benefitPrice+item?.vatAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {endorsementData && (
            <div className="card-bottom-download">
              <div>
                <img src={Download} alt="download" />
                <p onClick={() => handleDownload(docType.Endorsement.Endorsement_Letter)}>
                  {languageData?.endorsement_schedule}
                </p>
              </div>
              <div>
                <img src={Download} alt="download" />
                <p>
                  {languageData?.payment_receipt}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EndorsementSuccess;