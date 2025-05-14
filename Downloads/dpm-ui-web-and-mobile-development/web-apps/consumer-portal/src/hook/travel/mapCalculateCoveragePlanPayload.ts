import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { familtyFlowConstants } from "components/Travel/constantsTravel";
import {OwnerResponseTravel}  from 'types/quoteAndBuy';
import { checkDateFormat } from "utils/formatDate";
export const mapCoveragePlanPremiumPayload = (
    selectedPeriod: Travel.TravelPeriodOption,
    travelStartDate:string,
    travellerType:string,
    ownerdetails:OwnerResponseTravel,
    adultCount?:number,  
    childCount?:number, 
    srCitizenCount?:number
  
) => {
    const dateForm = checkDateFormat(travelStartDate);
    const date = new Date(dateForm as string);
    const formattedDate = formatDate(date);
 
  return {
    policyEffectiveDate: formattedDate,
    travelDuration: selectedPeriod.value,
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
