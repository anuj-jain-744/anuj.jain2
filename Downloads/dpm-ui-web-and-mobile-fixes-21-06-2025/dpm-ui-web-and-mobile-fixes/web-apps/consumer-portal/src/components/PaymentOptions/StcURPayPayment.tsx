import { useEffect, useState } from "react";
import "./index.scss";
import { OTPWrapper } from "components/PaymentOTPValidation/OtpWrapper";
import { LoaderOverlay } from "@app-shell/components/Loader";
import ThemeTextbox from "claims/components/ThemeTextbox";
import { ThemeButton } from "components/index";
import { getAmountText, useApiCall } from "@dpm/shared-module";
import { CmsPayment } from "./types/cmsPayment";
import { getWebHookCallParams } from "utils/paymentUtils";
import { PaymentProviderMethods, ResponsePaymentOption } from "./types/providerPayment";
import { LanguageData } from "types/languageData";
import { AlertBox } from "components/AlertBox";
import { getCurrencySymbol } from "@app-shell/utils/common";
import { PAYMENT_INFO } from "constant";

interface ApiError {
  title: string | undefined;
  description: string | undefined;
}

interface StcURPayPaymentProps {
  readonly productCode: string;
  readonly paymentData: CmsPayment;
  readonly quoteData: ResponsePaymentOption;
  readonly paymentMethods: PaymentProviderMethods[];
  readonly languageData: LanguageData;
  readonly payType: string;
  readonly mobileNumber: string;
  readonly navigateTo?: (url: string, navigate: any) => void;
}

interface PaymentDetails {
  transactionId: string;
  cardData: PaymentProviderMethods | null | undefined;
  otpRequestPayload: any;
  mobileNumber: string;
  loading: boolean;
  callGenerateOtp: boolean;
}

export default function StcURPayPayment({
  productCode,
  paymentData,
  quoteData,
  paymentMethods,
  languageData,
  payType,
  mobileNumber,
  navigateTo
}: StcURPayPaymentProps) {
  const [paymentDets, setPaymentDets] = useState<PaymentDetails>({
    transactionId: '', cardData: null,
    otpRequestPayload: null,
    mobileNumber: mobileNumber,
    loading: false,
    callGenerateOtp: false
  });

  const { makeApiCall: initialWebHookCall, errors: initalError, data: intianlData } = useApiCall<unknown, unknown>(5, "Payment/Webhook", "post");
  const { makeApiCall: progressWebHookCall, errors: progressError, data: progressData } = useApiCall<unknown, unknown>(5, "Payment/Webhook", "post");

  const [apiErrorMessage, setApiErrorMessage] = useState<ApiError>({
    title: "",
    description: ""
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  useEffect(() => {
    if (paymentMethods.length && quoteData) {
      const cardData = paymentMethods.find((method) => (method.methodDesc?.toLowerCase() === payType));
      const transactionId = `${quoteData?.quoteEndorsementNumber}_${productCode}_${payType === 'installment'?4:5}_${new Date().valueOf()}`;
      setPaymentDets((prevValue) => ({
        ...prevValue,
        transactionId,
        cardData
      }));
    }
  }, [paymentMethods, productCode, quoteData]);

  useEffect(() => {
    if (apiErrorMessage?.title === "" && (initalError || progressError)) {
      setPaymentDets((prevValue) => ({
        ...prevValue,
        loading: false,
      }));
      setApiErrorMessage({
        title: initalError?.name ?? progressError?.name,
        description: initalError?.messages?.message_en ?? progressError?.messages?.message_en,
      });
      setShowAlertModal(true);
    }
  }, [initalError, progressError, apiErrorMessage]);

  useEffect(() => {
    if (intianlData && progressData && !initalError && !progressError) {
      setPaymentDets((prevValue) => ({
        ...prevValue,
        loading: false,
        otpRequestPayload: {
          transactionID: paymentDets?.transactionId,
          paymentMethod: paymentData?.PaymentMethod?.version_2_0[paymentInfo[payType].payMethod],
          amount: Math.round(quoteData?.premiumDue),
          mobile: `%2B${paymentDets?.mobileNumber}`
        },
        callGenerateOtp: true
      }));
    }
  }, [intianlData, progressData, initalError, progressError]);

  const enabledPay = () => {
    return !paymentDets?.mobileNumber;
  }

  // change handler
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[^\D]\d*$/;
    if (e.currentTarget.value && !regex.test(e.currentTarget.value)) {
      e.preventDefault();
      return;
    }
    setPaymentDets((prevValue) => ({
      ...prevValue,
      mobileNumber: e.target.value
    }));
  };

  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace" && e.currentTarget.value.length >= 14) {
      e.preventDefault();
      return false;
    }
  }

  const isButtonEnaled = enabledPay();

  const paymentInfo = {
    'installment': {
      buttonTitle: paymentData?.field_button_title,
      buttonImgClass: 'ur-pay-btn',
      payMethod: 'urPay'
    },
    'stc_pay': {
      buttonTitle: languageData?.verify,
      buttonImgClass: '',
      payMethod: 'stcPay'
    }
  }

  const handleOTPGeneration = () => {
    setPaymentDets((prevValue) => ({
      ...prevValue,
      otpRequestPayload: null,
      loading: true,
      callGenerateOtp: false
    }));
    const { transactionId, cardData } = paymentDets;
    const webHooks = getWebHookCallParams(transactionId, cardData, quoteData, languageData)
    if (webHooks) {
      initialWebHookCall(webHooks?.initial);
      progressWebHookCall(webHooks.progress);
    }
  }

  const setCallGenerateOtp = (data: boolean) => {
    setPaymentDets((prevValue) => ({
      ...prevValue,
      callGenerateOtp: data
    }));
  }

  return (
    <div className="card-options">
      {paymentDets?.loading && <LoaderOverlay />}
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={() => setShowAlertModal(false)}
      />
      {paymentDets?.otpRequestPayload && <OTPWrapper
        generateOtpUrl={PAYMENT_INFO?.generateOTPUrl}
        validateOtpUrl={PAYMENT_INFO?.validateOTPUrl}
        languageData={{
          enter_otp_code: languageData?.enter_otp_code,
          your_otp_will_expire: languageData?.your_otp_will_expire,
          confirm_otp: languageData?.confirm_otp,
          resend_otp: languageData?.resend_otp,
        }}
        handleSuccessValidation={(data) => {
          if (data?.transactionId) {
            navigateTo && navigateTo(`/product/success/payment/${data?.transactionId}`);
          }
        }}
        payload={paymentDets?.otpRequestPayload}
        callGenerateOtp={paymentDets?.callGenerateOtp}
        setCallGenerateOtp={setCallGenerateOtp}
      />}
      <div className="card-no-input">
        <div className="card-content">
          <div>{paymentData?.mobile_number}</div>
          <ThemeTextbox
            name="mobilenum"
            type="text"
            maxLengthIs={14}
            onKeyDown={keyDownHandler}
            value={paymentDets?.mobileNumber}
            onChangehandler={changeHandler}
            onFocus={changeHandler}
          />
        </div>
        <ThemeButton
          title={getCurrencySymbol(paymentInfo[payType].buttonTitle + " " + languageData?.sar + getAmountText(quoteData?.premiumDue))}
          variant={isButtonEnaled ? "linked" : "policyDetails"}
          classes={`validate-vehicle-btn card-button ${paymentInfo[payType].buttonImgClass}`}
          onClickhandler={handleOTPGeneration}
          isDisabled={isButtonEnaled}
        />
      </div>
    </div>
  );
}
