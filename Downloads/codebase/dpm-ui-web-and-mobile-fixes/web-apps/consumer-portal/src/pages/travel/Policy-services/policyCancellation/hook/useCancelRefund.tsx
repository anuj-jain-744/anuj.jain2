import { useState, useCallback } from "react";
import { callAPI } from "@dpm/shared-module";
import { SUCCESS, VITE_TRAVEL_POLICY_CANCELLATION_BASE_URL, VITE_POLICY_CANCELLATION_BASE_URL, HOME, TRAVEL } from "./../../../../../constant";

export const useCancelRefund = ({ PolicyNo, ProductCode = TRAVEL}: { PolicyNo: string, ProductCode:string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyData, setPolicyData] = useState<any | null>(null);

  const fetchCancelRefundData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPolicyData(null);

    const requestBody = {
      policyNo: PolicyNo
    };
    const url = ProductCode === HOME ? VITE_POLICY_CANCELLATION_BASE_URL : VITE_TRAVEL_POLICY_CANCELLATION_BASE_URL;

    try {
      const responseData = await callAPI(
        "post",
        url + "CancelRequestCheck",
        requestBody
      );
      if (responseData && responseData.code === 1 && responseData.message.toUpperCase() === SUCCESS.toUpperCase()) {
        setPolicyData(responseData);
      } else {
        responseData?.data?.errorDescription ? setError(responseData?.data?.errorDescription) : 
        setError(responseData?.errors[0]?.messages?.message_en);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [PolicyNo]);

  return {
    fetchCancelRefundData,
    isLoading,
    error,
    policyData,
  };
};
