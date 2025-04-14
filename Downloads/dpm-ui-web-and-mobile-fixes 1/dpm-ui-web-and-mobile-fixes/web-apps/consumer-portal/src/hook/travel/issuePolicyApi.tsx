import { useApiCall } from "@dpm/shared-module";
import { ErrorResponse } from "types/ErrorResponse";
import { useEffect, useState } from "react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
interface ApiResponse {
  data: {
    model: any;
  };
}

export function issueApi() {
    const [isError, setIsError] = useState<ErrorResponse | null>(null);
    const [isLoading, setIsLoading] =  useState(false);
    const [issuePolicydata,setData] = useState<any>(null);
    const { quoteDataResponse } = useQuoteAndBuyContext();

    const {
        makeApiCall: IssueApiDetails,
        errors: errorIssueAPIDetails,        
        isLoading: isLoadngIssueAPIDetails,
        data: dataIssueAPIDetails,
      } = useApiCall<ApiResponse, any>(22, "/Travel/QuoteAndBuy/V1/IssuePolicy", "post");

      const getIssuePolicyDetails = async (
           ) => {
            
        await        IssueApiDetails
        ({
            "quoteNo": quoteDataResponse?.requestReferenceNo,
            "isPurchased": "1",
            "purchaseStatus": "1",
            "paymentChannel": "POS",
            "posTerminalId": "63557013",
            "purchaseDate": "2024-10-14T12:00:00",
            "creditCardType": 1,
            "paymentMethod": 107,
            "paymentBillNumber": "REC-A00002",
            "paymentAmount": quoteDataResponse?.premiumDue,
        });
      };

      useEffect(() => {
        setIsError(
            errorIssueAPIDetails
        );
      }, [errorIssueAPIDetails]);

      useEffect(() => {
        setIsLoading(
            isLoadngIssueAPIDetails
        );
      }, [
        isLoadngIssueAPIDetails
    
      ]);

      useEffect(()=>{
        dataIssueAPIDetails && setData(dataIssueAPIDetails?.data?.model)
      },[dataIssueAPIDetails])
    

      return { getIssuePolicyDetails, isError, isLoading,issuePolicydata };

    }
