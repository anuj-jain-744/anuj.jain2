import { encryptData, getRandomString } from "@dpm/shared-module";
import { DirectPaymentPayload } from "../components/PaymentOptions/types/paymentField";
import {
  PaymentProvider,
  PaymentProviderMethods,
} from "../components/PaymentOptions/types/providerPayment";
import { typesCard } from "../components/PaymentOptions/CardOptions";

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

export const processTransactionId = (transactionId: string) => {
  const [quotationNo, productCode, data , timestamp, errorMessage] =  transactionId.split('_');
  return {
    quotationNo,
    errorMessage,
    productCode
  }
}