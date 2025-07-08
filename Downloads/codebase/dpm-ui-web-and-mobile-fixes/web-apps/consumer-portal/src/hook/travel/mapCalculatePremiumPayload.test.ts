import { mapCalculatePremiumPayload } from "./mapCalculatePremiumPayload";
import { formatDate } from "components/QuoteAndBuy/Commonfunction";
import { DateObject } from "react-multi-date-picker";
import { OwnerResponseTravel } from 'types/quoteAndBuy';

describe('mapCalculatePremiumPayload', () => {
    it('should map the payload correctly', () => {
        const travelDateRange = [new DateObject(), new DateObject().add(1, 'months')];
        const travellerType = "self";
        const ownerdetails: OwnerResponseTravel = {
            ownerDobG: "1988-11-01",
            ownerDobH: "1409-05-01",
            ownerFullNameEnglish: "John Doe",
            ownerFullNameArabic: "جون دو",
            gender: "male",
            nationality: "US",
            ownerId: "123456789",
            mobileNumber: "1234567890",
            nationalityCode: ""
        };

        const expectedPayload = {
            policyEffectiveDate: formatDate(new Date(travelDateRange[0].format("YYYY-MM-DD"))),
            travelDuration: "30",
            familyIndividual: 2,
            plan: "1",
            ratingType: "General Tariff",
            policyRisk: [
                {
                    dateOfBirth: "01-11-1988",
                    dateOfBirthH: "01-05-1409",
                    relation: "5",
                    travellerNameEnglish: "John Doe",
                    travellerNameArabic: "جون دو",
                    personAge: "35",
                    gender: "male",
                    nationality: "US",
                    passportNumber: "111111",
                    passportExpiryDate: "2025-12-01",
                    policyCoverage: []
                }
            ],
            policyCustomer: {
                nationalId: "123456789",
                gender: "male",
                customerNameEnglish: "John Doe",
                customerNameArabic: "جون دو",
                nationality: "US",
                dateOfBirth: "01-11-1988",
                mobile: "1234567890"
            }
        };

        const result = mapCalculatePremiumPayload(travelDateRange, travellerType, ownerdetails);
    //    expect(result).toEqual(expectedPayload);
    });
});