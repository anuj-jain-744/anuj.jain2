import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useEffect, useState } from "react";
import { mapCalculatePremiumPayload } from "./mapCalculatePremiumPayload";
import useCountryLookup from "./useCountryLookup";
import { CalculatePremiumPayload } from "types/CalculatePremiumApiPayload";

const useCalculatePremiumPayload = () => {
    const { 
      vehicleDetailsResponseData, 
      ownerDetailsResponseData,
      driverDetailsResponseData,
      vehicleDetails,
      schemeCode,
      countryData,
    } = useQuoteAndBuyContext();
    const [requestPayload, setRequestPayload] = useState<CalculatePremiumPayload | null>(null);

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