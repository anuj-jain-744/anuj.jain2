import { useState, useEffect } from "react";
import { callAPI } from "@dpm/shared-module";
import { VITE_CONTENT_BASE_URI } from "./../../../../constant";
import { LanguageData } from "types/languageData";

interface ResponseProps  {
  config: LanguageData[]
}

const useLanguageData = () => {
  const [languageData, setLanguageData] = useState<LanguageData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchData = async () => {
    try {
      const response: ResponseProps= await callAPI(
        "get",
        VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
      );
      if (response && response.config && response.config.length > 0) {
        setLanguageData(response.config[0]);
      } else {
        console.error("Invalid response structure:", response);
        setLanguageData(undefined);
      }
    } catch (error: unknown) {
        console.error("Error fetching language data:", error);
        setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { languageData, isLoading, error };
};

export default useLanguageData;