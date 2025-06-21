import { useState, useCallback } from 'react';
import { callAPI } from "@dpm/shared-module";

export const useUploadFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  const makeApiCall = useCallback(async (fileData: any) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const { VITE_BACKEND_SAG_BASE_URL, VITE_CONTENT_SAG_USERNAME, VITE_CONTENT_SAG_PASSWORD } = import.meta.env;

    const username = VITE_CONTENT_SAG_USERNAME;
    const password = VITE_CONTENT_SAG_PASSWORD;

    if (!username || !password) {
      setError('API credentials are not set');
      setIsLoading(false);
      return;
    }

    // Encode the username and password for Basic Auth
    const encoded = btoa(`${username}:${password}`);

    const requestBody = {
      policyNo: "",
      quoteNo: "Q-24-331-0062744",
      transType: "NB",
      endoNo: "",
      apiSource: "Portal",
      docFiles: fileData?.map((item: { name: string; base64: any; }) => {
        const fileParts = item?.name?.split('.');
        return {
          fileName: fileParts?.slice(0, -1).join('.'),
          fileExtension: fileParts?.slice(-1)[0],
          docType: 521,
          docFile: item.base64
        };
      }),
      loginUser: {
        userId: "Aggregator",
        isBrokerUser: "N"
      }
    };

    try {
      const responseStatus = await callAPI('post', `${VITE_BACKEND_SAG_BASE_URL}/uploadDoc`, requestBody, {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json'
      });

      setData(responseStatus);
      return responseStatus;

    } catch (error) {
      console.error('Error:', error);
      setError(`API call failed: ${error}`);
      return null;

    } finally {
      setIsLoading(false);
    }
  }, []);

  return { makeApiCall, isLoading, error, data };
};