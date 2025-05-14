import React from "react";
import { render, screen } from "@testing-library/react";
import HoemClaimDetails from "./index";
import RegisterClaim from "./RegisterClaim";
import { useApiCall } from "@dpm/shared-module";

jest.mock("./RegisterClaim", () => jest.fn(() => <div data-testid="register-claim-mock">RegisterClaim Component</div>));
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

describe("HoemClaimDetails Component", () => {
  const mockSetIsFirstPage = jest.fn();
  const mockBackBtnClickHandler = jest.fn();
  const mockClaimData = { claimId: "12345" };

  const mockMakeApiCall = jest.fn();
  const mockData = {
    config: {
      policy_holder: "Policy Holder",
      start_date: "Start Date",
      expiry_date: "Expiry Date",
    },
  };

  beforeEach(() => {
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: mockData,
    });
  });

  it("renders RegisterClaim component", () => {
    render(
      <HoemClaimDetails
        claimData={mockClaimData}
        backBtnClickHandler={mockBackBtnClickHandler}
        setIsFirstPage={mockSetIsFirstPage}
      />
    );

    // Check if RegisterClaim is rendered
    expect(screen.getByTestId("register-claim-mock")).toBeInTheDocument();
  });

  it("calls setIsFirstPage with false on mount", () => {
    render(
      <HoemClaimDetails
        claimData={mockClaimData}
        backBtnClickHandler={mockBackBtnClickHandler}
        setIsFirstPage={mockSetIsFirstPage}
      />
    );

    expect(mockSetIsFirstPage).toHaveBeenCalledWith(false);
  });

  it("calls makeApiCall on mount", () => {
    render(
      <HoemClaimDetails
        claimData={mockClaimData}
        backBtnClickHandler={mockBackBtnClickHandler}
        setIsFirstPage={mockSetIsFirstPage}
      />
    );

    expect(mockMakeApiCall).toHaveBeenCalled();
  });

  it("passes languageData to RegisterClaim when API data is available", () => {
    render(
      <HoemClaimDetails
        claimData={mockClaimData}
        backBtnClickHandler={mockBackBtnClickHandler}
        setIsFirstPage={mockSetIsFirstPage}
      />
    );

    expect(RegisterClaim).toHaveBeenCalledWith(
      expect.objectContaining({
        languageData: mockData.config,
      }),
      {}
    );
  });
});