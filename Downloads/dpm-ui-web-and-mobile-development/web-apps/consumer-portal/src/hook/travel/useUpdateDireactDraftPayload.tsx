import { useState, useEffect } from "react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { mapDirectDraftPayload } from "./mapDirectDraftPayload";
import {
  coverageTypeIdMap,
  pepValues,
  TRAVEL_COVERAAGE_DATA,
  TRAVEL_TARIFF_TYPE,
  TRAVELER_COVERGE_TYPES,
} from "../../constant";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { CalculatePremiumApiPayload } from "hook/travel/CalculatePremiumApiPayload";
import { formatTravelDate } from "utils/formatDate";
import { cleanSpaces } from "utils/quoteAndBuy";

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
    primaryTravelers,
    travelers,
    travelersChild,
    travelersSrcitizen,
    schemeCode,
    email,
  } = useQuoteAndBuyContext();

  const { declaration } = usePHQuoteBuyContext();

  const getSelfRiskid = () => {
    switch (travelcoverage) {
      case coverageTypeIdMap.worldwide:
        if (travelcoverageTypeCode === "3") {
          return {
            travellers:
              worldwideFamilyCPPrice.dataworldwideFamilypurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwide,
            plan: TRAVEL_COVERAAGE_DATA.family,
          };
        } else if (travelcoverageTypeCode === "1") {
          return {
            travellers:
              worldwideSelfCPPrice.dataworldwidetravellerpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwide,
            plan: TRAVEL_COVERAAGE_DATA.traveller,
          };
        } else if (travelcoverageTypeCode === "2") {
          return {
            travellers:
              worldwideSelfCPPrice.dataworldwidepearlpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwide,
            plan: TRAVEL_COVERAAGE_DATA.pearl,
          };
        }
        break;
      case coverageTypeIdMap.worldwide1:
        if (travelcoverageTypeCode === "1") {
          return {
            travellers:
              worldwideexceptSelfCPPrice.dataworldwideexcepttravellerpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwideusa,
            plan: TRAVEL_COVERAAGE_DATA.traveller,
          };
        } else if (travelcoverageTypeCode === "2") {
          return {
            travellers:
              worldwideexceptSelfCPPrice.dataworldwideexceptpearlpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.worldwideusa,
            plan: TRAVEL_COVERAAGE_DATA.pearl,
          };
        }
        break;
      case coverageTypeIdMap.europe:
        if (travelcoverageTypeCode === "4") {
          return {
            travellers: europeSelfCPPrice.dataEuropeschengenpurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.europe,
            plan: TRAVEL_COVERAAGE_DATA.schengen,
          };
        } else if (travelcoverageTypeCode === "5") {
          return {
            travellers: europeSelfCPPrice.dataEuropeeuropepurchasedCoverage,
            typeOfCoverage: TRAVELER_COVERGE_TYPES.europe,
            plan: TRAVEL_COVERAAGE_DATA.europe,
          };
        }
        break;
      default:
        break;
    }
  };

  const [requestPayload, setRequestPayload] =
    useState<CalculatePremiumApiPayload | null>(null);

  useEffect(() => {
    if (
      selectedPeriod.value &&
      travelStartDate &&
      travellerType &&
      ownerDetailsResponseData
    ) {
      const riskIDandIQamaID = getSelfRiskid();
      const combinedTravelers = [
        ...primaryTravelers,
        ...travelers,
        ...travelersChild,
        ...travelersSrcitizen,
      ];
      const travelersList = combinedTravelers.map(
        (item: travelersInfo, index: number) => {
          const result = { ...item };
          result.travellerNameEnglish = cleanSpaces(item.travellerNameEnglish);
          result.dateOfBirth = formatTravelDate(item.dateOfBirth);
          result.passportExpiryDate = formatTravelDate(item.passportExpiryDate);
          result.riskId = `R0000${index + 1}`;
          result.travellerNameArabic = " ";
          return result;
        }
      );
      let pep = pepValues.no;
      if (declaration.pep === true) pep = pepValues.pep;
      else if (declaration.related_party === true) pep = pepValues.relatedParty;

      const payload = mapDirectDraftPayload(
        selectedPeriod,
        travelStartDate,
        travellerType,
        ownerDetailsResponseData,
        pep,
        riskIDandIQamaID,
        travelersList,
        email
      ) as CalculatePremiumApiPayload;

      if (schemeCode?.schemeCode) {
        payload.schemeCode = schemeCode.schemeCode;
        payload.ratingType = TRAVEL_TARIFF_TYPE.broker;
      }

      setRequestPayload(payload);
    }
  }, [
    selectedPeriod,
    travelStartDate,
    travellerType,
    ownerDetailsResponseData,
    primaryTravelers,
    travelers,
    travelersChild,
    travelersSrcitizen,
    schemeCode,
    declaration,
    email,
  ]);

  return requestPayload;
};

export default useUpdateDirectDraftRequestPayload;
