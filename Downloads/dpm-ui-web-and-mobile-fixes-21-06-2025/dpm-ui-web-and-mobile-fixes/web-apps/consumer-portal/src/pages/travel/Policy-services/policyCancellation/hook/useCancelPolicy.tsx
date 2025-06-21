import { useState, useCallback } from "react";
import { callAPI } from "@dpm/shared-module";
import { VITE_TRAVEL_POLICY_CANCELLATION_BASE_URL, VITE_POLICY_CANCELLATION_BASE_URL, HOME } from "./../../../../../constant";

interface RequestBodyProps {
  policyNo?: string;
  endoRequestReferenceNo?: string;
  financialEndoInd?: string;
  cancelRequest?: {
    ibanNo?: string
    payerId?: string
    payerName?: string
    cancelReason?: string
  },
  docFiles?: any[];
  sign?: number;
}

export const useCancelPolicy = ({ PolicyNo, documents, iban, data, policy_data,bic }: { PolicyNo: string, documents: Array<any>, iban: string, data: any, policy_data: any, bic:string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyCancelData, setPolicyCancelData] = useState<any | null>(null);

  const fetchCancelPolicy = useCallback(async (cancelReason:string, financialEndoInd: string = "Y") => {
    setIsLoading(true);
    setError(null);
    setPolicyCancelData(null);
    const productCode = data?.policyBasic?.productCode;

    let requestBody:RequestBodyProps = productCode === HOME? 
    {
      policyNo: PolicyNo,
      endoRequestReferenceNo: policy_data?.data?.endoRequestReferenceNo,
      financialEndoInd: financialEndoInd,
      sign: -1,
      cancelRequest: {
        ibanNo: iban,
        payerId: data?.policyCustomer[0]?.nationalId,
        payerName: data?.policyCustomer[0]?.customerNameArabic,
        cancelReason: cancelReason,
      },
      docFiles: documents
    }:{
      policyNo: PolicyNo,
      sign: -1,
      endoRequestReferenceNo: policy_data?.data?.endoRequestReferenceNo,
      cancelRequest: {
        ibanNo: iban,
        payerId: data?.policyCustomer[0]?.nationalId,
        payerName: data?.policyCustomer[0]?.customerNameArabic,
        cancelReason: "1",
        bic: bic,
      },
      docFiles: documents
    }
    const baseUrl = productCode === HOME ? VITE_POLICY_CANCELLATION_BASE_URL + "ConfirmCancellation" : VITE_TRAVEL_POLICY_CANCELLATION_BASE_URL + "CancelPolicy" ;
    if (productCode === HOME && financialEndoInd === "N") {
      requestBody = {
        policyNo: PolicyNo,
        endoRequestReferenceNo: policy_data?.data?.endoRequestReferenceNo,
        financialEndoInd: financialEndoInd
      };
    }
    try {
      const responseData = await callAPI(
        "post",
        baseUrl,
        requestBody
      );
      if (responseData.code === 1 && responseData.message === "SUCCESS") {
        setPolicyCancelData(responseData);
      } else {
        let errorBody = productCode === HOME ? responseData?.errors[0] : responseData?.errors;
        setError(errorBody?.messages?.message_en);
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
