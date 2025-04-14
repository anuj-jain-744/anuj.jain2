import { useState, useCallback } from "react";
import { callAPI } from "@dpm/shared-module";
import { VITE_BACKEND_BASE_URL } from "constant";

export const useValidateIban = ({
  NationalId,
  IbanNo,
}: {
  NationalId: string;
  IbanNo: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationData, setValidationData] = useState<any | null>(null);

  const fetchValidateIban = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setValidationData(null);

    const requestBody = {
      iban: IbanNo,
      idValue: NationalId,
    };

    try {
      const responseData = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + `/Motor/Claim/V1/ValidateIban`,
        requestBody
      );
      if (
        responseData?.code === 1 &&
        responseData?.message?.toUpperCase() === "SUCCESS"
      ) {
        setValidationData(responseData);
      } else setError(responseData?.errorCode);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [IbanNo]);

  return {
    fetchValidateIban,
    isLoading,
    error,
    validationData,
  };
};
