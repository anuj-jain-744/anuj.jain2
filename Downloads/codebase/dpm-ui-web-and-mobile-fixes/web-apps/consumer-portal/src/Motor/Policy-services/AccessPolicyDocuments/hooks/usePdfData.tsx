import { useState, useEffect } from "react";
import { useDownloadPolicy } from "./useDownloadPolicy";
import {
  PDFDataStructure,
  PolicyPayload,
} from "types/policyDocuments";

export const usePDFData = (
  endorsementUrl: string,
  policyUrl: string,
  payloads: {
    endorsement: PolicyPayload;
    policy: PolicyPayload;
    quotation: PolicyPayload;
  },
  quotationUrl: string,
  claimsUrl?: string
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endorsementDownload = useDownloadPolicy(
    endorsementUrl,
    payloads.endorsement
  );
  const policyDownload = useDownloadPolicy(policyUrl, payloads.policy);
  const quotationDownload = useDownloadPolicy(quotationUrl, payloads.quotation);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          endorsementDownload.doApiCall(),
          policyDownload.doApiCall(),
          quotationDownload.doApiCall(),
        ]);
      } catch (error) {
        setError("Error fetching PDF data");
        console.error("Error fetching PDF data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [policyUrl, endorsementUrl,quotationUrl]);

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
    endorsementData: endorsementDownload?.data
      ? processApiData(endorsementDownload.data, "endorsementData")
      : [],
    policyData: policyDownload?.data
      ? processApiData(policyDownload.data, "policyData")
      : [],
      quotationData: quotationDownload?.data
      ? processApiData(quotationDownload.data, "quotationData")
      : [],
  };

  return { pdfData, isLoading, error };
};
