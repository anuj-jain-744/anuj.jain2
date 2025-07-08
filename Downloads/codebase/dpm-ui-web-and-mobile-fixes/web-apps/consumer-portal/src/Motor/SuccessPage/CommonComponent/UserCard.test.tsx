import React from "react";
import { render } from "@testing-library/react";
import UserCard from "./UserCard";
import { jest } from "@jest/globals";
import { SuccessPagePolicyData } from "types/quoteAndBuy";

const mockLanguageData = {
  iqama_no: "Iqama No",
  mobile_number: "Mobile Number",
  national_id: "National ID",
  field_corporate_id: "Corporate ID",
};

test("renders UserCard component with valid policyData and languageData", () => {
  const mockPolicyData: SuccessPagePolicyData = {
      customerNameEnglish: "John Doe",
      customerNameArabic: "جون دو",
      gender: "male",
      nationalityId: "1234567890",
      mobileNo: "0555555555",
      policyNo: "POLICY123",
      startDate: "2025-01-01",
      expiryDate: "2026-01-01",
      coverageName: "Full Coverage",
      premiumAmount: "1000",
      sumInsured: "50000",
      repairCondition: "New",
      vehicleMake: "Toyota",
  };

  const { getByAltText, getByText } = render(
    <UserCard policyData={mockPolicyData} languageData={mockLanguageData} />
  );

  expect(getByAltText("user icon")).toBeInTheDocument();
  expect(getByText("John Doe")).toBeInTheDocument();
  expect(getByText("جون دو")).toBeInTheDocument();
  expect(getByText("1234567890")).toBeInTheDocument();
  expect(getByText("0555555555")).toBeInTheDocument();
});

test("renders UserCard component with missing policyData", () => {
  const { queryByAltText, queryByText } = render(
    <UserCard policyData={undefined} languageData={mockLanguageData} />
  );

  expect(queryByAltText("user icon")).toBeInTheDocument();
  expect(queryByText(mockLanguageData.iqama_no)).not.toBeInTheDocument();
  expect(queryByText(mockLanguageData.mobile_number)).toBeInTheDocument();
});

test("renders UserCard component with missing languageData", () => {
  const mockPolicyData: SuccessPagePolicyData = {
      customerNameEnglish: "John Doe",
      customerNameArabic: "جون دو",
      gender: "male",
      nationalityId: "1234567890",
      mobileNo: "0555555555",
      policyNo: "POLICY123",
      startDate: "2025-01-01",
      expiryDate: "2026-01-01",
      coverageName: "Full Coverage",
      premiumAmount: "1000",
      sumInsured: "50000",
      repairCondition: "New",
      vehicleMake: "Toyota",
  };

  const { queryByText } = render(
    <UserCard policyData={mockPolicyData} languageData={undefined} />
  );

  expect(queryByText("John Doe")).toBeInTheDocument();
  expect(queryByText("جون دو")).toBeInTheDocument();
  expect(queryByText("1234567890")).toBeInTheDocument();
  expect(queryByText("0555555555")).toBeInTheDocument();
});

test("calls utility functions correctly", () => {
  const mockPolicyData: SuccessPagePolicyData = {
      customerNameEnglish: "John Doe",
      customerNameArabic: "جون دو",
      gender: "male",
      nationalityId: "1234567890",
      mobileNo: "0555555555",
      policyNo: "POLICY123",
      startDate: "2025-01-01",
      expiryDate: "2026-01-01",
      coverageName: "Full Coverage",
      premiumAmount: "1000",
      sumInsured: "50000",
      repairCondition: "New",
      vehicleMake: "Toyota",
  };

  const mockGetGenderProfileIcon = jest.fn(() => "mock-icon-url");
  const mockTruncateName = jest.fn(() => "Truncated Name");

  jest.mock("utils/quoteAndBuy", () => ({
    getGenderProfileIcon: mockGetGenderProfileIcon,
    truncateName: mockTruncateName,
  }));

  render(
    <UserCard policyData={mockPolicyData} languageData={mockLanguageData} />
  );

});

test("handles getLabelOfIqmaIdNationalId correctly", () => {
  const mockPolicyData: SuccessPagePolicyData = {
    customerNameEnglish: "John Doe",
    customerNameArabic: "جون دو",
    gender: "male",
    nationalityId: "1234567890",
    mobileNo: "0555555555",
    policyNo: "POLICY123",
    startDate: "2025-01-01",
    expiryDate: "2026-01-01",
    coverageName: "Full Coverage",
    premiumAmount: "1000",
    sumInsured: "50000",
    repairCondition: "New",
    vehicleMake: "Toyota",
  };

  const mockGetLabelOfIqmaIdNationalId = jest.fn(() => "Iqama Label");

  jest.mock("@dpm/shared-module", () => ({
    getLabelOfIqmaIdNationalId: mockGetLabelOfIqmaIdNationalId,
  }));

  render(
    <UserCard policyData={mockPolicyData} languageData={mockLanguageData} />
  );

});
