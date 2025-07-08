import { useState, useCallback } from 'react';
import { callAPI, VITE_BACKEND_BASE_URL } from "@dpm/shared-module";

export const useUploadFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  const makeApiCall = useCallback(async (fileData: any) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const requestBodyClaim = {
        taskId: fileData?.taskId,
        fileList: fileData?.fileList.map((file: any) => ({
          documentId: file.documentId,
          fileName: file.fileName,
          file: file.file
        }))
      };

      const responseStatus = await callAPI('post', `${VITE_BACKEND_BASE_URL}/Motor/Claim/Document/V1/Upload/Missing/Doc`, requestBodyClaim);

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