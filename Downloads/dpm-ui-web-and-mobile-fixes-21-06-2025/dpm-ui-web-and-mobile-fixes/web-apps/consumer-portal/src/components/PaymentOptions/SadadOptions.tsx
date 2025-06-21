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
import { PRODUCTCODE_MOTOR, PRODUCTSAPI } from "constant";

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
  } = useApiCall<unknown, unknown>(5, "Payment/UploadInvoice", "post");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isDivOpen, setIsDivOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const location = useLocation();
  const propsData = location?.state?.quoteData || {};
  const onlineMotor = "OnlineMotor";
  const InvoiceVatPercentage = "15%";
  const walaa_online = "WalaaOnlineRecovery";
  const webPlatform = 1;

const WEBHOOK_TYPES = {
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PAYMENT_INPROGRESS: "PAYMENT_IN_PROGRESS",
};

  const currentDate = new Date();
  const expiryDate = new Date(currentDate.getTime() + 72 * 60 * 60 * 1000); 
  const formattedExpiryDate = expiryDate.toISOString().split("T")[0]; 
  const [transactionIds, setTransactionIds] = useState<string | null>(null);


  
  useEffect(() => {
    if (paymentMethods && quoteData) {
      const generatedTransactionId = `${
        quoteData?.quoteEndorsementNumber ?? propsData?.quoteNo
      }_${productCode}_07_${new Date().valueOf()}`;
      setTransactionIds(generatedTransactionId);
    }
    
  }, [paymentMethods, productCode, quoteData]);

  const handleWebHookCall = async () => {
    const cardData = paymentMethods?.find((method) => method.providerDesc === "EDAAT"); 
    if(cardData) {
      const webHookInitial  = {
        nationalID: quoteData?.nationalId,
        platform: webPlatform,
        invoiceNumber: quoteData?.quoteEndorsementNumber,
        paymentGatewayProviderID: cardData?.providerCode,
        paymentGatewayProviderName: cardData?.providerDesc,
        paymentMethodID: cardData?.methodCode,
        paymentMethodName: cardData?.methodDesc,
        paymentGatewayRef: transactionIds,
        paymentAmount: quoteData?.premiumDue + "",
        currency: paymentData?.sar,
        webhookType: WEBHOOK_TYPES?.PAYMENT_INITIATED,
      };
      const webHookProgress = {
        ...webHookInitial,
        webhookType: WEBHOOK_TYPES?.PAYMENT_INPROGRESS,
      };
      await initialWebHookCall(webHookInitial);
      await progressWebHookCall(webHookProgress);
      
    }
  }

  const handleSadadCall = async () => {
    const productName = PRODUCTSAPI[productCode ?? PRODUCTCODE_MOTOR]?.productName;
    const sadadHandleData = {
      ProductDescription: productName,
      ProductModule: productName,
      TotalAmount: quoteData?.premiumDue.toFixed(2),
      ProviderCompanyName: onlineMotor,
      InvoiceDetails: [
        {
          InvoiceholderID: quoteData?.nationalId,
          CustomerNameEn:
          quoteData?.customerNameEnglish,
          CustomerNameAr:
            quoteData?.customerNameArabic,
          RequestExpiryDate:formattedExpiryDate,
          PaymentDescriptionEn: walaa_online,
          PaymentDescriptionAr: walaa_online,
          InvoiceAmount: premiumInfo ? premiumInfo?.premiumDue.toFixed(2): quoteData?.premiumDue.toFixed(2),
          InvoiceAmountWithoutVat: premiumInfo ? premiumInfo?.finalPremium.toFixed(2): quoteData?.amountWithoutTax?.toFixed(2),
          InvoiceVatAmount: premiumInfo ? premiumInfo?.taxFeeBreakdowns?.[0]?.amount.toFixed(2): quoteData?.taxAmount?.toFixed(2),
          InvoiceVatPercentage: (parseFloat(InvoiceVatPercentage.replace("%", "")) || 0).toFixed(2),
          InvoiceNumber: transactionIds,
          CustomerMobileNumber:
          quoteData?.mobileNumber?.replace(/^0/, "966"),
          CustomerEmail: quoteData?.email ?? "test@test.com",
          InvoiceBreakdown: null,
          InvoiceDiscounts: null,
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
      handleWebHookCall();
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
                {sadadData?.[0]?.InvoiceNumber}
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
