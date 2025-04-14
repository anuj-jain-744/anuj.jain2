import { PremiumBreakdown } from "./quoteAndBuy";

export interface ViewQuotePayload {
    quotationNo: string;
}

export interface PolicyLobProps  {
    familyIndividual?: string;
    typeOfCoverage?: string;
    policyRisk: {
        travellerNameEnglish?: string;
        vehicleValue?: string;
        drivers: {
            licenseType: number | string;
        }[],
        benefits?: {
            benefitCode: string;
            benefitNameEn: string;
            benefitValue: string;
            benefitNameAr: string;
            benefitPrice: number;
        }[],
    }[]
}
export interface PolicyDataProps {
        policyBasic: {
            policyNumber?: string;
            productCode?: string;
            effectiveDate?: string;
            expiryDate?: string;
            premiumInfo: {
                finalPremium: number;
                premiumDue: number;
                premiumBreakdowns: PremiumBreakdown[],
                taxFeeBreakdowns: PremiumBreakdown[],
                sumInsured: number;
            },
            requestReferenceNo: string;
            quoteNumber: string;
        },
        planDetails: PolicyLobProps[],
        policyLob: PolicyLobProps[],
        policyCustomer: {
            nationalId: string;
            customerNameEnglish?: string;
            customerNameArabic?: string;
            dateOfBirth: string;
            gender: string;
            nationality: string;
            mobile: string;
            primaryAddress: {
                streetName: string;
                city: string;
                country: string;
                postCode: string;
            },
            
        }[],
    }

export interface ViewQuoteResponse {
    model: PolicyDataProps;
}