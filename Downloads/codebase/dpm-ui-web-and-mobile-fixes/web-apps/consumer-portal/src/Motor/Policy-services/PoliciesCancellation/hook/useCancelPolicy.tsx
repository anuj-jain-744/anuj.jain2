import { useState, useCallback } from "react";
import { callAPI } from "@dpm/shared-module";
import { VITE_POLICY_CANCELLATION_BASE_URL } from "../../../../constant";
import mockData from "./mockData.json";

export const useCancelPolicy = ({ PolicyNo, documents, iban, data, policy_data }: { PolicyNo: string, documents: Array<any>, iban: string, data: any, policy_data: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyCancelData, setPolicyCancelData] = useState<any | null>(null);

  const fetchCancelPolicy = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPolicyCancelData(null);

    const refundValue = policy_data?.data?.cancelRefund

    const requestBody = 
    {
      policyNo: PolicyNo,
      productCode: data?.policyBasic?.productCode,
      endoEffectiveDate: policy_data?.data?.effectiveDate,
      endoRequestReferenceNo: policy_data?.data?.endoRequestReferenceNo,
      cancelRequest: {
        ibanNo: iban,
        payerId: data?.policyCustomer[0]?.nationalId,
        payerName: data?.policyCustomer[0]?.customerNameArabic,
        cancelReason: mockData.cancelRequest.cancelReason,
      },
      docFiles: documents,
      ...(refundValue === 0
        ? { financialEndoInd: "N" } // as per Dikesh & Priharika putting this conditional hardcoded values API payload.
        : { financialEndoInd: "Y", sign: -1 }), // as per Dikesh & Priharika putting this conditional hardcoded values API payload.
  }
    
    try {
      const responseData = await callAPI(
        "post",
        VITE_POLICY_CANCELLATION_BASE_URL + "ConfirmCancellation",
        requestBody
      );
      if (responseData.code === 1 && responseData.message === "SUCCESS") {
        setPolicyCancelData(responseData);
      } else {
        setError(responseData?.errors[0]?.messages?.message_en)
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [PolicyNo, documents, iban, data, policy_data]);

  return {
    fetchCancelPolicy,
    isLoading,
    error,
    policyCancelData,
  };
};
