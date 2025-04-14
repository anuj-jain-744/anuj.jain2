import { useState, useCallback } from "react";
import { callAPI } from "@dpm/shared-module";
import { VITE_POLICY_CANCELLATION_BASE_URL } from "./../../../../constant";
import mockData from "./mockData.json";

export const useCancelPolicy = ({ PolicyNo, documents, iban, data, policy_data }: { PolicyNo: string, documents: Array<any>, iban: string, data: any, policy_data: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyCancelData, setPolicyCancelData] = useState<any | null>(null);

  const fetchCancelPolicy = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPolicyCancelData(null);

    // TODO: It may required when we need to send current date while cancelling the policy inside endoEffectiveDate parameter
    // const today = new Date();
    // const endoEffectiveDate = today.toISOString().split('T')[0];

    const requestBody = 
    {
      policyNo: PolicyNo,
      endoRequestReferenceNo: policy_data?.data?.endoRequestReferenceNo,
      cancelRequest: {
        ibanNo: iban,
        payerId: data?.policyCustomer[0]?.nationalId,
        payerName: data?.policyCustomer[0]?.customerNameArabic,
        cancelReason: mockData.cancelRequest.cancelReason,
      },
      docFiles: documents
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
