import {
  compensationType,
  compensationTypeCard,
  compensationTypeCardFinalVAT,
  compensationTypeCardComprehensiveFinalVal,
  autoSuggestFinalVal,
  getFormattedDate,
  convertDateFormat,
  stepProgressRenew,
} from "./CommonFunction";
import ComprehensiveBanner from "assets/QuoteAndBuy/ComprehensiveBanner.png";
import ThirdpartyBanner from "assets/QuoteAndBuy/ThirdpartyBanner.png";
import { PolicyDetails } from "types/quoteAndBuy";
import { deductibleReferenceNo } from "../ConstantValue/ConstantValue";

describe("CommonFunction tests", () => {
  it("should return the correct banner for compensation type", () => {
    expect(compensationType("comprehensive")).toBe(ComprehensiveBanner);
    expect(compensationType("thirdparty")).toBe(ThirdpartyBanner);
  });

  it("should return the correct card for compensation type", () => {
    expect(compensationTypeCard("comprehensive")).toBe("Comprehensive");
    expect(compensationTypeCard("thirdparty")).toBe("Thirdparty");
  });

  it("should return the correct VAT percentage", () => {
    expect(compensationTypeCardFinalVAT(0.15)).toBe(15);
    expect(compensationTypeCardFinalVAT(0)).toBe(0);
  });

  it("should return the correct final value for comprehensive", () => {
    const mockPolicyDetails: PolicyDetails = {
      pricingOptions: [
        { deductibleReferenceNo, finalAmount: 100 },
        { deductibleReferenceNo: "other", finalAmount: 200 },
      ],
    };

    expect(
      compensationTypeCardComprehensiveFinalVal(mockPolicyDetails, null, null)
    ).toBe(100);
    expect(
      compensationTypeCardComprehensiveFinalVal(null, mockPolicyDetails, null)
    ).toBe(100);
    expect(
      compensationTypeCardComprehensiveFinalVal(null, null, mockPolicyDetails)
    ).toBe(100);
    expect(compensationTypeCardComprehensiveFinalVal(null, null, null)).toBe(0);
  });

  it("should return the correct auto suggest final value", () => {
    expect(autoSuggestFinalVal(100, 50)).toBe(50);
    expect(autoSuggestFinalVal(50, 100)).toBe(50);
    expect(autoSuggestFinalVal(0, 0)).toBe(0);
  });

  it("should return the correct formatted date", () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();
    const expectedDate = `${dd}/${mm}/${yyyy}`;

    expect(getFormattedDate()).toBe(expectedDate);
  });

  it("should convert date format from dd/mm/yyyy to mm/dd/yyyy", () => {
    expect(convertDateFormat("27/12/2024")).toBe("12/27/2024");
    expect(convertDateFormat("01/01/2024")).toBe("01/01/2024");
  });

  it("should return the correct step progress for renew", () => {
    const motorBuySteps = {
      step1: "Step 1",
      step2: "Step 2",
      step3: "Step 3",
    };
    const expectedSteps = {
      step2: "Step 2",
      step3: "Step 3",
    };

    expect(stepProgressRenew(motorBuySteps)).toEqual(expectedSteps);
  });
});
