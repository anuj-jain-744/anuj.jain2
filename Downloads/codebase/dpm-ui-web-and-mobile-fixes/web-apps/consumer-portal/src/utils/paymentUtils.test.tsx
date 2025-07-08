import {
  getMethodType,
  getTransactionId,
  getPaymentProviderArr,
  generateSecureHash,
  paymentSubmit,
  getWebHookCallParams,
  paymentHandleCall,
  processTransactionId,
  checkIsValidMonthAndYear,
} from "./paymentUtils";
import { encryptData, getRandomString } from "@dpm/shared-module";

// Mocking the shared module
jest.mock("@dpm/shared-module", () => ({
  encryptData: jest.fn((data) => `encrypted_${data}`),
  getRandomString: jest.fn(() => "randomString12345"),
}));

// Mocking the problematic function from the tsx file
jest.mock("@app-shell/utils/common", () => ({
  getCurrencySymbol: jest.fn(() => "SAR"), // Mock implementation
}));

jest.mock("../components/PaymentOptions/CardOptions", () => ({
  typesCard: {
    VISA: 1,
    MasterCard: 2,
    Amex: 3,
  },
}));

jest.mock("constant", () => ({
  PAYMENT_INFO: {
    webPlatform: 1, // Mocked platform value
    WEBHOOK_TYPES: {
      PAYMENT_INITIATED: "PAYMENT_INITIATED",
      PAYMENT_INPROGRESS: "PAYMENT_IN_PROGRESS",
    },
  },
}));

describe("paymentUtils", () => {
  describe("getMethodType", () => {
    it("should return the correct card type", () => {
      expect(getMethodType(1)).toBe("VISA");
      expect(getMethodType(2)).toBe("MASTERCARD");
      expect(getMethodType(3)).toBe("AMEX");
      expect(getMethodType(99)).toBe("");
    });
  });

  describe("getTransactionId", () => {
    it("should return a random string of length 13", () => {
      const transactionId = getTransactionId();
      expect(transactionId).toBe("randomString12345");
      expect(getRandomString).toHaveBeenCalledWith(13, true);
    });
  });

  describe("getPaymentProviderArr", () => {
    it("should return an array of payment provider methods", () => {
      const mockPaymentProvider = {
        content: [
          {
            providerCode: "P1",
            providerDesc: "Provider 1",
            paymentMethod: [
              { methodCode: "M1", methodDesc: "Method 1" },
              { methodCode: "M2", methodDesc: "Method 2" },
            ],
          },
        ],
      };
      const result = getPaymentProviderArr(mockPaymentProvider);
      expect(result).toEqual([
        {
          providerCode: "P1",
          providerDesc: "Provider 1",
          methodCode: "M1",
          methodDesc: "Method 1",
        },
        {
          providerCode: "P1",
          providerDesc: "Provider 1",
          methodCode: "M2",
          methodDesc: "Method 2",
        },
      ]);
    });
  });

  describe("generateSecureHash", () => {
    it("should generate a secure hash", () => {
      const mockParams = {
        AuthenticationToken: "token123",
        Amount: "100",
        CurrencyISOCode: "SAR",
        Language: "EN",
        MerchantID: "MID123",
        MessageID: "MSG123",
        PaymentMethod: "CARD",
        Quantity: "1",
        ResponseBackURL: "https://example.com",
        ThemeID: "TID123",
        TransactionID: "TXN123",
        Version: "1.0",
      };
      const secretKey = "secretKey123";
      const result = generateSecureHash(mockParams, secretKey);
      expect(result).toBe(
        "encrypted_secretKey123token123100SARENMID123MSG123CARD1https://example.comTID123TXN1231.0"
      );
    });
  });
  describe("paymentSubmit", () => {
    it("should create and submit a form", () => {
      // Mocking DOM methods
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();
  
      // Mocking the form and its submit method
      const mockSubmit = jest.fn();
      const mockForm = {
        submit: mockSubmit,
        appendChild: jest.fn(),
      };
      jest.spyOn(document, "createElement").mockReturnValue(mockForm as any);
  
      const mockParams = { key1: "value1", key2: "value2" };
  
      // Call the function
      paymentSubmit(mockParams);
  
      // Assertions
      expect(document.createElement).toHaveBeenCalledWith("form");
      expect(mockForm.appendChild).toHaveBeenCalledTimes(2); // Hidden inputs added
      expect(mockSubmit).toHaveBeenCalled(); // Ensure submit is called
      expect(document.body.appendChild).toHaveBeenCalledWith(mockForm);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockForm);
    });
  });

  describe("getWebHookCallParams", () => {
    it("should return webhook parameters", () => {
      const mockTransactionId = "TXN123";
      const mockCardData = {
        providerCode: "P1",
        providerDesc: "Provider 1",
        methodCode: "M1",
        methodDesc: "Method 1",
      };
      const mockQuoteData = {
        nationalId: "1234567890",
        quoteEndorsementNumber: "QEN123",
        premiumDue: 100,
      };
      const mockLanguageData = { sar: "SAR" };
  
      const result = getWebHookCallParams(
        mockTransactionId,
        mockCardData,
        mockQuoteData,
        mockLanguageData
      );
  
      expect(result).toEqual({
        initial: {
          nationalID: "1234567890",
          platform: 1, // Mocked value
          invoiceNumber: "QEN123",
          paymentGatewayProviderID: "P1",
          paymentGatewayProviderName: "Provider 1",
          paymentMethodID: "M1",
          paymentMethodName: "Method 1",
          paymentGatewayRef: "TXN123",
          paymentAmount: "100",
          currency: "SAR",
          webhookType: "PAYMENT_INITIATED", // Mocked value
        },
        progress: {
          nationalID: "1234567890",
          platform: 1, // Mocked value
          invoiceNumber: "QEN123",
          paymentGatewayProviderID: "P1",
          paymentGatewayProviderName: "Provider 1",
          paymentMethodID: "M1",
          paymentMethodName: "Method 1",
          paymentGatewayRef: "TXN123",
          paymentAmount: "100",
          currency: "SAR",
          webhookType: "PAYMENT_IN_PROGRESS", // Mocked value
        },
      });
    });
  });
  
  describe("checkIsValidMonthAndYear", () => {
    it("should validate month and year", () => {
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      expect(checkIsValidMonthAndYear(currentMonth, currentYear)).toBe(true);
      expect(checkIsValidMonthAndYear(currentMonth - 1, currentYear)).toBe(false);
      expect(checkIsValidMonthAndYear(currentMonth, currentYear - 1)).toBe(false);
      expect(checkIsValidMonthAndYear(13, currentYear)).toBe(false);
    });
  });
});