import { encryptData, getRandomString } from "@dpm/shared-module";
import { DirectPaymentPayload } from "../components/PaymentOptions/types/paymentField";
import {
  PaymentProvider,
  PaymentProviderMethods,
} from "../components/PaymentOptions/types/providerPayment";
import { typesCard } from "../components/PaymentOptions/CardOptions";
import { PAYMENT_INFO } from 'constant';

export const getMethodType = (cardType: number) => {
  switch (cardType) {
    case typesCard.VISA:
      return "VISA";
    case typesCard.MasterCard:
      return "MASTERCARD";
    case typesCard.Amex:
      return "AMEX";
    default:
      return "";
  }
};
export const getTransactionId = (
) => {
  return getRandomString(13, true);
};

export const getPaymentProviderArr = (paymentProvider: PaymentProvider) => {
  const data: PaymentProviderMethods[] = [];
  paymentProvider.content.forEach((provider) => {
    provider.paymentMethod.forEach((method) => {
      data.push({
        providerCode: provider.providerCode,
        providerDesc: provider.providerDesc,
        methodCode: method.methodCode,
        methodDesc: method.methodDesc,
      });
    });
  });
  return data;
};
export const generateSecureHash = (
  params: DirectPaymentPayload,
  secretKey: string
) => {
  const fields = [
    "AuthenticationToken",
    "Amount",
    "CurrencyISOCode",
    "Language",
    "MerchantID",
    "MessageID",
    "PaymentMethod",
    "Quantity",
    "ResponseBackURL",
    "ThemeID",
    "TransactionID",
    "Version",
  ];

  
  let orderedString = secretKey;

  fields.forEach((field) => {
    if (params[field as keyof DirectPaymentPayload]) {
      orderedString += params[field as keyof DirectPaymentPayload];
    }
  });
  return encryptData(orderedString);
};

export const paymentSubmit = (parameters: DirectPaymentPayload) => {
  try {
    const targetUrl =
      "https://paytest.directpay.sa/SmartRoutePaymentWeb/SRPayMsgHandler";
    // Create and submit the form directly instead of using axios
    const form = document.createElement("form");
    form.method = "POST";
    form.action = targetUrl;
    form.target = "_top";

    // Add all parameters as hidden fields
    Object.entries(parameters).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });
    // Append form to body, submit it, and remove it
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error("Error submitting payment request:", error);
  }
};

export const getWebHookCallParams = (transactionId, cardData, quoteData, languageData) => {
  if (cardData) {
    const webHookInitial = {
      nationalID: quoteData?.nationalId,
      platform: PAYMENT_INFO.webPlatform,
      invoiceNumber: quoteData?.quoteEndorsementNumber,
      paymentGatewayProviderID: cardData?.providerCode,
      paymentGatewayProviderName: cardData?.providerDesc,
      paymentMethodID: cardData?.methodCode,
      paymentMethodName: cardData?.methodDesc,
      paymentGatewayRef: transactionId,
      paymentAmount: quoteData?.premiumDue + "",
      currency: languageData?.sar,
      webhookType: PAYMENT_INFO.WEBHOOK_TYPES.PAYMENT_INITIATED,
    };
    const webHookProgress = {
      ...webHookInitial,
      webhookType: PAYMENT_INFO.WEBHOOK_TYPES.PAYMENT_INPROGRESS,
    };
    return { initial: webHookInitial, progress: webHookProgress };
  }
  return null;
}

export const paymentHandleCall = (quoteData, paymentData, transactionId, paymentMethod, merchantID) => {
  const paymentParameters = {
    Amount: Math.round(quoteData?.premiumDue) * PAYMENT_INFO.paymentDirect + "",
    CurrencyISOCode: paymentData?.CurrencyISOCode?.sar,
    Language: PAYMENT_INFO.language,
    Loading: true,
    MessageID: paymentData?.MessageID?.redirect_payment,
    MerchantID: merchantID, 
    PaymentMethod: paymentMethod,
    Quantity: PAYMENT_INFO.quantity,
    ResponseBackURL: PAYMENT_INFO.responseUrl,
    ThemeID: paymentData?.ThemeID,
    TransactionID: transactionId, 
    Version: paymentData?.Version[0],
    SecureHash: "",
  };
  return paymentParameters;
}

export const processTransactionId = (transactionId: string) => {
  const decryptedTransactionId = atob(transactionId);
  const [quoteEndrosementNo, productCode, methodCode , timestamp, errorMessage] =  decryptedTransactionId.split('_');
  const endrosmentNo = quoteEndrosementNo.startsWith("E") ? quoteEndrosementNo : null;
  const quotationNo = quoteEndrosementNo.startsWith("Q") ? quoteEndrosementNo : null;
  return {
    quotationNo,
    errorMessage,
    productCode,
    endrosmentNo,
    methodCode,
    timestamp,
  }
}

export const checkIsValidMonthAndYear = (month: number, year: number) => {
  const currentDate = new Date();
  const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2)); // Get last two digits of the current year
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed
  if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
    return false; // Invalid Month and Year
  }
  return true; // Valid date
}