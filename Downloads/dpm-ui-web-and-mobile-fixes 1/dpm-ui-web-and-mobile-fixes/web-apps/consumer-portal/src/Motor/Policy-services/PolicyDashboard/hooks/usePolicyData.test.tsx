import { renderHook } from '@testing-library/react-hooks';
import usePolicyData from './usePolicyData';
import reviewPolicyJson from './../../../../../__Mocks__/fixtures/ReviewPolicy.json';

describe('usePolicyData', () => {
    it('returns default structured data when no data is provided', () => {
        const { result } = renderHook(() => usePolicyData(null));

        expect(result.current).toEqual({
            policyDetails: null,
            policyHolderDetails: null,
            policyCard: null,
            vehicleDetails: [],
            policyPremiumAndBenefits: null,
        });
    });

    it('returns structured policy data when valid data is provided', () => {
        const modifiedReviewPolicyJson = {
            ...reviewPolicyJson,
            data: {
                ...reviewPolicyJson.data,
                policyLob: [
                    {
                        ...reviewPolicyJson.data.policyLob[0],
                        policyRisk: [
                            {
                                ...reviewPolicyJson.data.policyLob[0].policyRisk[0],
                                vehicleValue: undefined,
                            },
                        ],
                    },
                ],
            },
        };

        const { result } = renderHook(() => usePolicyData(modifiedReviewPolicyJson.data));

        expect(result.current).toBeDefined();
        expect(result.current.policyDetails).toEqual({
            policyNo: modifiedReviewPolicyJson.data.policyBasic.policyNumber,
            startDate: modifiedReviewPolicyJson.data.policyBasic.effectiveDate,
            expiryDate: modifiedReviewPolicyJson.data.policyBasic.expiryDate,
            idv: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0]?.vehicleValue,
            coverageName: expect.any(String),
        });

        expect(result.current.policyHolderDetails).toEqual({
            customerNameEnglish: modifiedReviewPolicyJson.data.policyCustomer[0].customerNameEnglish,
            customerNameArabic: modifiedReviewPolicyJson.data.policyCustomer[0].customerNameArabic,
            dateOfBirth: modifiedReviewPolicyJson.data.policyCustomer[0].dateOfBirth,
            idNumer: modifiedReviewPolicyJson.data.policyCustomer[0].nationalId,
            gender: modifiedReviewPolicyJson.data.policyCustomer[0].gender,
            licenseType: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0].drivers[0]?.licenseType || "",
            address: {
                streetName: modifiedReviewPolicyJson.data.policyCustomer[0].primaryAddress.streetName,
                city: modifiedReviewPolicyJson.data.policyCustomer[0].primaryAddress.city,
                country: modifiedReviewPolicyJson.data.policyCustomer[0].primaryAddress.country,
                postCode: modifiedReviewPolicyJson.data.policyCustomer[0].primaryAddress.postCode
            }
        });

        expect(result.current.vehicleDetails).toHaveLength(1);
        expect(result.current.vehicleDetails[0]).toEqual({
            registrationPlateNo: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0].plateNo,
            chassisNo: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0].chassisNo,
            typeOfChassis: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0]?.chassisType || "",
            vehicleMake: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0].vehicleMakeText,
            vehicleModel: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0].vehicleModelText,
            vehicleSequenceNo: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0].vehicleSequenceNo,
            yearOfManufacture: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0].manufactureYear,
            vehicleColor: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0].vehicleColour,
            transmission: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0].transmissionType,
            serialNo: modifiedReviewPolicyJson.data.policyLob[0].policyRisk[0]?.serialNo || "",
        });

        expect(result.current.policyPremiumAndBenefits).toEqual({
            premiumAmount: expect.any(Number),
            sumInsured: expect.any(String),
        });
    });
});