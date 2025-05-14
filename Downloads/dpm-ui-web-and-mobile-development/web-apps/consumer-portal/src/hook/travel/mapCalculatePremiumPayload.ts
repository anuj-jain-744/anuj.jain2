import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { OwnerResponseTravel } from 'types/quoteAndBuy';
import { getFullAge } from "utils/getFullAge";
import { checkDateFormat } from "utils/formatDate";
export const mapCalculatePremiumPayload = (
    selectedPeriod: Travel.TravelPeriodOption,
    travelStartDate: string,
    travellerType: string,
    ownerdetails: OwnerResponseTravel

) => {
    const dateForm = checkDateFormat(travelStartDate);
    const travellerTypeCode = travellerType === "1" ? "1" : "2";
    const date = new Date(dateForm as string);
    const formattedDate = formatDate(date);
    const age = getFullAge(ownerdetails.ownerDobG, "-");

    return {
        policyEffectiveDate: formattedDate,
        travelDuration: selectedPeriod.value,
        familyIndividual: travellerTypeCode,
        plan: "1",
        ratingType: "General Tariff",

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
