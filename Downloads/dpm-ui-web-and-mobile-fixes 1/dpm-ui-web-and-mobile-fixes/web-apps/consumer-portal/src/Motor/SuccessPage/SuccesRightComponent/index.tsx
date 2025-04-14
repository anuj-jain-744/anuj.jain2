import React, { useEffect, useState } from "react";
import "./style.scss";
import "styles/_fonts.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { callAPI, getFullUrl, useApiCall } from "@dpm/shared-module";
import mockData from "./../success.json";
import DomesticLabourCard from "../DomesticLabour";
import { LanguageData } from "types/languageData";
import Enhancement from "./Enhancement";

interface TravelAPIResponse {
  config: LanguageData;
}

function SuccesRightComponent({ flag = false }: Readonly<{ flag?: boolean }>) {
  const { VITE_CONTENT_BASE_URI } = import.meta.env;

  const [footerData, setFooterData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    try {
      const fullUrl = getFullUrl(VITE_CONTENT_BASE_URI, "en", endpoint);
      const responseData = await callAPI("get", fullUrl);
      const result =
        endpoint === "header-menu"
          ? responseData?.menus
          : endpoint === "corporate-homepage"
          ? responseData?.data
          : responseData ?? {};
      setter(result);
    } catch (ex) {
      console.error(ex);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([fetchData("footer-menu", setFooterData)]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const [travelData, setTravelData] = useState<LanguageData>();

  const { data, makeApiCall } = useApiCall<TravelAPIResponse, undefined>(
    1,
    "travel-config",
    "get"
  );
  useEffect(() => {
    makeApiCall();
  }, []);

  useEffect(() => {
    if (data) {
      setTravelData(data?.config);
    }
  }, [data]);

  return (
    <div className="right-card-containers">
      {flag && <DomesticLabourCard data={travelData} />}
      <Enhancement flag={flag} footerData={footerData} mockData={mockData} />
    </div>
  );
}

export default SuccesRightComponent;
