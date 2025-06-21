import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useState, useEffect } from 'react';
import { CoveragePanPremiumApiPayload } from 'hook/travel/CalculatePremiumApiPayload';
import { mapCoveragePlanPremiumPayload } from "./mapCalculateCoveragePlanPayload";

const useUpdateCoveragePlanPayload = () => {
  const {
    travelDateRange,
    travellerType,
    ownerDetailsResponseData,
    adultCount,
    childCount,
    srCitizenCount,

  } = useQuoteAndBuyContext();

  const [requestPayload, setRequestPayload] = useState<CoveragePanPremiumApiPayload | null>(null);
  useEffect(() => {

    if (travellerType && ownerDetailsResponseData && travelDateRange.length === 2) {

      setRequestPayload(
        mapCoveragePlanPremiumPayload(
          travelDateRange,
          travellerType,
          ownerDetailsResponseData,
          adultCount,
          childCount,
          srCitizenCount
        ) as unknown as CoveragePanPremiumApiPayload
      );
    }
  }, [travelDateRange, travellerType, ownerDetailsResponseData, adultCount, childCount, srCitizenCount]);

  return requestPayload;
};

export default useUpdateCoveragePlanPayload;
