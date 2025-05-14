import { useState, useEffect } from "react";
import { callAPI } from "@dpm/shared-module";
import { VITE_CONTENT_BASE_URI } from "../../../../src/constant";
import { LanguageData } from "types/languageData";
import { fetchData, navigateTo } from "../../../../../app-shell/src/utils";
import { cmsAPIRoute } from "../../../../../app-shell/src/constants";

interface ResponseProps  {
  config: LanguageData[]
}

const useLanguageData = () => {
//   const [languageData, setLanguageData] = useState<LanguageData>();
  const [state, setState] = useState({
    languageData: []

  });
  const [isLoading, setIsLoading] = useState(true);
  const fetchAllData = async () => {
    const [languageData] = await Promise.all([
       fetchData(cmsAPIRoute.travelConfig, "en"),
    ]);
    setState({languageData})
    setIsLoading(false);
  };

  useEffect(() => { 
    fetchAllData();
  }, []);

  const { languageData } = state;

  return { languageData,isLoading };
};

export default useLanguageData;