import { checkDateFormat } from "utils/formatDate";
import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { TRAVEL_TARIFF_TYPE } from "constant";
import { OwnerResponseTravel } from "types/quoteAndBuy";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";

export const mapDirectDraftPayload = (
  selectedPeriod: Travel.TravelPeriodOption,
  travelStartDate: string,
  travellerType: string,
  ownerdetails: OwnerResponseTravel,
  pep: number,
  riskIDandIQamaID: {
    typeOfCoverage: string;
    plan: number;
  },
  travelersList: Array<travelersInfo>,
  email?: string
) => {
  const dateForm = checkDateFormat(travelStartDate);
  const travellerTypeCode = travellerType === "1" ? "1" : "2";
  const date = new Date(dateForm as string);
  const formattedDate = formatDate(date);

  return {
    policyEffectiveDate: formattedDate,
    travelDuration: selectedPeriod.value,
    familyIndividual: travellerTypeCode,
    typeOfCoverage: riskIDandIQamaID?.typeOfCoverage,
    plan: riskIDandIQamaID?.plan,
    pep,
    ratingType: TRAVEL_TARIFF_TYPE.general,
    policyRisk: travelersList,
    policyCustomer: {
      nationalId: ownerdetails.ownerId,
      age: ownerdetails.age,
      gender: ownerdetails.gender,
      customerNameEnglish: ownerdetails.ownerFullNameEnglish,
      customerNameArabic: ownerdetails.ownerFullNameArabic,
      nationality: ownerdetails.nationality,
      dateOfBirth: ownerdetails.ownerDobG?.split("-").reverse().join("-"),
      email: email,
      mobile: ownerdetails.mobileNumber,
    },
  };
};
