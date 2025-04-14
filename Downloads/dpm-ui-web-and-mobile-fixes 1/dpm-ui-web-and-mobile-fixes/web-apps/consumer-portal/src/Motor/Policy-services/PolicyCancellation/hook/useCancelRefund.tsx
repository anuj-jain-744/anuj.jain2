import { useState, useCallback } from "react";
import { callAPI } from "@dpm/shared-module";
import { VITE_POLICY_CANCELLATION_BASE_URL } from "./../../../../constant";

export const useCancelRefund = ({ PolicyNo }: { PolicyNo: string }) => {
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

    try {
      const responseData = await callAPI(
        "post",
        VITE_POLICY_CANCELLATION_BASE_URL + "CancelRequestCheck",
        requestBody
      );
      if (responseData.code === 1 && responseData.message === "SUCCESS") {
        setPolicyData(responseData);
      } else setError(responseData.errorCode);
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
