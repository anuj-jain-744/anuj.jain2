import React from "react";
import { render, screen } from "@testing-library/react";
import PolicyCardPage from "./index";
import * as sharedModule from "@dpm/shared-module";
import * as formatDateUtil from "utils/formatDate";
import * as policyDetailsUtil from "utils/policyDetails";
import { CommonProvider } from "@dpm/shared-module"; 

jest.mock("assets/PolicyDetails/userImg2.svg", () => "userImg2.svg");

describe("PolicyCardPage", () => {
  const mockUseCommonContext = jest.spyOn(sharedModule, "useCommonContext");
  const mockFormatDate = jest.spyOn(formatDateUtil, "formatDate");
  const mockFormatAddress = jest.spyOn(policyDetailsUtil, "formatAddress");

  beforeEach(() => {
    mockUseCommonContext.mockReturnValue({ currentLanguage: "en" });
    mockFormatDate.mockImplementation((date) => `formatted-${date}`);
    mockFormatAddress.mockImplementation((address, lang, ar) => "formatted-address");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const languageData = {
    national_id: "National ID",
    dob: "Date of Birth",
    nationality: "Nationality",
    mobile_number: "Mobile Number",
    addresses: "Address",
  };

  const policyCardValue = {
    customerNameArabic: "عربي",
    customerNameEnglish: "English Name",
    nationalId: "123456789",
    nationality: "Some Nationality",
    dateOfBirth: "1990-01-01",
    mobileNo: "0501234567",
    address: { street: "Street 1", city: "City" },
  };

  it("renders correctly with all data", () => {
    render(
      <CommonProvider>
        <PolicyCardPage policyCardValue={policyCardValue} languageData={languageData} />
      </CommonProvider>
    );
    
    expect(screen.getByText(policyCardValue.customerNameEnglish)).toBeInTheDocument();
    expect(screen.getByText(policyCardValue.customerNameArabic)).toBeInTheDocument();

    expect(screen.getByText(languageData.national_id)).toBeInTheDocument();
    expect(screen.getByText(languageData.dob)).toBeInTheDocument();
    expect(screen.getByText(languageData.nationality)).toBeInTheDocument();
    expect(screen.getByText(languageData.mobile_number)).toBeInTheDocument();
    expect(screen.getByText(languageData.addresses)).toBeInTheDocument();

    expect(screen.getByText(policyCardValue.nationalId)).toBeInTheDocument();
    expect(screen.getByText(`formatted-${policyCardValue.dateOfBirth}`)).toBeInTheDocument();
    expect(screen.getByText(policyCardValue.nationality)).toBeInTheDocument();
    expect(screen.getByText(policyCardValue.mobileNo)).toBeInTheDocument();
    expect(screen.getByText("formatted-address")).toBeInTheDocument();

    expect(screen.getByAltText("User")).toBeInTheDocument();
  });

  it("handles missing languageData gracefully", () => {
    render(
      <CommonProvider>
        <PolicyCardPage policyCardValue={policyCardValue} languageData={undefined} />
      </CommonProvider>
    );
    
    expect(screen.queryByText("National ID")).not.toBeInTheDocument();
    expect(screen.queryByText("Date of Birth")).not.toBeInTheDocument();

    expect(screen.getByText(policyCardValue.customerNameEnglish)).toBeInTheDocument();
  });

});
