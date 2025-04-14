import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HoemClaimDetails from "./index";
import { BrowserRouter } from "react-router-dom";

const mockBackBtnClickHandler = jest.fn();
const mockSetIsFirstPage = jest.fn();

const mockClaimData = {
  policyList: [
    { policyNo: "12345" },
    { policyNo: "67890" },
  ],
};

const mockLanguageData = {
  select_policy: "Select Policy",
  no_policy_found_nationalid: "No policy found for the given national ID",
};

describe("HoemClaimDetails Component", () => {
  test("renders component correctly", () => {
    render(
      <BrowserRouter>
        <HoemClaimDetails
          claimData={mockClaimData}
          languageData={mockLanguageData}
          backBtnClickHandler={mockBackBtnClickHandler}
          setIsFirstPage={mockSetIsFirstPage}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/Select Policy/i)).toBeInTheDocument();
  });

  test("renders dropdown with policies", () => {
    render(
      <BrowserRouter>
        <HoemClaimDetails
          claimData={mockClaimData}
          languageData={mockLanguageData}
          backBtnClickHandler={mockBackBtnClickHandler}
          setIsFirstPage={mockSetIsFirstPage}
        />
      </BrowserRouter>
    );

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();
    fireEvent.change(dropdown, { target: { value: "67890" } });
    expect(dropdown).toHaveValue("67890");
  });

  test("triggers back button click", () => {
    render(
      <BrowserRouter>
        <HoemClaimDetails
          claimData={mockClaimData}
          languageData={mockLanguageData}
          backBtnClickHandler={mockBackBtnClickHandler}
          setIsFirstPage={mockSetIsFirstPage}
        />
      </BrowserRouter>
    );

    const backButton = screen.getByText(/Back/i);
    fireEvent.click(backButton);
    expect(mockBackBtnClickHandler).toHaveBeenCalled();
  });

  test("displays no policy message when policyList is empty", () => {
    render(
      <BrowserRouter>
        <HoemClaimDetails
          claimData={{ policyList: [] }}
          languageData={mockLanguageData}
          backBtnClickHandler={mockBackBtnClickHandler}
          setIsFirstPage={mockSetIsFirstPage}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/No policy found for the given national ID/i)).toBeInTheDocument();
  });
});
