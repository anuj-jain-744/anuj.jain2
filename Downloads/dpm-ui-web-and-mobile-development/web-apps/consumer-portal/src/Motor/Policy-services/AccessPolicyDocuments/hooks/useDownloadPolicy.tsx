import { useState, useCallback, useRef, useEffect } from "react";
import { convertBase64toPdf, isBase64 } from "utils/policyDocuments";
import { callAPI } from "@dpm/shared-module";
import { PdfDocument, PolicyPayload } from "types/policyDocuments";


export const useDownloadPolicy = (url: string, payload: PolicyPayload) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PdfDocument[] | null>(null);
  
  const urlRef = useRef(url);
  const payloadRef = useRef(payload);

  useEffect(() => {
    urlRef.current = url;
    payloadRef.current = payload;
  }, [url, payload]);

  const doApiCall = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setData(null);
    
    try {
      const response = await callAPI("post", urlRef.current, payloadRef.current) as any;
      
      const base64StringArray = response.data;
      if (!Array.isArray(base64StringArray)) {
        throw new Error("Response data is not an array");
      }

      const urlPath = new URL(urlRef.current).pathname;
      const documentType = urlPath.includes('Endorsement') ? 'Endorsement' : 'Policy';

      const pdfPromises = base64StringArray.map(async (item: any, index: number) => {
        if (item && item.model && isBase64(item.model)) {
          const pdfBytes = item.model && await convertBase64toPdf(item.model);
          if (pdfBytes) {
            const name = item.fileName || `${documentType}_Document_${index + 1}.pdf`;
            return { name, data: pdfBytes };
          }
        }
        return null;
      });

      const pdfDocuments = await Promise.all(pdfPromises);
      const validPdfDocuments = pdfDocuments.filter((pdf): pdf is PdfDocument => pdf !== null);

      if (validPdfDocuments.length > 0) {
        setData(validPdfDocuments);
      } else {
        console.warn("No valid PDF documents found");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return { doApiCall, isLoading, error, data };
};