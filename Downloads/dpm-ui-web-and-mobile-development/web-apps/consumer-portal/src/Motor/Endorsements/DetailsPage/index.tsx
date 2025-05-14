import React, { useState, useEffect } from "react";
import { DataContext } from '../../../DataContext';
import { callAPI } from "@dpm/shared-module";
import { PaySuccess } from "./PaySuccess";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

function DetailsPage(props) {
  const [languageData, setLanguageData] = useState();
  const fetchData = async () => {
    const response = await callAPI("get", VITE_CONTENT_BASE_URI + "en/api/consumerportal-config");
    setLanguageData(response.config[0]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="register-new-claim">
      <DataContext.Provider value={languageData}>
      <PaySuccess {...props}/>
    </DataContext.Provider>
    </div>
  );
}

export default DetailsPage;
