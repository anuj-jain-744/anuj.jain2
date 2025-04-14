import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { OwnerResponseTravel } from 'types/quoteAndBuy';
import { checkDateFormat } from "utils/formatDate";
export const mapDirectDraftPayload = (
    selectedPeriod: string,
    travelStartDate: string,
    travellerType: string,
    ownerdetails: OwnerResponseTravel,
    riskIDandIQamaID?: any,
    travelersList?: any

) => {
    const dateForm = checkDateFormat(travelStartDate);
    const travellerTypeCode = travellerType === "1" ? "1" : "2";
    const date = new Date(dateForm as string);
    const formattedDate = formatDate(date);


    if (travellerType === "1") {
        return {
            policyEffectiveDate: formattedDate,
            travelDuration: selectedPeriod ? selectedPeriod.split(" ")[0] : "",
            familyIndividual: travellerTypeCode,
            typeOfCoverage: riskIDandIQamaID?.typeOfCoverage,
            plan: riskIDandIQamaID?.plan,
            pep: "1",
            ratingType: "General Tariff",
            policyRisk: travelersList,
            policyCustomer: {
                nationalId: ownerdetails.ownerId ?? "",
                age: 35,
                gender: ownerdetails.gender,
                customerNameEnglish: ownerdetails.ownerFullNameEnglish,
                customerNameArabic: ownerdetails.ownerFullNameArabic,
                nationality: ownerdetails.nationality,
                dateOfBirth: ownerdetails.ownerDobG?.split('-').reverse().join('-'),
                email: "yunlei.chang@ebaotech.com",
                mobile: ownerdetails.mobileNumber
            }

        };
    } else {
        return {
            policyEffectiveDate: formattedDate,
            travelDuration: selectedPeriod ? selectedPeriod.split(" ")[0] : "",
            familyIndividual: travellerTypeCode,
            typeOfCoverage: riskIDandIQamaID?.typeOfCoverage,
            plan: riskIDandIQamaID?.plan,
            pep: "1",
            ratingType: "General Tariff",
            policyRisk: riskIDandIQamaID?.travellers && riskIDandIQamaID.travellers.length > 0 ? [
                {
                    dateOfBirth: ownerdetails.ownerDobG?.split('-').reverse().join('-'),
                    relation: "5",
                    travellerNameEnglish: ownerdetails.ownerFullNameEnglish,
                    travellerNameArabic: ownerdetails.ownerFullNameArabic,
                    personAge: "35",
                    gender: ownerdetails.gender,
                    nationality: ownerdetails.nationality,
                    passportNumber: "111111",
                    passportExpiryDate: "2025-12-01",
                    nationalIqamaId: riskIDandIQamaID?.travellers[0]?.nationalIqamaId ?? "",
                    riskId: riskIDandIQamaID?.travellers[0]?.riskId ?? "",
                    policyCoverage: travelersList && travelersList[0]?.policyCoverage?.length > 0 ? travelersList[0]?.policyCoverage.map((item: any) => {
                        return {
                            coverageCode: item.coverageCode
                        };
                    }) : []
                }
            ] : [],
            policyCustomer: {
                nationalId: ownerdetails.ownerId ?? "",
                age: 35,
                gender: ownerdetails.gender,
                customerNameEnglish: ownerdetails.ownerFullNameEnglish,
                customerNameArabic: ownerdetails.ownerFullNameArabic,
                nationality: ownerdetails.nationality,
                dateOfBirth: ownerdetails.ownerDobG?.split('-').reverse().join('-'),
                email: "yunlei.chang@ebaotech.com",
                mobile: ownerdetails.mobileNumber
            }
        };
    }
}
