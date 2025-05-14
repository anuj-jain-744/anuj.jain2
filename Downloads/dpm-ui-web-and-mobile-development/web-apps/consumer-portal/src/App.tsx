import React, { useState, useEffect } from "react";
 
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { DataContext } from './DataContext';
import Claims from "./claims";
 
import { callAPI } from "@dpm/shared-module";
import { DriverDetailsModal, MotorInsurance } from "./Motor/QuoteAndBuy";
import { TravelInsurance } from "./Travel/QuoteAndBuy";
import VehicleDetailsModal from "./Motor/QuoteAndBuy/VehicleDetailsModal/VehicleDetailsModal";
import RemoveVehicleModal from "Motor/QuoteAndBuy/RemoveVehicleModal/RemoveVehicleModal";

const { VITE_CONTENT_BASE_URI } = import.meta.env;

/**
 * Renders the main application component.
 * @returns The JSX element representing the application.
 */
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
      {/* <VehicleDetailsModal show={true} onHide={function (): void {
        throw new Error("Function not implemented.");
      } } /> */}
      <MotorInsurance />
      <TravelInsurance/>
      {/* <DriverDetailsModal show={true} onHide={function (): void {
        throw new Error("Function not implemented.");
      } } /> */}
      {/* <RemoveVehicleModal show={true} onHide={function (): void {
        throw new Error("Function not implemented.");
      } } /> */}
    </DataContext.Provider>

  );
}

export default App;