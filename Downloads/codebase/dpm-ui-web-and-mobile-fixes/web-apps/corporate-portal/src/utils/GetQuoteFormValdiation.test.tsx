import { callValidation, getMaxLength } from "./GetQuoteFormValdiation"; 

describe("callValidation", () => {
  it("validates shouldStart5 rule", () => {
    expect(callValidation("shouldStart5", "0512345678")).toBe(true);
    expect(callValidation("shouldStart5", "0612345678")).toBe(false);
    expect(callValidation("shouldStart5", "05")).toBe(false);
  });

  it("validates emailValid rule", () => {
    expect(callValidation("emailValid", "test@example.com")).toBe(true);
    expect(callValidation("emailValid", "invalid-email")).toBe(false);
    expect(callValidation("emailValid", "test@.com")).toBe(false);
  });

  it("validates nonNegative rule", () => {
    expect(callValidation("nonNegative", "10")).toBe(true);
    expect(callValidation("nonNegative", "-1")).toBe(false);
    expect(callValidation("nonNegative", "abc")).toBe(false);
  });

  it("validates onlyDigits rule", () => {
    expect(callValidation("onlyDigits", "12345")).toBe(true);
    expect(callValidation("onlyDigits", "123a5")).toBe(false);
  });

  it("validates tenDigitsOnly rule", () => {
    expect(callValidation("tenDigitsOnly", "1234567890")).toBe(true);
    expect(callValidation("tenDigitsOnly", "123456789")).toBe(false);
    expect(callValidation("tenDigitsOnly", "12345678901")).toBe(false);
  });

  it("validates maxLength100 rule", () => {
    expect(callValidation("maxLength100", "a".repeat(100))).toBe(true);
    expect(callValidation("maxLength100", "a".repeat(101))).toBe(false);
  });

  it("validates maxLength200 rule", () => {
    expect(callValidation("maxLength200", "a".repeat(200))).toBe(true);
    expect(callValidation("maxLength200", "a".repeat(201))).toBe(false);
  });

  it("validates required rule", () => {
    expect(callValidation("required", "some input")).toBe(true);
    expect(callValidation("required", "    ")).toBe(false);
    expect(callValidation("required", "")).toBe(false);
  });

  it("returns true for unknown rule", () => {
    expect(callValidation("unknownRule", "anything")).toBe(true);
  });
});

describe("getMaxLength", () => {
  it("returns correct max length for known fields", () => {
    expect(getMaxLength("full_name")).toBe(100);
    expect(getMaxLength("company_name")).toBe(150);
    expect(getMaxLength("email_id")).toBe(30);
    expect(getMaxLength("additional_information")).toBe(255);
  });

  it("returns undefined for unknown field", () => {
    expect(getMaxLength("unknown_field")).toBeUndefined();
  });
});
