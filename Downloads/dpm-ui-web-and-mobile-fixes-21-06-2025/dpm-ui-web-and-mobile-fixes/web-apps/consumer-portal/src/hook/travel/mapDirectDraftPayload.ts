import { checkDateFormat, formatDateObjectTo } from "utils/formatDate";
import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { DATE_FORMATS, TRAVEL_TARIFF_TYPE } from "constant";
import { OwnerResponseTravel } from "types/quoteAndBuy";
import { travelersInfo } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { DateObject } from "react-multi-date-picker";

export const mapDirectDraftPayload = (
  travelDateRange:DateObject[],
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
  const [travelFromDate, travelToDate] = travelDateRange;
  const effectiveDate = checkDateFormat(formatDateObjectTo(travelFromDate, DATE_FORMATS["YYYY-MM-DD"]));
  const date = new Date(effectiveDate); 


  return {
    policyEffectiveDate: formatDate(date),
    travelFromDate: checkDateFormat(formatDateObjectTo(travelFromDate, DATE_FORMATS["YYYY-MM-DD"])),
    travelToDate: checkDateFormat(formatDateObjectTo(travelToDate, DATE_FORMATS["YYYY-MM-DD"])),
    familyIndividual: travellerType,
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
