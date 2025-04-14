import { calculatePremium } from "./calculatePremium";
describe("calculatePremium", () => {
  const mockPolicyDetails = {
    pricingOptions: [
      { 
        finalAmount: 1000,
        taxFeeBreakdowns: [ {percentage : 0.15}]
      }
    ],
  };
  const mockEmptyPolicyDetails = { 'wc': {pricingOptions: [] }};
   test("calculates premium with empty pricing options", () => {
    const result = calculatePremium(
      mockEmptyPolicyDetails
    );
    expect(result).toEqual({
      minFinalPrice: 0,
      vatPrice: undefined,
    });
  });
   test("calculates premium with mixed pricing options", () => {
    const mockPolicyDetailsData = { 'wc': mockPolicyDetails};
    const result = calculatePremium(mockPolicyDetailsData);
    expect(result).toEqual({
      minFinalPrice: 1000,
      vatPrice: 0.15
    });
  });
});
