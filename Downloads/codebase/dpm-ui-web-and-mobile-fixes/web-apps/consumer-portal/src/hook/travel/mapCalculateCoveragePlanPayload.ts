import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { familtyFlowConstants } from "components/Travel/constantsTravel";
import { DATE_FORMATS } from "constant";
import { DateObject } from "react-multi-date-picker";
import {OwnerResponseTravel}  from 'types/quoteAndBuy';
import { checkDateFormat, formatDateObjectTo } from "utils/formatDate";
export const mapCoveragePlanPremiumPayload = (
    travelDateRange:DateObject[],
    travellerType:string,
    ownerdetails:OwnerResponseTravel,
    adultCount?:number,  
    childCount?:number, 
    srCitizenCount?:number
  
) => {
    const [travelFromDate,travelToDate] = travelDateRange;   
    const effectiveDate = checkDateFormat(formatDateObjectTo(travelFromDate, DATE_FORMATS["YYYY-MM-DD"]));
    const date = new Date(effectiveDate);
    const formattedEffectiveDate = formatDate(date);    
 
  return {
    policyEffectiveDate: formattedEffectiveDate,
    travelFromDate:checkDateFormat(formatDateObjectTo(travelFromDate, DATE_FORMATS["YYYY-MM-DD"])),
    travelToDate:checkDateFormat(formatDateObjectTo(travelToDate, DATE_FORMATS["YYYY-MM-DD"])),
    familyIndividual: travellerType,
    typeOfCoverage:1,
    ...(travellerType === "1" && {
        noOfTraveler: {
            adult: adultCount,
            children: childCount,
            srCitizen: srCitizenCount
        }
    }),
    policyCustomer: {
        nationalId: ownerdetails.ownerId ?? "",
        gender: ownerdetails.gender,
        customerNameEnglish:ownerdetails.ownerFullNameEnglish,
        customerNameArabic: ownerdetails.ownerFullNameArabic,
        nationality: ownerdetails.nationality,
        dateOfBirth: ownerdetails.ownerDobG?.length > 10 
            ? ownerdetails.ownerDobG.substring(0, 10)
            : ownerdetails.ownerDobG?.split("-").reverse().join("-") ||
                familtyFlowConstants.dobG,
       
    }
}
      
};
