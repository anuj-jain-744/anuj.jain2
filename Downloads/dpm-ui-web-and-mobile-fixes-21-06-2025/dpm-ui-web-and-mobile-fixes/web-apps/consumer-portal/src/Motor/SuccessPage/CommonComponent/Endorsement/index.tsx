import React, { useState, useCallback } from "react";
import "./style.scss";
import { LanguageData } from "types/languageData";
import { AddDriverProps } from "types/endorsement";
import { geteDriverRelation, getGenderProfileIcon } from "utils/quoteAndBuy";
import { capitalizeNameFirstLetter, getLabelOfIqmaIdNationalId } from "@dpm/shared-module";
import { getAmountWithIcon } from "@app-shell/utils/common";
import Download from "../../../../assets/SuccessPage/Download.svg";
import { useEndorsementDocuments } from "hook/common/usePrintDoc";
import { docType } from "constant";
import { useDownloadPDF } from "hook/common/useDownloadPdf";
import { AlertBox } from "components/AlertBox";

export interface EndorsementSuccessProps {
  endorsementData: {
    benefitsPremiumData: {
      benefitNameEn: string;
      effectiveDate: string;
      benefitPrice: string;
    }[];
    driversPremiumData?: AddDriverProps[];
  };
  languageData: LanguageData;
  endorsementNumber?: string;
}

const isEndrosement = true;

const EndorsementSuccess: React.FC<EndorsementSuccessProps> = ({
  endorsementData,
  languageData,
  endorsementNumber,
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
          {endorsementData?.benefitsPremiumData?.map((item, index) => (
            <div className="top-table" key={index}>
              <div className="box">
                <div className="box-content">
                  <div className="package-content package-border">
                    <div className="package-heading walaa-regular-400">
                      {languageData?.choose_extra_benefits_add}
                    </div>
                    <div className="package-value walaa-medium-500">
                      {item?.benefitNameEn}
                    </div>
                  </div>
                  <div className="package-content-2 package-border">
                    <div className="package-heading walaa-regular-400">
                      {languageData?.effective_date}
                    </div>
                    <div className="package-value walaa-medium-500">
                    {item?.effectiveDate}
                    </div>
                  </div>
                  <div className="package-content-2">
                    <div className="package-heading">{languageData?.amount}</div>
                    <div className="package-value walaa-medium-500">
                      {getAmountWithIcon(item?.benefitPrice)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {endorsementData?.driversPremiumData?.map((item: AddDriverProps, index: number) => (
            <div className="top-table" key={index}>
              <div className="box">
                <div className="box-content">
                  <div>
                    <img
                      width={"40px"}
                      height={"40px"}
                      src={getGenderProfileIcon(item?.driver?.gender)}
                      alt="Driver Image"
                    />
                  </div>
                  <div className="package-content package-content-40 package-border">
                    <div className="package-heading walaa-regular-400">
                      {languageData?.driver_name}
                    </div>
                    <div className="package-value walaa-medium-500">
                      {capitalizeNameFirstLetter(item?.driver?.driverName ?? "")}
                    </div>
                  </div>
                  <div className="package-content-2 package-border">
                    <div className="package-heading walaa-regular-400">
                      {languageData
                        ? getLabelOfIqmaIdNationalId(item?.driver?.driverID, languageData)
                        : ""}
                    </div>
                    <div className="package-value walaa-medium-500">
                      {item?.driver?.driverID}
                    </div>
                  </div>
                  <div className="package-content-2">
                    <div className="package-heading">{languageData?.relationship}</div>
                    <div className="package-value walaa-medium-500">
                      {geteDriverRelation(item?.driver?.relation ?? 0, isEndrosement)}
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