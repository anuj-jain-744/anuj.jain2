import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { OwnerResponseTravel } from 'types/quoteAndBuy';
import { getFullAge } from "utils/getFullAge";
import { checkDateFormat, formatDateObjectTo } from "utils/formatDate";
import { DateObject } from "react-multi-date-picker";
import { DATE_FORMATS, TRAVEL_TARIFF_TYPE } from "constant";
export const mapCalculatePremiumPayload = (
    travelDateRange: DateObject[],
    travellerType: string,
    ownerdetails: OwnerResponseTravel

) => {
    const [travelFromDate, travelToDate] = travelDateRange;
    const effectiveDate = checkDateFormat(formatDateObjectTo(travelFromDate, DATE_FORMATS["YYYY-MM-DD"]));
    const date = new Date(effectiveDate);
    const formattedEffectiveDate = formatDate(date);
    const age = getFullAge(ownerdetails.ownerDobG, "-");
    

    return {
        policyEffectiveDate: formattedEffectiveDate,
        travelFromDate: checkDateFormat(formatDateObjectTo(travelFromDate, DATE_FORMATS["YYYY-MM-DD"])),
        travelToDate: checkDateFormat(formatDateObjectTo(travelToDate, DATE_FORMATS["YYYY-MM-DD"])),
        familyIndividual: travellerType,
        plan: "1",
        ratingType: TRAVEL_TARIFF_TYPE.broker,
        schemeCode: "P1",
        policyRisk: [],
        policyCustomer: {
            nationalId: ownerdetails.ownerId ?? "",
            age: age,
            gender: ownerdetails.gender,
            customerNameEnglish: ownerdetails.ownerFullNameEnglish,
            customerNameArabic: ownerdetails.ownerFullNameArabic,
            nationality: ownerdetails.nationality,
            dateOfBirth: ownerdetails.ownerDobG?.split('-').reverse().join('-'),
            mobile: ownerdetails.mobileNumber
        }
    }

};
