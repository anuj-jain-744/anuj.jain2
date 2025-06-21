import { useState, useEffect } from "react";
import { useDownloadPolicy } from "../../Motor/Policy-services/AccessPolicyDocuments/hooks/useDownloadPolicy";
import {
  PDFDataStructure,
  PolicyPayload,
} from "types/policyDocuments";

export const createPdf = (
  
  policyUrl: string,
 policy:string

) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const policyPayload: PolicyPayload = { policyNo: policy }; // Assuming PolicyPayload has a property named 'policyNo'
  const policyDownload = useDownloadPolicy(policyUrl, policyPayload);
 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
         
          policyDownload.doApiCall(),
          
        ]);
      } catch (error) {
        setError("Error fetching PDF data");
        console.error("Error fetching PDF data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [policyUrl]);

  const processApiData = (
    apiData: any[] | null,
    category: keyof PDFDataStructure
  ) => {
    return (
      apiData?.map((doc, index) => ({
        id: `${category}-${index}`,
        name: doc.name || `${category}.pdf`,
        document: doc.data,
      })) || []
    );
  };

  const pdfData = {
   
    policyData: policyDownload?.data
      ? processApiData(policyDownload.data, "policyData")
      : [],
     
  };

  return { pdfData, isLoading, error };
};
