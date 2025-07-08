import React, { useEffect, useState } from "react";
import ThemeButton from "../../components/ThemeButton/ThemeButton";
import "./index.scss";
import Copy from "assets/Payment/copy.svg";
import { useApiCall } from "@dpm/shared-module";
import {
  ResponsePaymentOption,
  PaymentProviderMethods,
} from "./types/providerPayment";
import ZeroState from "../../pages/personalDesktop/MyPolicies/MyRequest/ZeroState";
import { AlertBox } from "../../components/AlertBox";
import { CmsPayment } from "./types/cmsPayment";
import { useLocation } from "react-router-dom";
import { PAYMENT_INFO, PRODUCTCODE_MOTOR, PRODUCTSAPI } from "constant";
import { getWebHookCallParams } from "utils/paymentUtils";

interface CardOptionProps {
  readonly productCode: string;
  readonly quoteData: ResponsePaymentOption;
  readonly paymentData: CmsPayment;
  readonly paymentMethods: PaymentProviderMethods[];
  readonly premiumInfo: {
    premiumDue: number;
    finalPremium: number;
    taxFeeBreakdowns: Array<{
      amount: number;
      percentage: number;
    }>;
  };
}

const SadadOptions = ({
  quoteData,
  premiumInfo,
  paymentData,
  paymentMethods,
  productCode,
}: CardOptionProps) => {
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });
  const { makeApiCall: initialWebHookCall, errors: initalError, data: intianlData } = useApiCall<unknown, unknown>(5, "Payment/Webhook", "post");
  const { makeApiCall: progressWebHookCall, errors: progressError, data: progressData } = useApiCall<unknown, unknown>(5, "Payment/Webhook", "post");

  const {
    makeApiCall: sadadApiCall,
    errors: sadadError,
    data: sadadData,
  } = useApiCall<unknown, unknown>(5, PAYMENT_INFO.sadadPaymentUrl, "post");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isDivOpen, setIsDivOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const location = useLocation();
  const propsData = location?.state?.quoteData || {};
  const InvoiceVatPercentage = PAYMENT_INFO.invoiceVatPercentage;
  const currentDate = new Date();
  const expiryDate = new Date(currentDate.getTime() + 72 * 60 * 60 * 1000);
  const formattedExpiryDate = expiryDate.toISOString().split("T")[0];
  const [cardData, setCardData] = useState<PaymentProviderMethods | undefined>();
  const [transactionIds, setTransactionIds] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethods && quoteData) {
      const cardData = paymentMethods?.find((method) => method.providerDesc === PAYMENT_INFO.paymentMethods.SADAD_PAY);
      const generatedTransactionId = `${quoteData?.quoteEndorsementNumber ?? propsData?.quoteNo
        }_${productCode}_${cardData?.methodCode}_${new Date().valueOf()}`;
      setTransactionIds(generatedTransactionId);
      setCardData(cardData);
    }
  }, [paymentMethods, productCode, quoteData]);

  const handleSadadCall = async () => {
    const productName = PRODUCTSAPI[productCode ?? PRODUCTCODE_MOTOR]?.productName;
    const customerEmail = quoteData?.email?.trim();
    const sadadHandleData = {
      productDescription: productName,
      totalAmount: quoteData?.premiumDue.toFixed(2),
      providerCompanyName: PAYMENT_INFO.providerCompanyName,
      invoiceDetails: [
        {
          invoiceholderId: quoteData?.nationalId,
          customerNameEn: quoteData?.customerNameEnglish,
          customerNameAr: quoteData?.customerNameArabic,
          invoiceAmount: premiumInfo ? premiumInfo?.premiumDue.toFixed(2) : quoteData?.premiumDue.toFixed(2),
          invoiceAmountWithoutVat: premiumInfo ? premiumInfo?.finalPremium.toFixed(2) : quoteData?.amountWithoutTax?.toFixed(2),
          invoiceVatAmount: premiumInfo ? premiumInfo?.taxFeeBreakdowns?.[0]?.amount.toFixed(2) : quoteData?.taxAmount?.toFixed(2),
          invoiceVatPercentage: (parseFloat(InvoiceVatPercentage.replace("%", "")) || 0).toFixed(2),
          invoiceNumber: transactionIds,
          customerMobileNumber: quoteData?.mobileNumber?.replace(/^0/, "966"),
          customerEmail: customerEmail ? customerEmail : "test@test.com",
          invoiceExpiryDate: formattedExpiryDate
        },
      ],
    };

    setIsLoading(true);
    try {
      await sadadApiCall(sadadHandleData);
      setIsDivOpen(true);
    } catch (error) {
      console.error("Error during Sadad API call:", error);
      setShowAlertModal(true);
      setIsDivOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiErrorMessage?.title === "" && (initalError || progressError || sadadError)) {
      setApiErrorMessage({
        title: initalError?.name ?? progressError?.name ?? sadadError?.name,
        description: initalError?.messages?.message_en ?? progressError?.messages?.message_en ?? sadadError?.messages?.message_en,
      });
      setShowAlertModal(true);
      setIsDivOpen(false);
      setIsSubmitDisabled(true)
    }
  }, [initalError, progressError, sadadError]);

  useEffect(() => {
    if (intianlData && progressData) {
      handleSadadCall();
    }
  }, [intianlData, progressData]);

  const handleSubmit = (event: React.FormEvent) => {
    if (event.preventDefault) event.preventDefault();
    const webHooks = getWebHookCallParams(transactionIds, cardData, quoteData, paymentData)
    if (webHooks) {
      initialWebHookCall(webHooks?.initial);
      progressWebHookCall(webHooks.progress);
    }
  };

  const handleCopy = () => {
    const textToCopy = document
      .querySelector(".copy-content")
      ?.textContent?.trim();
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
    }
  };
  const handleModalClose = () => {
    setShowAlertModal(false);
  };

  return (
    <div className="sadad-expandable">
      {isLoading ? (
        <ZeroState showOnlyVideo={true} />
      ) : (
        isDivOpen && (
          <div className="sadad-inner-content">
            <div className="sadad-inner-left">
              <p>{paymentData?.sadad_payment_msg}</p>
            </div>
            <div className="sadad-inner-right">
              <p>{paymentData?.sadad_payment_id}</p>
              <div className="copy-content">
                {sadadData?.sadadInvoice}
                <img onClick={handleCopy} src={Copy} alt="copy" />
              </div>
            </div>
          </div>
        )
      )}
      <ThemeButton
        classes="walaa-medium-500"
        isDisabled={isLoading || isDivOpen || isSubmitDisabled}
        title={paymentData?.generate_sadad_code}
        variant="trackClaim"
        onClickhandler={handleSubmit}
      />
      <AlertBox
        title={apiErrorMessage?.title}
        description={apiErrorMessage?.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleModalClose}
      />
    </div>
  );
};

export default SadadOptions;
