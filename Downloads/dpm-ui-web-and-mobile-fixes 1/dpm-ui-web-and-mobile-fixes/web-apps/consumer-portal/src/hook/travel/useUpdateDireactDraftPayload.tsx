import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useState, useEffect } from 'react';
import { calculatePremiumPayload } from 'hook/travel/calculatePremiumPayload';
import { CalculatePremiumApiPayload } from 'hook/travel/CalculatePremiumApiPayload';
import { mapDirectDraftPayload } from './mapDirectDraftPayload';
import { TRAVEL_COVERAAGE_DATA, TRAVELER_COVERGE_TYPES } from "../../constant";
const useUpdateDirectDraftRequestPayload = () => {
  const {
    selectedPeriod,
    travelStartDate,
    travellerType,
    ownerDetailsResponseData,
    travelcoverageTypeCode,
    travelcoverage,
    worldwideFamilyCPPrice,
    worldwideSelfCPPrice,
    worldwideexceptSelfCPPrice,
    europeSelfCPPrice,
    travelersList,

  } = useQuoteAndBuyContext();


  const getSelfRiskid = () => {
    switch (travelcoverage) {

      case "worldwide":

        if (travelcoverageTypeCode === "3") {
          return {

            travellers: worldwideFamilyCPPrice.dataworldwideFamilypurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwide,
            plan: TRAVEL_COVERAAGE_DATA.family
          };
        }
        else if (travelcoverageTypeCode === "1") {
          return {

            travellers: worldwideSelfCPPrice.dataworldwidetravellerpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwide,
            plan: TRAVEL_COVERAAGE_DATA.traveller
          };
        } else if (travelcoverageTypeCode === "2") {
          return {

            travellers: worldwideSelfCPPrice.dataworldwidepearlpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwide,
            plan: TRAVEL_COVERAAGE_DATA.pearl
          };
        }
        break;
      case "worldwideexceptusa&canada":
        if (travelcoverageTypeCode === "1") {
          return {

            travellers: worldwideexceptSelfCPPrice.dataworldwideexcepttravellerpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwideusa,
            plan: TRAVEL_COVERAAGE_DATA.traveller
          };
        } else if (travelcoverageTypeCode === "2") {
          return {
            travellers: worldwideexceptSelfCPPrice.dataworldwideexceptpearlpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwideusa,
            plan: TRAVEL_COVERAAGE_DATA.pearl
          };
        }
        break;
      case "europe":
        if (travelcoverageTypeCode === "4") {
          return {


            travellers: europeSelfCPPrice.dataEuropeschengenpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.europe,
            plan: TRAVEL_COVERAAGE_DATA.schengen

          };


        } else if (travelcoverageTypeCode === "5") {
          return {
            travellers: europeSelfCPPrice.dataEuropeeuropepurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.europe,
            plan: TRAVEL_COVERAAGE_DATA.europe
          };
        }
        break;
      default:
        break;
    }
  };


  const riskIDandIQamaID = getSelfRiskid();
  const [requestPayload, setRequestPayload] = useState<CalculatePremiumApiPayload | null>(null);
  useEffect(() => {
    if (selectedPeriod && travelStartDate && travellerType && ownerDetailsResponseData) {
      setRequestPayload(
        mapDirectDraftPayload(
          selectedPeriod,
          travelStartDate,
          travellerType,
          ownerDetailsResponseData,
          riskIDandIQamaID,
          travelersList
        ) as unknown as CalculatePremiumApiPayload
      );
    }

  }, [selectedPeriod, travelStartDate, travellerType, ownerDetailsResponseData, travelersList]);

  return requestPayload;
};

export default useUpdateDirectDraftRequestPayload;
