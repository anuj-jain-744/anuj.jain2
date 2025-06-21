import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useState, useEffect } from 'react';
import { CalculatePremiumApiPayload } from 'hook/travel/CalculatePremiumApiPayload';
import { mapCalculatePremiumPayload } from "./mapCalculatePremiumPayload";

const useUpdateRequestPayload = () => {
  const { 
    travelDateRange,
    travellerType,
    ownerDetailsResponseData
  } = useQuoteAndBuyContext();

  
const [requestPayload, setRequestPayload] =  useState<CalculatePremiumApiPayload | null>(null);
  useEffect(() => {
    if (travelDateRange.length === 2 && travellerType && ownerDetailsResponseData) { 
      setRequestPayload(
        mapCalculatePremiumPayload(
          travelDateRange,
          travellerType,
          ownerDetailsResponseData
        ) as unknown as CalculatePremiumApiPayload
      );
    }
  }, [travelDateRange, travellerType, ownerDetailsResponseData]); 

  return requestPayload;
};

export default useUpdateRequestPayload;
