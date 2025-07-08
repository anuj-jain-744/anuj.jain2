import {
  getCoverageDetails,
  getCoveragePlanName,
  getNoOfTravellers,
} from "./getCoverageDetails";
import {
  TRAVEL_COVERAGE_TYPE,
  coveragePlanTypeIdMap,
  coverageTypeIdMap,
} from "constant";

describe("Travel coverage utilities", () => {
  describe("getCoverageDetails", () => {
    it("returns correct coverage value for each coverage code 1 to 7", () => {
      expect(getCoverageDetails("1")).toBe(TRAVEL_COVERAGE_TYPE.type_one);
      expect(getCoverageDetails("2")).toBe(TRAVEL_COVERAGE_TYPE.type_two);
      expect(getCoverageDetails("3")).toBe(TRAVEL_COVERAGE_TYPE.type_three);
      expect(getCoverageDetails("4")).toBe(TRAVEL_COVERAGE_TYPE.type_four);
      expect(getCoverageDetails("5")).toBe(TRAVEL_COVERAGE_TYPE.type_five);
      expect(getCoverageDetails("6")).toBe(TRAVEL_COVERAGE_TYPE.type_six);
      expect(getCoverageDetails("7")).toBe(TRAVEL_COVERAGE_TYPE.type_seven);
    });

    it("returns empty string for unknown coverage code", () => {
      expect(getCoverageDetails("unknown")).toBe("");
      expect(getCoverageDetails("0")).toBe("");
      expect(getCoverageDetails("")).toBe("");
    });
  });

  describe("getCoveragePlanName", () => {
    it("returns correct coverage value for worldwide coverageTypeIdMap", () => {
      expect(
        getCoveragePlanName(
          coverageTypeIdMap.worldwide,
          coveragePlanTypeIdMap.type1
        )
      ).toBe(TRAVEL_COVERAGE_TYPE.type_one);

      expect(
        getCoveragePlanName(
          coverageTypeIdMap.worldwide,
          coveragePlanTypeIdMap.type2
        )
      ).toBe(TRAVEL_COVERAGE_TYPE.type_two);

      expect(
        getCoveragePlanName(
          coverageTypeIdMap.worldwide,
          "someOtherPlanVal"
        )
      ).toBe(TRAVEL_COVERAGE_TYPE.type_seven);
    });

    it("returns correct coverage value for worldwide1 coverageTypeIdMap", () => {
      expect(
        getCoveragePlanName(
          coverageTypeIdMap.worldwide1,
          coveragePlanTypeIdMap.type1
        )
      ).toBe(TRAVEL_COVERAGE_TYPE.type_three);

      expect(
        getCoveragePlanName(
          coverageTypeIdMap.worldwide1,
          "someOtherPlanVal"
        )
      ).toBe(TRAVEL_COVERAGE_TYPE.type_four);
    });

    it("returns correct coverage value for europe coverageTypeIdMap", () => {
      expect(
        getCoveragePlanName(
          coverageTypeIdMap.europe,
          coveragePlanTypeIdMap.type5
        )
      ).toBe(TRAVEL_COVERAGE_TYPE.type_six);

      expect(
        getCoveragePlanName(
          coverageTypeIdMap.europe,
          "someOtherPlanVal"
        )
      ).toBe(TRAVEL_COVERAGE_TYPE.type_five);
    });

    it("returns empty string if coverageCodeReceived does not match any case", () => {
      expect(getCoveragePlanName("unknown", coveragePlanTypeIdMap.type1)).toBe(
        ""
      );
    });
  });

  describe("getNoOfTravellers", () => {
    it("returns length of policyRisk array when valid data is passed", () => {
      const mockPolicyData = [
        {
          policyRisk: [{}, {}, {}],
        },
      ];
      expect(getNoOfTravellers(mockPolicyData)).toBe(3);
    });

    it("returns 0 when policyDataReceived is undefined", () => {
      expect(getNoOfTravellers(undefined)).toBe(0);
    });

    it("returns 0 when policyDataReceived is empty array", () => {
      expect(getNoOfTravellers([])).toBe(0);
    });

    it("returns undefined when policyRisk is undefined", () => {
      const mockPolicyData = [{}];
      expect(getNoOfTravellers(mockPolicyData)).toBe(undefined);
    });
  });
});
