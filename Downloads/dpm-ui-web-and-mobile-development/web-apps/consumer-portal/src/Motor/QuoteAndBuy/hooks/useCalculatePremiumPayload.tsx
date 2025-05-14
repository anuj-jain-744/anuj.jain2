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
    } = useQuoteAndBuyContext();
    const [requestPayload, setRequestPayload] = useState<CalculatePremiumPayload | null>(null);

    useEffect(() => {
      const uniqueDrivers = driverDetailsResponseData.filter(
        (driver: DriverDetailsResponseData, index: number, self: DriverDetailsResponseData[]) =>
          index === self.findIndex((d) => d.driverID === driver.driverID)
      );
      if(uniqueDrivers.length !== driverDetailsResponseData.length) {
        setDriverDetailsResponseData(uniqueDrivers);
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
          )
        );
      }
    }, [vehicleDetailsResponseData, countryData, driverDetailsResponseData, ownerDetailsResponseData, vehicleDetails]); // DON'T use getCountryNameById as a dependency here, it will cause infinite loop

    return requestPayload;
  };



  export default useCalculatePremiumPayload;