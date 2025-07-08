import { useState, useEffect } from "react";
import { callAPI } from "@dpm/shared-module";

const { VITE_CONTENT_BASE_URI, VITE_CONTENT_LOCAL_BASE_URI } = import.meta.env;

const useTemplate = () => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const result = await callAPI(
          "get",
          `${VITE_CONTENT_LOCAL_BASE_URI}/get-templates-routes`
        );
        if (!result) {
          console.warn("No data received");
          setData(null);
          setError(null);
        } else {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
        setData(null);
        setError(err);
      }
    };

    fetchTemplate();
  }, []);

  return { data, error };
};

export default useTemplate;
