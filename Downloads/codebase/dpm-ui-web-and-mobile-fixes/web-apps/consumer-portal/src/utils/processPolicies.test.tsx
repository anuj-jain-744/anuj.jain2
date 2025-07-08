import { PolicyDetail } from "types/PolicyDetail";
import { processPolicies } from "./processPolicies";

describe("processPolicies", () => {
  it("should return an empty array when no policies are provided", () => {
    const policies: PolicyDetail[] = [];
    const result = processPolicies(policies);
    expect(result).toEqual([]);
  });

  it("should return the policy when a single policy with null endorsementNo is provided", () => {
    const policies: PolicyDetail[] = [
      { policyNo: "123", endorsementNo: null } as PolicyDetail,
    ];
    const result = processPolicies(policies);
    expect(result).toEqual(policies);
  });

  it("should return an empty array when a single policy with non-null endorsementNo is provided", () => {
    const policies: PolicyDetail[] = [
      { policyNo: "123", endorsementNo: "001" } as PolicyDetail,
    ];
    const result = processPolicies(policies);
    expect(result).toEqual([]);
  });

  it("should return the latest policy when multiple policies with mixed endorsementNo values are provided", () => {
    const policies: PolicyDetail[] = [
      { policyNo: "123", endorsementNo: null } as PolicyDetail,
      { policyNo: "123", endorsementNo: "002" } as PolicyDetail,
      { policyNo: "123", endorsementNo: "001" } as PolicyDetail,
    ];
    const result = processPolicies(policies);
    expect(result).toEqual([{ policyNo: "123", endorsementNo: "002" }]);
  });

  it("should return an empty array when multiple policies with all null endorsementNo values are provided", () => {
    const policies: PolicyDetail[] = [
      { policyNo: "123", endorsementNo: null } as PolicyDetail,
      { policyNo: "123", endorsementNo: null } as PolicyDetail,
    ];
    const result = processPolicies(policies);
    expect(result).toEqual([]);
  });

  it("should return the latest policy when multiple policies with all non-null endorsementNo values are provided", () => {
    const policies: PolicyDetail[] = [
      { policyNo: "123", endorsementNo: "001" } as PolicyDetail,
      { policyNo: "123", endorsementNo: "002" } as PolicyDetail,
    ];
    const result = processPolicies(policies);
    expect(result).toEqual([{ policyNo: "123", endorsementNo: "002" }]);
  });
});