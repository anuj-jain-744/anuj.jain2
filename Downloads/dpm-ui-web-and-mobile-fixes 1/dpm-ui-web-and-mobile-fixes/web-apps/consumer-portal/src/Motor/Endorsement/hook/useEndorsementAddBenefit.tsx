import { useState, useCallback } from "react";
import { callAPI } from "@dpm/shared-module";
import { VITE_ENDORSEMENT_ADD_BENEFIT_BASE_URL } from "../../../constant";
import mockData from "./../MasterData.json"

export const useEndorsementAddBenefitApi = ({ PolicyNo }: { PolicyNo: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [benefitData, setBenefitData] = useState<any | null>(null);

  const makeAddBenefitApiCall = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setBenefitData(null);

    const requestBody = {
      policyNo: PolicyNo,
    };

    try {
      const response = await callAPI(
        "post",
        VITE_ENDORSEMENT_ADD_BENEFIT_BASE_URL,
        requestBody
      );
      if (response.code === 1 && response.message === "SUCCESS") {
        setBenefitData(response);
      } else setError(response.errorCode);
    } catch (err) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [PolicyNo]);

  return { makeAddBenefitApiCall, isLoading, error, benefitData };
};
