import { useState, useEffect } from "react";
import { callAPI } from "@dpm/shared-module";
import { VITE_CONTENT_BASE_URI } from "../../../../constant";
import { TravelData } from "types/languageData";

interface ResponseProps  {
  config: TravelData;
}

const useTravelData = () => {
  const [travelData, setTravelData] = useState<TravelData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response: ResponseProps= await callAPI(
        "get",
        VITE_CONTENT_BASE_URI + "en/api/travel-config"
      );
      if (response?.config) {
        setTravelData(response.config);
      } else {
        console.error("Invalid response structure:", response);
        setTravelData(undefined);
      }
    } catch (error: any) {
        console.error("Error fetching language data:", error);
        setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { travelData, isLoading, error };
};

export default useTravelData;