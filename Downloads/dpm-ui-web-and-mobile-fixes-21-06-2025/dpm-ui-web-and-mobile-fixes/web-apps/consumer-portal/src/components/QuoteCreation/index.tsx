import PDF from "assets/IbanValidation/PDF.svg";
import ShareButton from "components/ShareButton";
import { useEffect, useState, useCallback } from "react";
import { useApiCall } from "@dpm/shared-module";
import "./index.scss";
import { AlertBox } from "components/AlertBox";
import { useQuotationDocuments } from "hook/common/usePrintDoc";
import { docType } from "constant";
import { useDownloadPDF } from "hook/common/useDownloadPdf";

export default function QuoteCreation({
  quotationNum,
  isPaymentPage = true,
  isQuote = true,
}: Readonly<{
  quotationNum: string;
  isPaymentPage?: boolean;
  isQuote?: boolean;
}>) {
  const [paymentConfig, setPaymentConfig] = useState<{ [key: string]: string }>(
    {}
  );
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string | undefined>(undefined);
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



  const { data: quotationDocuments, error: quotationError, isError } =
  useQuotationDocuments({ quoteReferenceNo: quotationNum, docType: docType.Quotation.Quotation_Letter });

  const { processPDFs } = useDownloadPDF();
  const handleDownload = useCallback(() => {
      try {
        processPDFs(quotationDocuments, { format: "pdf", autoDownload: true });
      } catch (err) {
        setAlertDescription(quotationError?.messageEn || "Error processing PDFs.");
        setShowAlertModal(true);
      }
      if (isError) {
      setAlertDescription(quotationError?.messageEn);
      setShowAlertModal(true);
    }
    }, [quotationDocuments, quotationError, isError]);
  return (
    <>
      <AlertBox
        title={"Payment"}
        description={alertDescription}
        showAlertModal={showAlertModal}
        setShowAlertModal={() => setShowAlertModal(false)}
      />
      {isPaymentPage && (
        <div className="quotation-number-container">
          <div className="quotation-no-container">
            <div className="quotation-heading walaa-regular-400">
              {isQuote ? paymentLanguageData?.field_quotation_no: paymentLanguageData?.endoRequestReferenceNo}:
            </div>
            <div className="quotation-document">
              <div
                className="quotation-num walaa-medium-500"
                role="button"
                tabIndex={0}
                onClick={handleDownload}
              >
                {quotationNum}
              </div>
              {isQuote && <div className="imgDiv">
                <img src={PDF} alt="PDF" />
              </div>}
            </div>
          </div>
          {isQuote && isPaymentPage && paymentLanguageData && (
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
