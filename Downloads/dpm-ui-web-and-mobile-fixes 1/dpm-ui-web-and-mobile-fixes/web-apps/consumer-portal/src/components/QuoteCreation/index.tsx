import PDF from "assets/IbanValidation/PDF.svg";
import ShareButton from "components/ShareButton";
import { useEffect, useState } from "react";
import { useApiCall } from "@dpm/shared-module";
import { base64ToBlob, createAndDownloadZip } from "utils/fileUtil";
import { PDFDataStructure } from "types/policyDocuments";
import useZipFiles from "Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles";
import "./index.scss";
import { AlertBox } from "components/AlertBox";

const useClaimDocDownload = (createZip: (files: Array<{ name: string; data: string }>) => void) => {
  const downloadDocuments = async (claimsData: PDFDataStructure) => {
    const allDocuments = [
      ...(Array.isArray(claimsData) ? claimsData : [claimsData]),
    ];
    if (allDocuments.length === 0) {
      console.warn("No PDF data available to download.");
      return;
    }
    await createAndDownloadZip(
      allDocuments.map((doc) => ({
        name: `${doc.fileName}.pdf`,
        data: base64ToBlob(doc.model, "application/pdf"),
      })),
      createZip
    );
  };
  return { downloadDocuments };
};

export default function QuoteCreation({
  quotationNum,
  isPaymentPage = true,
}: Readonly<{
  quotationNum: string;
  isPaymentPage?: boolean;
}>) {
  const [paymentConfig, setPaymentConfig] = useState<{ [key: string]: string }>(
    {}
  );
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const { makeApiCall: cmsCall, data: cmsData } = useApiCall<
    { config: { [key: string]: string } },
    undefined
  >(1, "payment-config", "get");

  useEffect(() => {
    cmsCall();
  }, [cmsCall]);

  useEffect(() => {
    if (cmsData) {
      setPaymentConfig(cmsData.config);
    }
  }, [cmsData, setPaymentConfig]);

  const paymentLanguageData = paymentConfig;

  const allDocUrl = `/Dashboard/V1/Download/Quotation/AllDoc?quoteReferenceNo=${quotationNum}`;
  
  const {
    makeApiCall: pdfDownload,
    errors,
    data: responseData,
  } = useApiCall<PDFDataStructure, unknown>(11, allDocUrl, "post");

  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });

  const { createZip } = useZipFiles();
  const { downloadDocuments: claimDownloadDocuments } =
    useClaimDocDownload(createZip);

  const handleDownload = async () => {
    try {
      await pdfDownload();
    } catch (error) {
      console.error("An error occurred while fetching the data", error);
    }
  };

  useEffect(() => {
  }, [responseData]);
  useEffect(() => {
    if (responseData) {
      claimDownloadDocuments(responseData).catch((error) => {
        console.error("Failed to download documents:", error);
      });
    }
  }, [responseData, claimDownloadDocuments]);

  useEffect(() => {
    if (errors) {
      setApiErrorMessage({
        title: "Error",
        description: "An error occurred while fetching the data",
      });
      setShowAlertModal(true);
    }
  }, [errors]);
  return (
    <>
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={() => setShowAlertModal(false)}
      />
      {isPaymentPage && (
        <div className="quotation-number-container">
          <div className="quotation-no-container">
            <div className="quotation-heading walaa-regular-400">
              {paymentLanguageData?.field_quotation_no}:
            </div>
            <div className="quotation-document">
              <div
                className="quotation-num walaa-medium-500"
                onClick={handleDownload}
              >
                {quotationNum}
              </div>
              <div>
                <img src={PDF} alt="PDF" />
              </div>
            </div>
          </div>
          {isPaymentPage && paymentLanguageData && (
            <ShareButton
              paymentLanguageData={paymentLanguageData}
              showIcon={true}
            />
          )}
        </div>
      )}
    </>
  );
}
