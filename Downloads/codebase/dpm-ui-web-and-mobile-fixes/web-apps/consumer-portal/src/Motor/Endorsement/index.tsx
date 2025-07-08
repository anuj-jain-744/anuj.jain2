import React, { useEffect, useState } from "react";
import Endorsement from "./endorsement";
import { callAPI } from "@dpm/shared-module";
import { DataContext } from "../../DataContext";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

function IEndorsement(props: React.JSX.IntrinsicAttributes) {
  const [languageData, setLanguageData] = useState();
  const fetchData = async () => {
    const response = await callAPI(
      "get",
      VITE_CONTENT_BASE_URI + "en/api/consumerportal-config"
    );
    setLanguageData(response.config[0]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={languageData}>
      <Endorsement showDialog={showDialog} setShowDialog={setShowDialog} />
    </DataContext.Provider>
  );
}

export default IEndorsement;
