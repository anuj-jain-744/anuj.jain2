export interface PaymentProvider {
  content: [
    {
      providerCode: string;
      providerDesc: string;
      paymentMethod: [
        {
          methodCode: string;
          methodDesc: string;
        }
      ];
    }
  ];
}

export interface PaymentProviderMethods {
  providerCode: string;
  providerDesc: string;
  methodCode: string;
  methodDesc: string;
}
