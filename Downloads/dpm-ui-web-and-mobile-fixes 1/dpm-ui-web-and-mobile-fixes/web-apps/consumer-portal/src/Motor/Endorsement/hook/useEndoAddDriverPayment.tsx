import { useState, useCallback } from "react";
import { callAPI } from "@dpm/shared-module";

export const useEndoAddDriverPayment = ({
  PolicyNo,
  SequenceNo, 
  ReferenceNo
}: {
  PolicyNo: string;
  SequenceNo: string; 
  ReferenceNo: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any | null>(null);

  const makeAddDriverPaymentApiCall = useCallback(async ({driverId}) => {
    setIsLoading(true);
    setError(null);
    setPaymentData(null);

    const { VITE_ENDORSEMENT_PAYMENT_BASE_URL } = import.meta.env;

    //TODO: need to update these hard coded values

    const requestBody = 
    {
      "createdBy": "10327",
      "apiSource": "Portal",
      "financialEndoInd": "Y",
      "sign": 1,
      "endoType": "11",
      "endoSubType": "111",
      "purchaseInfo": {
        "isPurchased": 1,
        "purchaseStatus": 1,
        "paymentMethod": 106,
        "creditCardType": 1,
        "posTerminalId": "",
        "paymentBillNumber": "KA12345",
        "paymentAmount": 3000,
        "ibanNo": "",
        "paymentChannel": "DirectPay"

      }, // payment details object will be inserted here 
      "interestUpdateReason": "",
      "mainBenefitCal": "N",
      "smeProduct": false,
      "policyNo": PolicyNo,
      "loginUser": {
          "userId": "10327",
          "isBrokerUser": "N"
      },
      "endoRequestReferenceNo": ReferenceNo, // "EECRN-24-014",
      "endoEffectiveDate": "2024-09-10",
      "vehicles": [
          {
              "sequenceNo": SequenceNo,
              "drivers": [
                driverId
              ]
          }
      ],
      "docFiles": []
    };

    try {
      const response = await callAPI(
        "post",
        VITE_ENDORSEMENT_PAYMENT_BASE_URL,
        requestBody
      );
      if (response?.code === 1 && response?.message === "SUCCESS") {
        setPaymentData(response);
      } else {
        setError(response?.errorCode);
      }
    } catch (err) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [PolicyNo]);

  return { makeAddDriverPaymentApiCall, isLoading, error, paymentData };
};
