import { useEffect, useState } from 'react';
import { decryptAES } from "../decryptAES";

interface UrlState {
  extractParams: Record<string, string> | null;
  paramError: boolean | null;
  urlError: boolean | null;
}
export const useEncryptedUrlParams = (search: string, secretKey: string): UrlState => {
  const [urlState, setUrlState] = useState<UrlState>({
    extractParams: {},
    paramError: null,
    urlError: null
  });
  useEffect(() => {
    if (search === "") {
      return;
    }

    try {
      const cleanedSearch = search.replace(/^\?/, '');
      const decryptedUrl = decryptAES(cleanedSearch, secretKey);
      const queryParams = new URLSearchParams(decryptedUrl);
      const extractParams: { [key: string]: string } = {};
      queryParams.forEach((value, key) => {
        extractParams[key] = value;
      });

      if (Object.keys(extractParams).length === 0) {
        setUrlState({
          extractParams: null, urlError: null, paramError: true
        });
      }
      else {
        setUrlState({ extractParams, urlError: null, paramError: null });
      }

    } catch (error) {
      console.error('error', error);
      setUrlState({ extractParams: null, urlError: true, paramError: null });
    }
  }, [search]);

  return urlState;
};