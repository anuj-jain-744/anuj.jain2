import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

import "./index.scss";
import { PaymentOptionProp } from "pages/payment-insurance";
import ThemeTextbox from "components/ThemeTextbox/ThemeTextbox";
import Info from "assets/Payment/Info.svg";
import CardInfo from "assets/Payment/cardInfo.svg";
import { ThemeButton } from "components/index";
import { useApiCall, VITE_BACKEND_UTILITY_URL, getAmountText } from "@dpm/shared-module";
import { CmsPayment } from "./types/cmsPayment";
import { checkIsValidMonthAndYear, generateSecureHash, getMethodType, getWebHookCallParams, paymentSubmit } from "utils/paymentUtils";
import { DirectPaymentPayload } from "./types/paymentField";
import { PaymentProviderMethods, ResponsePaymentOption } from "./types/providerPayment";
import { LanguageData } from "types/languageData";
import { AlertBox } from "components/AlertBox";
import { DIRECT_PAY, PAYMENT_INFO } from "constant";
import { getCurrencySymbol } from "@app-shell/utils/common";

interface ApiError {
  title: string | undefined;
  description: string | undefined;
}

interface CardOptionProps {
  readonly productCode: string;
  readonly paymentData: CmsPayment;
  readonly optionData: PaymentOptionProp;
  readonly quoteData: ResponsePaymentOption;
  readonly paymentMethods: PaymentProviderMethods[];
  readonly languageData: LanguageData;
}

// eslint-disable-next-line react-refresh/only-export-components
export const typesCard = {
  VISA: 0,
  MasterCard: 1,
  Amex: 2,
  Mada: 3,
};

const maxCardLength = 16;
const visaCardLangth = 13;

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
  const [cardNumberErrorMsg, setCardNumberErrorMsg] = useState<boolean>(false);
  const [cardHolderName, setCardHolderName] = useState<string>("");
  const [cvvError, setCvvError] = useState<boolean>(true);
  const [cvvErrorMsg, setCvvErrorMsg] = useState<boolean>(false);
  const [expiryDateError, setExpiryDateError] = useState<boolean>(true);
  const [expiryDateErrorMsg, setExpiryDateErrorMsg] = useState<boolean>(false);
  const [cardHolderNameError, setCardHolderNameError] = useState<boolean>(true);
  const [cardHolderNameErrorMsg, setCardHolderNameErrorMsg] = useState<boolean>(false);
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
    if(cardNumber===""){
      setCardType(undefined); // removed SomeType with the empty card value
      setMaxCvvLength(3);
    }
  };

  const validateCardHolderName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^a-zA-Z ]+/g, "");
    setCardHolderName(value.trimStart().toUpperCase());
  };

  const handleSubmit = (event: React.FormEvent) => {
    if (event.preventDefault) event.preventDefault();
    const webHooks = getWebHookCallParams(transactionId, cardData, quoteData, languageData)
    if (webHooks) {
      initialWebHookCall(webHooks?.initial);
      progressWebHookCall(webHooks.progress);
    }
  };

  const paymentHandleCall = () => {
    const responseUrl = (VITE_BACKEND_UTILITY_URL ?? "") + "Payment/Redirect";
    const authenticationToken = atob(directPayToken);
    const paymentParameters: DirectPaymentPayload = {
      Amount: Math.round(quoteData?.premiumDue) * PAYMENT_INFO.paymentDirect + "",
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
      const cardData = paymentMethods.find((method) => method.methodDesc?.toLowerCase() === cardName?.toLowerCase() && method.providerDesc?.toLowerCase() === DIRECT_PAY);
      const transactionIds = `${quoteData?.quoteEndorsementNumber}_${productCode}_${cardData?.methodCode}_${new Date().valueOf()}`;
      setTransactionId(transactionIds);
      setCardData(cardData);
    }
  }, [cardType, paymentMethods, productCode, quoteData]);

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
            parentClasses="d-flex flex-column"
            placeholder={paymentData.field_debit_credit_card_no}
            value={cardNumber}
            onChangehandler={(e) => validateCard(e.target.value)}
            handleOnBlur={() => {
              let cardError = cardNumber.length === maxCardLength;
              if(typesCard.VISA === cardType) {
                cardError = cardNumber.length === visaCardLangth || cardNumber.length === maxCardLength;
              } 
              setCardNumberError(!cardError);
              setCardNumberErrorMsg(!cardError);
            }}
            errorMessage={cardNumberErrorMsg ? paymentData.invalid_card_number : ""}
          />
          {cardType !== undefined && (
            <img src={optionData.img[cardType]} alt={optionData.img[cardType]} />
          )}
        </div>
      </div>
      <div className="d-flex cvc-date-container">
        <div className="card-no">
          <div className="card-no-label">{paymentData.field_valid_till}</div>
          <div className="card-no-input card-no-input-short">
            <ThemeTextbox
              name="card-no"
              parentClasses="d-flex flex-column"
              placeholder={"MM/YY"}
              value={expiryDate}
              maxLength={5}
              onChangehandler={(e) => handleDateInputChange(e.target.value)}
              handleOnBlur={() => {
                // check if the value is older than the current date and year & value length is not matching format mm/yy
                setExpiryDateError(expiryDate.length < 5 || !checkIsValidMonthAndYear(parseInt(expiryDate.slice(0, 2)), parseInt(expiryDate.slice(3))));
                setExpiryDateErrorMsg(expiryDate.length < 5 || !checkIsValidMonthAndYear(parseInt(expiryDate.slice(0, 2)), parseInt(expiryDate.slice(3))));
              }}
              errorMessage={expiryDateErrorMsg ? paymentData.invalid_expiry_date : ""}
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
              parentClasses="d-flex flex-column"
              type="password"
              placeholder={"***"}
              value={cvv}
              maxLength={maxCvvLength}
              onChangehandler={(e) => handleCVCChange(e.target.value)}
              handleOnBlur={() => {
                setCvvError(cvv.length < maxCvvLength);
                setCvvErrorMsg(cvv.length < maxCvvLength);
              }}
              errorMessage={cvvErrorMsg ? paymentData.invalid_cvc : ""}
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
            parentClasses="d-flex flex-column"
            placeholder={paymentData.field_card_holder_name}
            value={cardHolderName}
            onChangehandler={validateCardHolderName}
            handleOnBlur={() => {
              setCardHolderNameError(cardHolderName.length === 0);
              setCardHolderNameErrorMsg(cardHolderName.length === 0);
            }}
            errorMessage={cardHolderNameErrorMsg ? paymentData.invalid_card_holder_name : ""}
          />
        </div>
      </div>
      <div className="card-no-input">
        <ThemeButton
          title={getCurrencySymbol(paymentData.field_button_title + " " + languageData?.sar + getAmountText(quoteData?.premiumDue))}
          variant={
            cardNumberError || cvvError || expiryDateError || cardHolderNameError
              ? "linked"
              : "policyDetails"
          }
          classes="validate-vehicle-btn card-button"
          isDisabled={cardNumberError || cvvError || expiryDateError || cardHolderNameError}
          onClickhandler={handleSubmit}
        />
      </div>
    </div>
  );
}
