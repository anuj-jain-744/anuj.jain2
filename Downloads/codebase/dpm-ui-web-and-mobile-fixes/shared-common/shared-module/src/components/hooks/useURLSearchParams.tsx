import { useEffect, useState } from 'react';

export const useURLSearchParams = (queryString: string) => {
  const [params, setParams] = useState<string | null>(null)
  useEffect(() => {
    try {
      const search = location.search; 
      const queryparams = new URLSearchParams(search);
      const queryStringValue = queryparams.get(queryString);
      setParams(queryStringValue);
    } catch (error) {
      setParams(null);
    }
  }, []);

  return params;
};