import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useState, useEffect } from 'react';
import { CoveragePanPremiumApiPayload } from 'hook/travel/CalculatePremiumApiPayload';
import { mapCoveragePlanPremiumPayload } from "./mapCalculateCoveragePlanPayload";

const useUpdateCoveragePlanPayload = () => {
  const {
    selectedPeriod,
    travelStartDate,
    travellerType,
    ownerDetailsResponseData,
    adultCount,
    childCount,
    srCitizenCount,

  } = useQuoteAndBuyContext();

  const [requestPayload, setRequestPayload] = useState<CoveragePanPremiumApiPayload | null>(null);
  useEffect(() => {

    if (travellerType && ownerDetailsResponseData) {

      setRequestPayload(
        mapCoveragePlanPremiumPayload(
          selectedPeriod,
          travelStartDate,
          travellerType,
          ownerDetailsResponseData,
          adultCount,
          childCount,
          srCitizenCount
        ) as unknown as CoveragePanPremiumApiPayload
      );
    }
  }, [selectedPeriod, travelStartDate, travellerType, ownerDetailsResponseData, adultCount, childCount, srCitizenCount]);

  return requestPayload;
};

export default useUpdateCoveragePlanPayload;
