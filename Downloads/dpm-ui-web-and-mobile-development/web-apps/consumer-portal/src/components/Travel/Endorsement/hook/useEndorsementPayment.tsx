import { useState, useCallback } from "react";
import { callAPI } from "@dpm/shared-module";

export const useEndorsementPayment = ({
  PolicyNo,
}: {
  PolicyNo: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any | null>(null);

  const makePaymentApiCall = useCallback(async ({benefitId}) => {
    setIsLoading(true);
    setError(null);
    setPaymentData(null);

    const { VITE_ENDORSEMENT_PAYMENT_BASE_URL } = import.meta.env;

    //TODO: need to update these hard coded values
    const requestBody = {
      createdBy: "10327",
      apiSource: "Portal",
      financialEndoInd: "N",
      sign: -1,
      endoType: "11",
      endoSubType: "114",
      interestUpdateReason: "2",
      mainBenefitCal: "N",
      smeProduct: false,
      policyNo: PolicyNo,
      loginUser: {
        userId: "10327",
        isBrokerUser: "N",
      },
      endoRequestReferenceNo: "EECRN-24-012",
      endoEffectiveDate: "2024-11-27",
      vehicles: [
        {
          sequenceNo: "",
          customId: "",
          benefits: benefitId,
          vehicleInfoCorrection: {
            customID: null,
            sequenceNo: null,
            plateNo: "1235",
            plateNoText1: "A - Ç",
            plateNoText2: "B - È",
            plateNoText3: "B - Ï",
            vehicleMake: null,
            vehicleMakeText: null,
            vehicleModel: null,
            vehicleModelText: null,
            anufactureYear: 0,
          },
        },
      ],
      docFiles: [],
    };

    try {
      const response = await callAPI(
        "post",
        VITE_ENDORSEMENT_PAYMENT_BASE_URL,
        requestBody
      );
      if (response.code === 1 && response.message === "SUCCESS") {
        setPaymentData(response);
      } else setError(response.errorCode);
    } catch (err) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [PolicyNo]);

  return { makePaymentApiCall, isLoading, error, paymentData };
};
