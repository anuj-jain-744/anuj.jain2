import React, { useState, useEffect } from "react";
 
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { DataContext } from './DataContext';

import { callAPI } from "@dpm/shared-module";
import { MotorInsurance } from "./Motor/QuoteAndBuy";
import { TravelInsurance } from "./Travel/QuoteAndBuy";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

function App() {
  const [languageData, setLanguageData] = useState();
  const fetchData = async () => {
    const response = await callAPI("get", VITE_CONTENT_BASE_URI + "en/api/consumerportal-config");
    setLanguageData(response.config[0]);  
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={languageData}>
      <MotorInsurance />
      <TravelInsurance/>
    </DataContext.Provider>

  );
}

export default App;