import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useEffect, useState } from "react";
import { mapCalculatePremiumPayload } from "./mapCalculatePremiumPayload";
import { CalculatePremiumPayload } from "types/CalculatePremiumApiPayload";
import { DriverDetailsResponseData } from "types/quoteAndBuy";

const useCalculatePremiumPayload = () => {
    const {
      vehicleDetailsResponseData,
      ownerDetailsResponseData,
      driverDetailsResponseData,
      setDriverDetailsResponseData,
      vehicleDetails,
      schemeCode,
      countryData,
      policyStartDate,
    } = useQuoteAndBuyContext();
    const [requestPayload, setRequestPayload] = useState<CalculatePremiumPayload | null>(null);

    useEffect(() => {
      if (Array.isArray(driverDetailsResponseData)) {
        const uniqueDrivers = driverDetailsResponseData.filter(
          (driver: DriverDetailsResponseData, index: number, self: DriverDetailsResponseData[]) =>
            index === self.findIndex((d) => d.driverID === driver.driverID)
        );
        if (uniqueDrivers.length !== driverDetailsResponseData.length) {
          setDriverDetailsResponseData(uniqueDrivers);
        }
      }
    }, [driverDetailsResponseData]);

    useEffect(() => {
      if (countryData && vehicleDetailsResponseData && driverDetailsResponseData && ownerDetailsResponseData) {
        setRequestPayload(
          mapCalculatePremiumPayload(
            vehicleDetailsResponseData,
            driverDetailsResponseData,
            ownerDetailsResponseData,
            vehicleDetails || {},
            countryData,
            schemeCode,
            policyStartDate
          )
        );
      }
     }, [policyStartDate, vehicleDetailsResponseData, countryData, driverDetailsResponseData, ownerDetailsResponseData, vehicleDetails, schemeCode]);

    return requestPayload;
  };



  export default useCalculatePremiumPayload;