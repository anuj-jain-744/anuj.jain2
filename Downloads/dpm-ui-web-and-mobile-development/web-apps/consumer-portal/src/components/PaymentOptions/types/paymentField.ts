export interface DirectPaymentPayload {
    Amount: string;
    CardHolderName: string;
    CardNumber: string;
    CurrencyISOCode: string;
    ExpiryDateMonth: string;
    ExpiryDateYear: string;
    Language: string;
    Loading: boolean;
    MessageID: string;
    MerchantID: string;
    PaymentMethod: string;
    Quantity: string;
    ResponseBackURL: string;
    SecurityCode: string;
    ThemeID: string;
    TransactionID: string;
    Version: string;
    SecureHash?: string;
}