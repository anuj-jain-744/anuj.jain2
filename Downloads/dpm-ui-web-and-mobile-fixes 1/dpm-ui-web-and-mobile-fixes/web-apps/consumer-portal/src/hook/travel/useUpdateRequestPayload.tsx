import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useState, useEffect } from 'react';
import { calculatePremiumPayload } from 'hook/travel/calculatePremiumPayload';
import { CalculatePremiumApiPayload } from 'hook/travel/CalculatePremiumApiPayload';
import { mapCalculatePremiumPayload } from "./mapCalculatePremiumPayload";

const useUpdateRequestPayload = () => {
  const { 
    selectedPeriod,
    travelStartDate,
    travellerType,
    ownerDetailsResponseData
  } = useQuoteAndBuyContext();

  
const [requestPayload, setRequestPayload] =  useState<CalculatePremiumApiPayload | null>(null);
  useEffect(() => {
    if (selectedPeriod && travelStartDate && travellerType && ownerDetailsResponseData) { 
      setRequestPayload(
        mapCalculatePremiumPayload(
          selectedPeriod,
          travelStartDate,
          travellerType,
          ownerDetailsResponseData
        ) as unknown as CalculatePremiumApiPayload
      );
    }
  }, [selectedPeriod, travelStartDate,travellerType,ownerDetailsResponseData]); 

  return requestPayload;
};

export default useUpdateRequestPayload;
