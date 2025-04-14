import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import "./index.scss";
import { PaymentOptionProp } from "pages/payment-insurance";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import Info from "assets/Payment/info.svg";
import CardInfo from "assets/Payment/cardinfo.svg";
import { ThemeButton } from "components/index";
import { useApiCall, VITE_BACKEND_UTILITY_URL } from "@dpm/shared-module";
import { ViewQuoteResponse } from "types/viewQuote";
import { CmsPayment } from "./types/cmsPayment";
import { generateSecureHash, getMethodType, paymentSubmit } from "utils/paymentUtils";
import { DirectPaymentPayload } from "./types/paymentField";
import { PaymentProviderMethods } from "./types/providerPayment";
import { LanguageData } from "types/languageData";
import { AlertBox } from "components/AlertBox";

const paymentDirect = 100;

interface ApiError {
  title: string | undefined;
  description: string | undefined;
}

interface CardOptionProps {
  readonly productCode: string;
  readonly paymentData: CmsPayment;
  readonly optionData: PaymentOptionProp;
  readonly quoteData: ViewQuoteResponse;
  readonly paymentMethods: PaymentProviderMethods[];
  readonly languageData: LanguageData;
}

export const typesCard = {
  VISA: 0,
  MasterCard: 1,
  Amex: 2,
  Mada: 3,
};
const maxCardLength = 16;
const visaCardLangth = 13;
const webPlatform = 1;

const WEBHOOK_TYPES = {
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PAYMENT_INPROGRESS: "PAYMENT_IN_PROGRESS",
};

export default function CardOptions({
  productCode,
  paymentData,
  optionData,
  quoteData,
  paymentMethods,
  languageData,
}: CardOptionProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cardNumberError, setCardNumberError] = useState<boolean>(true);
  const [cardHolderName, setCardHolderName] = useState<string>("");
  const [cvvError, setCvvError] = useState<boolean>(true);
  const [expiryDateError, setExpiryDateError] = useState<boolean>(true);
  const [cardHolderNameError, setCardHolderNameError] = useState<boolean>(true);
  const [cardType, setCardType] = useState<number | undefined>();
  const [directPayToken, setDirectPayToken] = useState("");
  const [maxCvvLength, setMaxCvvLength] = useState<number>(3);
  const [transactionId, setTransactionId] = useState<string>("");
  const [cardData, setCardData] = useState<PaymentProviderMethods | undefined>();
  const [apiErrorMessage, setApiErrorMessage] = useState<ApiError>({
    title: "",
    description: ""
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const { makeApiCall: initialWebHookCall, errors: initalError, data: intianlData } = useApiCall<unknown, unknown>(5, "Payment/Webhook", "post"); 
  const { makeApiCall: progressWebHookCall, errors: progressError, data: progressData } = useApiCall<unknown, unknown>(5, "Payment/Webhook", "post"); 
  
  const openToolTip = () => {
    setShowModal((val) => !val);
  };

  const handleCVCChange = (e: string) => {
    let value = e;
    value = value.replace(/\D/g, "");
    setCvv(value);
  };

  const handleDateInputChange = (e: string) => {
    let value = e;
    value = value.replace(/\D/g, "");
    if (value.length > 2 && value.length <= 4) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    } else {
      value = value.slice(0, 2);
    }
    setExpiryDate(value);
  };

  const validateCard = (cardNumber: string) => {
    const value = cardNumber.replace(/\D+/g, "");
    setCardNumber(value);
    if (cardNumber.startsWith("4")) {
      setCardType(typesCard.VISA); // VISA
      setMaxCvvLength(3);
      return;
    }
    if (/^5[1-5]/.test(cardNumber)) {
      setCardType(typesCard.MasterCard); // MasterCard
      setMaxCvvLength(3);
      return;
    }
    if (/^3[4,7]/.test(cardNumber)) {
      setCardType(typesCard.Amex); // Amex
      setMaxCvvLength(4);
      return;
    }
    if (/^(50|56|57|58|6)/.test(cardNumber)) {
      setCardType(typesCard.Mada); // Replace SomeType with the appropriate card type
      setMaxCvvLength(3);
    }
  };

  const validateCardHolderName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^a-zA-Z ]+/g, "");
    setCardHolderName(value.trimStart().toUpperCase());
  };

  const handleWebHookCall = async () => {
    if(cardData) {
      const webHookInitial  = {
        nationalID: quoteData?.model?.policyCustomer[0]?.nationalId,
        platform: webPlatform,
        invoiceNumber: transactionId,
        paymentGatewayProviderID: cardData?.providerCode,
        paymentGatewayProviderName: cardData?.providerDesc,
        paymentMethodID: cardData?.methodCode,
        paymentMethodName: cardData?.methodDesc,
        paymentGatewayRef: transactionId,
        paymentAmount: quoteData?.model?.policyBasic?.premiumInfo?.premiumDue + "",
        currency: languageData?.sar,
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

  const handleSubmit = (event: React.FormEvent) => {
    if (event.preventDefault) event.preventDefault();
    handleWebHookCall();
  };

  const paymentHandleCall = () => {
    const responseUrl = (VITE_BACKEND_UTILITY_URL ?? "") + "Payment/Redirect";
    const authenticationToken = atob(directPayToken);
    const paymentParameters: DirectPaymentPayload = {
      Amount: Math.round(quoteData?.model?.policyBasic?.premiumInfo?.premiumDue) * paymentDirect + "",
      CardHolderName: cardHolderName,
      CardNumber: cardNumber,
      CurrencyISOCode: paymentData?.CurrencyISOCode?.sar,
      ExpiryDateMonth: expiryDate.split("/")[0],
      ExpiryDateYear: expiryDate.split("/")[1],
      Language: "en",
      Loading: true,
      MessageID: paymentData?.MessageID?.redirect_payment,
      MerchantID: paymentData?.MerchantID,
      PaymentMethod: paymentData?.PaymentMethod?.version_2_0?.card,
      Quantity: "1",
      ResponseBackURL: responseUrl, // Optional if merchant's URL is configured
      SecurityCode: cvv,
      ThemeID: paymentData?.ThemeID, 
      TransactionID: cardType ? transactionId: "", // getRandomNumber(13), // 13 digit only           // Set the transaction ID
      Version: paymentData?.Version[0],//"2.0",
      SecureHash: "",
    };
    paymentParameters.SecureHash = generateSecureHash(paymentParameters, authenticationToken);
    paymentSubmit(paymentParameters);
  }

  useEffect(() => {
    if (paymentData) {
      setDirectPayToken(paymentData.directPayAuthenticationToken);
    }
  }, [paymentData]);

  useEffect(() => {
    if(cardType && paymentMethods && quoteData) {
      const cardName = getMethodType(cardType ?? 0);
      const cardData = paymentMethods.find((method) => method.methodDesc?.toLowerCase() === cardName?.toLowerCase() && method.providerDesc?.toLowerCase() === "directpay");
      const transactionIds = `${quoteData?.model?.policyBasic?.quoteNumber}_${productCode}_${cardData?.methodCode}_${new Date().valueOf()}`;
      setTransactionId(transactionIds);
      setCardData(cardData);
    }
  }, [cardType, paymentMethods, quoteData]);

  useEffect(() => {
    if (apiErrorMessage?.title === "" && (initalError || progressError)) {
      setApiErrorMessage({
        title: initalError?.name ?? progressError?.name,
        description: initalError?.messages?.message_en ?? progressError?.messages?.message_en,
      });
      setShowAlertModal(true);
    }
  }, [initalError, progressError, apiErrorMessage]);

  useEffect(() => {
    if (intianlData && progressData) {
      paymentHandleCall();
    }
  }, [intianlData, progressData]);

  return (
    <div className="card-options">
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={() => setShowAlertModal(false)}
      />
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        size="sm"
        className="cvv-container"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{paymentData?.field_cvv}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-cvv">
            <img src={CardInfo} alt="" />
            <p>{paymentData?.field_cvv_info}</p>
          </div>
        </Modal.Body>
      </Modal>
      <div className="card-no">
        <div className="card-no-label">
          {paymentData.field_debit_credit_card_no}
        </div>
        <div className="card-no-input">
          <ThemeTextbox
            name="card-no"
            placeholder={paymentData.field_debit_credit_card_no}
            value={cardNumber}
            onChangehandler={(e) => validateCard(e.target.value)}
            handleOnBlur={() => {
              let cardError = cardNumber.length === maxCardLength;
              if(typesCard.VISA === cardType) {
                cardError = cardNumber.length === visaCardLangth || cardNumber.length === maxCardLength;
              } 
              setCardNumberError(!cardError);
            }}
          />
          {cardType !== undefined && (
            <img src={optionData.img[cardType]} alt="" />
          )}
        </div>
      </div>
      <div className="d-flex cvc-date-container">
        <div className="card-no">
          <div className="card-no-label">{paymentData.field_valid_till}</div>
          <div className="card-no-input card-no-input-short">
            <ThemeTextbox
              name="card-no"
              placeholder={"MM/YY"}
              value={expiryDate}
              maxLength={5}
              onChangehandler={(e) => handleDateInputChange(e.target.value)}
              handleOnBlur={() => {
                setExpiryDateError(expiryDate.length < 5);
              }}
            />
          </div>
        </div>
        <div className="card-no">
          <div className="card-no-label">
            {paymentData.field_cvc}
          </div>
          <div className="card-no-input card-no-input-short">
            <ThemeTextbox
              name="card-no"
              type="password"
              placeholder={"***"}
              value={cvv}
              maxLength={maxCvvLength}
              onChangehandler={(e) => handleCVCChange(e.target.value)}
              handleOnBlur={() => {
                setCvvError(cvv.length < maxCvvLength);
              }}
            />
            <button onClick={openToolTip}>
              <img src={Info} alt="" />
            </button>
          </div>
        </div>
      </div>
      <div className="card-no">
        <div className="card-no-label">
          {paymentData.field_card_holder_name}
        </div>
        <div className="card-no-input">
          <ThemeTextbox
            name="card-holder"
            placeholder={paymentData.field_card_holder_name}
            value={cardHolderName}
            onChangehandler={validateCardHolderName}
            handleOnBlur={() => {
              setCardHolderNameError(cardHolderName.length === 0);
            }}
          />
        </div>
      </div>
      <div className="card-no-input">
        <ThemeButton
          title={paymentData.field_button_title + " " + quoteData?.model?.policyBasic?.premiumInfo?.premiumDue}
          variant={
            cardNumberError || cvvError || expiryDateError || cardHolderNameError
              ? "linked"
              : "policyDetails"
          }
          classes="validate-vehicle-btn"
          isDisabled={cardNumberError || cvvError || expiryDateError || cardHolderNameError}
          onClickhandler={handleSubmit}
        />
      </div>
    </div>
  );
}
