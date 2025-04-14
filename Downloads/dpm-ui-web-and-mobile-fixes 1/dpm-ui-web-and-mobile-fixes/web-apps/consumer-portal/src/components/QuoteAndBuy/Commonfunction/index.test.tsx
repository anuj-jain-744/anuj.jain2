import { 
  compensationTypeCardFinalVAT, 
  worldwidecalculatePremium, 
  worldwideexceptcalculatePremium, 
  europecalculatePremium,
  formatDate
} from "./index";

const mockTravelApiResponse = (finalAmount, vat, adminFee, premiumDue) => ({
  pricingOptions: [
    {
      finalAmount,
      taxFeeBreakdowns: [
        { amount: vat },
        { amount: adminFee }
      ],
      premiumDue,
    }
  ]
});

describe("compensationTypeCardFinalVAT", () => {
  test("should return VAT percentage", () => {
    expect(compensationTypeCardFinalVAT(0.2)).toBe(20);
    expect(compensationTypeCardFinalVAT(0)).toBe(0);
    expect(compensationTypeCardFinalVAT(1)).toBe(100);
  });
});

describe("worldwidecalculatePremium", () => {
  test("should calculate premiums correctly", () => {
    const data1 = mockTravelApiResponse(100, 10, 5, 85);
    const data2 = mockTravelApiResponse(150, 15, 7, 128);
    const result = worldwidecalculatePremium(data1, data2);
    
    expect(result.minFinalPrice).toBe(100);
    expect(result.dataworldwidepearlFinalPrice).toBe(100);
    expect(result.dataworldwidetravellerFinalPrice).toBe(150);
    expect(result.dataworldwidepearlVAT).toBe(10);
  });
});

describe("worldwideexceptcalculatePremium", () => {
  test("should calculate premiums correctly", () => {
    const data1 = mockTravelApiResponse(80, 8, 4, 68);
    const data2 = mockTravelApiResponse(120, 12, 6, 102);
    const result = worldwideexceptcalculatePremium(data1, data2);
    
    expect(result.minFinalPrice).toBe(80);
    expect(result.dataworldwideexceptpearlFinalPrice).toBe(80);
    expect(result.dataworldwideexcepttravellerFinalPrice).toBe(120);
    expect(result.dataworldwideexceptpearlVAT).toBe(8);
  });
});

describe("europecalculatePremium", () => {
  test("should calculate premiums correctly", () => {
    const data1 = mockTravelApiResponse(90, 9, 5, 76);
    const data2 = mockTravelApiResponse(110, 11, 6, 93);
    const result = europecalculatePremium(data1, data2);
    
    expect(result.minFinalPrice).toBe(90);
    expect(result.dataEuropeeuropeFinalPrice).toBe(90);
    expect(result.dataEuropeschengenFinalPrice).toBe(110);
    expect(result.dataEuropeeuropeVAT).toBe(9);
  });
});

describe("formatDate", () => {
  test("should return correctly formatted date", () => {
    const date = new Date("2025-03-20T15:30:45");
    expect(formatDate(date)).toBe("2025-03-20T15:30:45");
  });
});
