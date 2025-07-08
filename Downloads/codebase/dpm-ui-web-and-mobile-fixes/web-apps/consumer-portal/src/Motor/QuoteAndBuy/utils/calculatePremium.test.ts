import { calculatePremium } from "./calculatePremium";
import { PolicyDetails } from "types/quoteAndBuy";

describe("calculatePremium", () => {
  const mockPolicyDetails: PolicyDetails = {
    pricingOptions: [
      { deductibleReferenceNo: 1, deductibleAmount: 500, finalAmount: 1000 },
      { deductibleReferenceNo: 2, deductibleAmount: 1000, finalAmount: 1500 },
      { deductibleReferenceNo: 3, deductibleAmount: 1500, finalAmount: 2000 },
    ],
  };
  const mockEmptyPolicyDetails: PolicyDetails = { pricingOptions: [] };

  test("calculates premium with sliderValueDeductibles", () => {
  const result = calculatePremium(
    mockPolicyDetails,
    mockPolicyDetails,
    mockPolicyDetails
  );
  expect(result).toEqual({
    minFinalPrice: 1000,
    compWorkShopFinalPrice: 1000, // Updated from 1500 to 1000
    compAgencyFinalPrice: 1000,
    compMathFinalPrice: 1000,
    compWorkShopData: {
      deductibleReferenceNo: 1, // Updated from 2 to 1
      deductibleAmount: 500, // Updated from 1000 to 500
      finalAmount: 1000, // Updated from 1500 to 1000
    },
    compAgencyData: {
      deductibleReferenceNo: 1,
      deductibleAmount: 500,
      finalAmount: 1000,
    },
    compMataData: {
      deductibleReferenceNo: 1,
      deductibleAmount: 500,
      finalAmount: 1000,
    },
  });
  });

  test("calculates premium without sliderValueDeductibles", () => {
    const result = calculatePremium(
      mockPolicyDetails,
      mockPolicyDetails,
      mockPolicyDetails
    );
    expect(result).toEqual({
      minFinalPrice: 1000,
      compWorkShopFinalPrice: 1000,
      compAgencyFinalPrice: 1000,
      compMathFinalPrice: 1000,
      compWorkShopData: {
        deductibleReferenceNo: 1,
        deductibleAmount: 500,
        finalAmount: 1000,
      },
      compAgencyData: {
        deductibleReferenceNo: 1,
        deductibleAmount: 500,
        finalAmount: 1000,
      },
      compMataData: {
        deductibleReferenceNo: 1,
        deductibleAmount: 500,
        finalAmount: 1000,
      },
    });
  });

  test("calculates premium with empty pricing options", () => {
    const result = calculatePremium(
      mockEmptyPolicyDetails,
      mockEmptyPolicyDetails,
      mockEmptyPolicyDetails
    );
    expect(result).toEqual({
      minFinalPrice: null,
      compWorkShopFinalPrice: undefined,
      compAgencyFinalPrice: undefined,
      compMathFinalPrice: undefined,
      compWorkShopData: undefined,
      compAgencyData: undefined,
      compMataData: undefined,
    });
  });

  test("calculates premium with undefined pricing options", () => {
    const result = calculatePremium(
      { pricingOptions: undefined },
      { pricingOptions: undefined },
      { pricingOptions: undefined }
    );
    expect(result).toEqual({
      minFinalPrice: null,
      compWorkShopFinalPrice: undefined,
      compAgencyFinalPrice: undefined,
      compMathFinalPrice: undefined,
      compWorkShopData: undefined,
      compAgencyData: undefined,
      compMataData: undefined,
    });
  });

  test("calculates premium with mixed pricing options", () => {
    const result = calculatePremium(mockPolicyDetails, mockEmptyPolicyDetails, {
      pricingOptions: undefined,
    });
    expect(result).toEqual({
      minFinalPrice: 1000,
      compWorkShopFinalPrice: 1000,
      compAgencyFinalPrice: undefined,
      compMathFinalPrice: undefined,
      compWorkShopData: {
        deductibleReferenceNo: 1,
        deductibleAmount: 500,
        finalAmount: 1000,
      },
      compAgencyData: undefined,
      compMataData: undefined,
    });
  });
});