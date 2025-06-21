import React, { FC, useEffect, useState } from "react";
import { LanguageData } from "types/languageData";
import PolicyContainer from "./PolicyContainer";
import { useApiCall } from "@dpm/shared-module";
import { useLocation } from "react-router-dom";

interface PolicyCardProps {
  navigateTo?: (url: string) => void;
}

const Endorsement: FC<PolicyCardProps> = ({ navigateTo }) => {
  const location = useLocation();
  const policyData = location.state?.data || {};
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);

  // language data api call
  const { makeApiCall, data } = useApiCall<
    {
      config: LanguageData;
    },
    unknown
  >(1, "home-config", "get");

  const fetchData = async () => {
    await makeApiCall();
  };

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    if (data && Object.keys(data?.config).length > 0) {
      setLanguageData(data?.config);
    }
  }, [data]);

  return (
    <PolicyContainer
      policyData={policyData}
      languageData={languageData}
      navigateTo={navigateTo}
    />
  );
};

export default Endorsement;